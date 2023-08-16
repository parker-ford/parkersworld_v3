import GUI from 'lil-gui'; 
import Stats from 'stats-js';
import { init } from 'svelte/internal';

import shaderCode1 from './valueNoise.wgsl?raw';
const shaderCode = [shaderCode1];

const CANVAS_SIZE = 512;
let startTime = performance.now();

const gui = new GUI()
gui.domElement.id = 'gui';
const parameters = {
    shaderIndex: 0,
    shaders: shaderCode,
    shaderNames: ["a", "b"],
    shader: "",
}
parameters.shader = parameters.shaderNames[parameters.shaderIndex];

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

    const vertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
         1.0,  1.0,

        -1.0, -1.0,
         1.0,  1.0,
        -1.0,  1.0,
    ]);

    let vertexBuffer;
    let vertexBufferLayout;
    let shaderModule;
    let canvasUniformArray;
    let canvasUniformBuffer;
    let timeUniformBuffer;
    let pipeline;
    let bindGroup;
    let bindGroupLayout;
    let pipeLineLayout;


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
              shaderLocation: 0, // Position, see vertex shader
            }],
        };
    }

    const initializeShaderModules = () => {
        shaderModule = device.createShaderModule({
            label: "Cell shader",
            code: shaderCode[parameters.shaderIndex]
        });
    }

    const initializeUniforms = () => {
        canvasUniformArray = new Float32Array([CANVAS_SIZE, CANVAS_SIZE]);
        canvasUniformBuffer = device.createBuffer({
            label: "Canvas Uniforms",
            size: canvasUniformArray.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(canvasUniformBuffer, 0, canvasUniformArray);

        timeUniformBuffer = device.createBuffer({
            labal: "Time Uniforms",
            size: 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
        device.queue.writeBuffer(timeUniformBuffer, 0, new Float32Array([0]));
    }

    const initializePipelineLayout = () => {
        bindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform'
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });

        pipeLineLayout = device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        })
    }

    const initializePipelines = () => {
        pipeline = device.createRenderPipeline({
            label: "Pipeline",
            layout: pipeLineLayout,
            vertex: {
              module: shaderModule,
              entryPoint: "vertexMain",
              buffers: [vertexBufferLayout]
            },
            fragment: {
              module: shaderModule,
              entryPoint: "fragmentMain",
              targets: [{
                format: canvasFormat
              }]
            }
        });
    }

    const initializeBindGroups = () => {
        bindGroup = device.createBindGroup({
            label: "Bind group",
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: canvasUniformBuffer }
                },
                {
                    binding: 1,
                    resource: { buffer: timeUniformBuffer }
                }
            ],
        });
    }

    const tick = () => {

        let currentTime = performance.now();
        let elapsedTime = (currentTime - startTime) * 0.001;
        device.queue.writeBuffer(timeUniformBuffer, 0, new Float32Array([elapsedTime]));

        const encoder = device.createCommandEncoder();

        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
                storeOp: "store"
            }]
        });
    
        pass.setPipeline(pipeline);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.setBindGroup(0, bindGroup);
        pass.draw(vertices.length / 2); // 6 vertices
        
        pass.end();
        device.queue.submit([encoder.finish()]);

        requestAnimationFrame(tick);
    }

    const resetSystem = () => {
        initializeVertexBuffer();
        initializeShaderModules();
        initializeUniforms();
        initializePipelineLayout();
        initializePipelines();
        initializeBindGroups();
        tick();
    }
    resetSystem();

    gui.add(parameters, 'shader', parameters.shaderNames).onChange((value) => {
        parameters.shaderIndex = parameters.shaderNames.indexOf(value);
        console.log(parameters.shaderIndex);
        console.log(parameters.shader);
        resetSystem();
    })
}



