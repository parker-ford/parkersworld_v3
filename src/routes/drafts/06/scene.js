import GUI from 'lil-gui'; 
import Stats from 'stats-js'
import { init } from 'svelte/internal';

const CANVAS_SIZE = 512;
const WORKGROUP_SIZE = 8;
let step = 0;

const gui = new GUI()
gui.domElement.id = 'gui';
const parameters = {
    updateInterval : 100,
    gridSize : 64,
    gridSizePower : 6,
}

export const createScene = async (el) => {

    /*
        Compatibility Checks & GPU Setup
    */

    if(!navigator.gpu) {
        throw new Error("WebGPU not supported on this browser");
    }
    const adapter = await navigator.gpu.requestAdapter();
    if(!adapter) {
        throw new Error("No appropriate GPUAdapter found.");
    }
    const device = await adapter.requestDevice();

    /*
        Canvas Setup
    */

    el.width = CANVAS_SIZE;
    el.height = CANVAS_SIZE;
    const context = el.getContext("webgpu");
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: canvasFormat
    });


    /*
        Grid Setup
    */
    const vertices = new Float32Array([
        -0.8, -0.8,
         0.8, -0.8,
         0.8,  0.8,

        -0.8, -0.8,
         0.8,  0.8,
        -0.8,  0.8,
    ]);

    let vertexBuffer;
    let vertexBufferLayout;
    let cellStateArray;
    let uniformArray;
    let uniformBuffer;
    let cellStateStorage; 
    let cellShaderModule;
    let simulationShaderModule;
    let bindGroupLayout;
    let bindGroups;
    let pipelineLayout;
    let cellPipeline;
    let simulationPipeline;

    const initializeVertexBuffer = () => {
        vertexBuffer = device.createBuffer({
            label: "Cell vertices",
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
    
        device.queue.writeBuffer(vertexBuffer, 0, vertices);
    
        vertexBufferLayout = {
            arrayStride: 8,
            attributes: [{
                format: "float32x2",
                offset: 0,
                shaderLocation: 0,
            }],
        };
    }

    const initializeGrid = () => {
        console.log(parameters.gridSize)
       uniformArray = new Float32Array([parameters.gridSize, parameters.gridSize]);
       uniformBuffer = device.createBuffer({
           label: "Grid Uniforms",
           size: uniformArray.byteLength,
           usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
       });
       device.queue.writeBuffer(uniformBuffer, 0, uniformArray);
       cellStateArray = new Uint32Array(parameters.gridSize * parameters.gridSize);
   
       cellStateStorage = [
           device.createBuffer({
               label: "Cell State A",
               size: cellStateArray.byteLength,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
           }),
           device.createBuffer({
               label: "Cell State B",
               size: cellStateArray.byteLength,
               usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
           })
       ]
    }

    const initializeCells = () => {
        for(let i = 0 ; i < cellStateArray.length; i++){
            cellStateArray[i] = Math.random() > 0.6 ? 2 : 0;
        }
        device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);
    }

    const initalizeShaderModules = () => {

        cellShaderModule = device.createShaderModule({
            label: "Cell shader",
            code: `
    
                struct VertexInput {
                    @location(0) pos: vec2f,
                    @builtin(instance_index) instance: u32
                };
    
                struct VertexOutput {
                    @builtin(position) pos: vec4f,
                    @location(0) cell: vec2f,
                    @location(1) state: f32,
                }
    
                @group(0) @binding(0) var<uniform> grid: vec2f;
                @group(0) @binding(1) var<storage> cellState: array<u32>;
                @vertex
                fn vertexMain(input: VertexInput) -> VertexOutput {
                    let i = f32(input.instance);
                    let cell = vec2f(i % grid.x ,floor(i / grid.x));
                    let state = f32(cellState[input.instance]);
    
                    let cellOffset = cell / grid * 2;
                    let gridPos = (input.pos * (state / 2) + 1) / grid - 1 + cellOffset;
                    
                    var output: VertexOutput;
                    output.pos = vec4f(gridPos, 0, 1);
                    output.cell = cell;
                    output.state = state;
                    return output;
                }
    
                @fragment
                fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
                    let c = input.cell / grid;
                    return vec4f(c, 1-c.x, 1) / (input.state % 2 + 1);
                }
    
            `
        });
    
        simulationShaderModule = device.createShaderModule({
            label: "Game of Life simulation shader",
            code: `
            @group(0) @binding(0) var<uniform> grid: vec2f;
            @group(0) @binding(1) var<storage> cellStateIn: array<u32>;
            @group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;
    
                fn cellIndex(cell: vec2u) -> u32 {
                    return (cell.y % u32(grid.y)) * u32(grid.x) +
                        (cell.x % u32(grid.x));
                }
    
                fn cellState(x: u32, y: u32) -> u32{
                    return cellStateIn[cellIndex(vec2(x, y))];
                }

                fn isCellAlive(x: u32, y: u32) -> u32{
                    return cellStateIn[cellIndex(vec2(x,y))] / 2;
                }

                fn countNeighbors(x: u32, y: u32) -> u32{
                    let activeNeighbors =   isCellAlive(x+1, y+1) +
                                            isCellAlive(x+1, y) +
                                            isCellAlive(x+1, y-1) +
                                            isCellAlive(x, y-1) +
                                            isCellAlive(x-1, y-1) +
                                            isCellAlive(x-1, y) +
                                            isCellAlive(x-1, y+1) +
                                            isCellAlive(x, y+1);

                    return activeNeighbors;
                }
    
                @compute
                @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE})
                fn computeMain(@builtin(global_invocation_id) cell: vec3u) {

                    let currState = cellState(cell.x, cell.y);
                    let i = cellIndex(cell.xy);
                    switch currState {
                        case 2: {
                            cellStateOut[i] = 1;
                        }
                        case 1: {
                            cellStateOut[i] = 0;
                        }
                        case 0: {
                            if(countNeighbors(cell.x, cell.y) == 2){
                                cellStateOut[i] = 2;
                            }
                            else{
                                cellStateOut[i] = 0;
                            }
                        }
                        default: {
                            cellStateOut[i] = 0;
                        }
                    }
                }
            `
        });
    }

    const initializeBindGroups = () => {

        // Create the bind group layout and pipeline layout.
        bindGroupLayout = device.createBindGroupLayout({
            label: "Cell Bind Group Layout",
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
                buffer: {} // Grid uniform buffer
            }, {
                binding: 1,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
                buffer: { type: "read-only-storage"} // Cell state input buffer
            }, {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "storage"} // Cell state output buffer
            }]
        });
    
        //Creates a bind group
        //a bind group is a collection of resources that you want to make accessible to your shader at the same time.
        bindGroups = [
            device.createBindGroup({
                label: "Cell renderer bind group A",
                layout: bindGroupLayout, // Updated Line
                entries: [{
                binding: 0,
                resource: { buffer: uniformBuffer }
                }, {
                binding: 1,
                resource: { buffer: cellStateStorage[0] }
                }, {
                binding: 2, // New Entry
                resource: { buffer: cellStateStorage[1] }
                }],
            }),
            device.createBindGroup({
                label: "Cell renderer bind group B",
                layout: bindGroupLayout, // Updated Line
    
                entries: [{
                binding: 0,
                resource: { buffer: uniformBuffer }
                }, {
                binding: 1,
                resource: { buffer: cellStateStorage[1] }
                }, {
                binding: 2, // New Entry
                resource: { buffer: cellStateStorage[0] }
                }],
            }),
        ];
    
        pipelineLayout = device.createPipelineLayout({
            label: "Cell Pipeline Layout",
            bindGroupLayouts: [ bindGroupLayout ],
        });
    }

    const initializePipelines = () => {

        //defines render pipeline
        cellPipeline = device.createRenderPipeline({
            label: "Cell pipeline",
            layout: pipelineLayout, // Updated!
            vertex: {
                module: cellShaderModule,
                entryPoint: "vertexMain",
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: cellShaderModule,
                entryPoint: "fragmentMain",
                targets: [{
                format: canvasFormat
                }]
            }
        });
    
        // Create a compute pipeline that updates the game state.
        simulationPipeline = device.createComputePipeline({
            label: "Simulation pipeline",
            layout: pipelineLayout,
            compute: {
                module: simulationShaderModule,
                entryPoint: "computeMain",
            }
        });
    }

    const resetSystem = () => {
        initializeVertexBuffer();
        initializeGrid();
        initializeCells();
        initalizeShaderModules();
        initializeBindGroups();
        initializePipelines();
        step = 0;
    }

    resetSystem();

    const tick = () => {

        //Create GPUCommandEncoder to rpove an interface for recording GPU commands
        const encoder = device.createCommandEncoder();
    
        const computePass = encoder.beginComputePass();
    
        computePass.setPipeline(simulationPipeline);
        computePass.setBindGroup(0, bindGroups[step % 2]);
    
        const workgroupCount = Math.ceil(parameters.gridSize / WORKGROUP_SIZE);
        computePass.dispatchWorkgroups(workgroupCount, workgroupCount);
    
        computePass.end();
    
        step++;
    
        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                clearValue: {r: 0, g: 0, b: 0.4, a:1},
                storeOp: "store",
            }]
        });
    
        pass.setPipeline(cellPipeline);
        pass.setBindGroup(0, bindGroups[step % 2]);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.draw(vertices.length / 2, parameters.gridSize * parameters.gridSize );
    
        pass.end();
    
        device.queue.submit([encoder.finish()]);
    
    }
    
    let intervalId = setInterval(tick, parameters.updateInterval);

    gui.add(parameters, 'updateInterval').min(10).max(200).step(1).onChange((value) => {
        clearInterval(intervalId);
        intervalId = setInterval(tick, value);
    })

    gui.add(parameters, 'gridSizePower').min(2).max(9).step(1).onChange((value) => {
        parameters.gridSize = Math.pow(2, value);
        resetSystem();
    })

    const button = {
        action: resetSystem
    }
    gui.add(button, 'action').name('Restart')

}



