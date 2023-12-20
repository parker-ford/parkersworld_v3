export const createScene = async (el, onLoaded) => {
    onLoaded();

    el.width = 512;
    el.height = 512;

    const ctx = el.getContext('webgpu');
    const gpu = navigator.gpu;
    const adapter = await gpu.requestAdapter();
    const device = await adapter.requestDevice();


    var positions = new Float32Array([
        -1, -1, -1, 
         1, -1, -1,
         1,  1, -1,
        -1,  1, -1,

        -1, -1,  1,
         1, -1,  1,
         1,  1,  1,
        -1,  1,  1,

        -1, -1, -1,
        -1,  1, -1,
        -1,  1,  1,
        -1, -1,  1,

         1, -1, -1,
         1,  1, -1,
         1,  1,  1,
         1, -1,  1,

         -1, -1, -1,
         -1, -1,  1,
          1, -1,  1,
          1, -1, -1,

         -1,  1, -1,
         -1,  1,  1,
          1,  1,  1,
          1,  1, -1
    ]);


    var indices = new Uint32Array([
        0,1,2,
        0,2,3,
        4,5,6,
        4,6,7,
        8,9,10,
        8,10,11,
        12,13,14,
        12,14,15,
        16,17,18,
        16,18,19,
        20,21,22,
        20,22,23
    ]);

    var colors = new Float32Array([
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,

        1,1,0,
        1,1,0,
        1,1,0,
        1,1,0,

        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,

        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,

        1,1,0,
        1,1,0,
        1,1,0,
        1,1,0,

        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0
        
    ]);

    const positionBuffer = device.createBuffer({
        size: positions.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    const colorBuffer = device.createBuffer({
        size: colors.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    const indexBuffer = device.createBuffer({
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });

    device.queue.writeBuffer(positionBuffer, 0, positions);
    device.queue.writeBuffer(colorBuffer, 0, colors);
    device.queue.writeBuffer(indexBuffer, 0, indices);

    const devicePixelRatio = window.devicePixelRatio || 1;
    const presentationSize = [
        el.clientWidth * devicePixelRatio,
        el.clientHeight * devicePixelRatio
    ];
    // const presentationFormat = context.getPreferredFormat(adapter);

    let configuration = {
        device: device,
        format: "bgra8unorm",
        size: {
            width: el.width,
            height: el.height,
        }
    };
    const res = ctx.configure(configuration);

    var vertWGSL = `

        struct VSOut {
            @builtin(position) Position : vec4<f32>,
            @location(0) color : vec4<f32>
        }

        @vertex
        fn main(@location(0) inPos: vec3<f32>, @location(1) color : vec3<f32>) -> VSOut {
            let xyz = inPos.xyz * 0.5;
            let z = xyz.z + 1.0;
            var vsOut: VSOut;
            vsOut.Position = vec4<f32>(xyz.xy*z, xyz.z, 1.0);
            vsOut.color = vec4<f32>(color, 1.0);
            return vsOut;
        }
    `

    var fragWGSL = `
    
        @fragment
        fn main(@location(0) inColor: vec4<f32>) -> @location(0) vec4<f32> {
            return vec4<f32>(inColor);
        }
    `

    const layout = device.createPipelineLayout({ bindGroupLayouts: [] });
    const pipeline = device.createRenderPipeline({
        layout: layout,
        vertex: {
            module: device.createShaderModule({code: vertWGSL}),
            entryPoint: "main",
            buffers: [
                {arrayStride: 12, attributes:[{shaderLocation: 0, format: "float32x3",offset:0}]},
                {arrayStride: 12, attributes:[{shaderLocation: 1, format: "float32x3",offset:0}]}
            ]
        },
        fragment: {
            module: device.createShaderModule({code: fragWGSL}),
            entryPoint: "main",
            targets: [
                {format: "bgra8unorm"}
            ],
            primitive: {
                topology: 'triangle-list',
                stripIndexFormat: undefined,
            }
        }
    });

    const renderPassDescriptor = {
        colorAttachments: [{
            view: undefined,
            loadOp: 'clear',
            clearValue: { r: 0.0, g: 0.5, b: 0.5, a: 1.0 },
            storeOp: 'store'
        }]
    };
    

    function frame() {
        renderPassDescriptor.colorAttachments[0].view = ctx.getCurrentTexture().createView();
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
        renderPass.setPipeline(pipeline);

        renderPass.setVertexBuffer(0, positionBuffer);
        renderPass.setVertexBuffer(1, colorBuffer);
        renderPass.setIndexBuffer(indexBuffer, "uint32");
        renderPass.drawIndexed(36, 1, 0, 0);

        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(frame);
    }
    frame();

}