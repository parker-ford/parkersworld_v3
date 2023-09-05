import GUI from 'lil-gui'; 
import Stats from 'stats-js';
import { init } from 'svelte/internal';

import canvasShaderCode from './canvasShader.wgsl?raw'

import shaderCode1 from './whiteNoise.wgsl?raw';
import shaderCode2 from './valueNoise.wgsl?raw';
import shaderCode3 from './perlinNoise.wgsl?raw';
import shaderCode4 from './simplexNoise.wgsl?raw';
import shaderCode5 from './worleyNoise.wgsl?raw';

const shaderCode = [shaderCode1, shaderCode2, shaderCode3, shaderCode4, shaderCode5];

const CANVAS_SIZE = 512;
let startTime = performance.now();

const gui = new GUI()
gui.domElement.id = 'gui';
const parameters = {
    shaderIndex: 4,
    shaders: shaderCode,
    shaderNames: ["WhiteNoise", "ValueNoise", "PerlinNoise", "SimplexNoise", "WorleyNoise"],
    shader: "",
    animate: false,
    textureSize: 512,
    cellSize: 4,
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
    let noiseShaderModule;
    let canvasUniformArray;
    let canvasUniformBuffer;
    let timeUniformBuffer;
    let noisePipeline;
    let noiseBindGroup;
    let noiseBindGroupLayout;
    let noisePipelineLayout;
    let canvasPipeline;
    let canvasBindGroupLayout;
    let canvasPipelineLayout;
    let canvasShaderModule;
    let canvasBindGroup;
    let textureSizeUniformArray;
    let textureSizeUniformBuffer;
    let noiseTextureDesriptor;
    let noiseTexture;
    let noiseTextureView;
    let sampler;
    let cellSizeUniformBuffer;

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
        noiseShaderModule = device.createShaderModule({
            label: "Noise Shader",
            code: shaderCode[parameters.shaderIndex]
        });

        canvasShaderModule = device.createShaderModule({
            label: "Canvas Shader",
            code: canvasShaderCode,
        })

    }

    const initializeUniforms = () => {
        canvasUniformArray = new Float32Array([CANVAS_SIZE, CANVAS_SIZE]);
        canvasUniformBuffer = device.createBuffer({
            label: "Canvas Uniforms",
            size: canvasUniformArray.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(canvasUniformBuffer, 0, canvasUniformArray);

        textureSizeUniformArray = new Float32Array([parameters.textureSize, parameters.textureSize]);
        textureSizeUniformBuffer = device.createBuffer({
            label: "Texture Size Uniforms",
            size: textureSizeUniformArray.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(textureSizeUniformBuffer, 0, textureSizeUniformArray);

        timeUniformBuffer = device.createBuffer({
            label: "Time Uniforms",
            size: 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(timeUniformBuffer, 0, new Float32Array([1]));

        cellSizeUniformBuffer = device.createBuffer({
            label: "Cell Size Uniform",
            size: 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(cellSizeUniformBuffer, 0, new Float32Array([parameters.cellSize]));
    }

    const initializePipelineLayout = () => {
        noiseBindGroupLayout = device.createBindGroupLayout({
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
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });

        noisePipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [noiseBindGroupLayout]
        });

        canvasBindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0, 
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float'
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'filtering'
                    }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ],
        });

        canvasPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [canvasBindGroupLayout]
        })
    }

    const initializeNoiseTexture = () => {
        noiseTextureDesriptor = {
            size: {
                width: parameters.textureSize,
                height: parameters.textureSize,
                depthOrArrayLayers: 1,
            },
            sampleCount: 1,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        };
    
        noiseTexture = device.createTexture(noiseTextureDesriptor);
        noiseTextureView = noiseTexture.createView();
    
        sampler = device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest',
            mipmapFilter: 'nearest',
            addressModeU: 'repeat',
            addressModeV: 'repeat',
            addressModeW: 'clamp-to-edge',
        })
    }



    const initializePipelines = () => {
        noisePipeline = device.createRenderPipeline({
            label: "Noise Pipeline",
            layout: noisePipelineLayout,
            vertex: {
              module: noiseShaderModule,
              entryPoint: "vertexMain",
              buffers: [vertexBufferLayout]
            },
            fragment: {
              module: noiseShaderModule,
              entryPoint: "fragmentMain",
              targets: [{
                format: 'rgba8unorm'
              }]
            }
        });

        canvasPipeline = device.createRenderPipeline({
            label: "Pipeline",
            layout: canvasPipelineLayout,
            vertex: {
              module: canvasShaderModule,
              entryPoint: "vertexMain",
              buffers: [vertexBufferLayout]
            },
            fragment: {
              module: canvasShaderModule,
              entryPoint: "fragmentMain",
              targets: [{
                format: canvasFormat
              }]
            }
        });
    }

    const initializeBindGroups = () => {
        noiseBindGroup = device.createBindGroup({
            label: "Noise Bind group",
            layout: noisePipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: textureSizeUniformBuffer }
                },
                {
                    binding: 1,
                    resource: { buffer: timeUniformBuffer }
                },
                {
                    binding: 2,
                    resource: {buffer: cellSizeUniformBuffer}
                }
            ],
        });
        canvasBindGroup = device.createBindGroup({
            label: "Canvas Bind Group",
            layout: canvasPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: noiseTextureView,
                },
                {
                    binding: 1,
                    resource: sampler
                },
                {
                    binding: 2,
                    resource: {buffer: canvasUniformBuffer}
                }

            ]
        })
    }


    const tick = () => {

        let currentTime = performance.now();
        let elapsedTime = (currentTime - startTime) * 0.0001;
        if(parameters.animate){
            device.queue.writeBuffer(timeUniformBuffer, 0, new Float32Array([elapsedTime]));
        }

        const encoder = device.createCommandEncoder();


        const noisePass = encoder.beginRenderPass({
            colorAttachments: [{
                view: noiseTextureView,
                loadOp: "clear",
                loadValue: [0,0,0, 1],
                storeOp: 'store',
                format: 'rgba8unorm',
            }]
        });
    
        noisePass.setPipeline(noisePipeline);
        noisePass.setVertexBuffer(0, vertexBuffer);
        noisePass.setBindGroup(0, noiseBindGroup);
        noisePass.draw(vertices.length / 2); // 6 vertices
        noisePass.end();

        const canvasPass = encoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
                storeOp: "store"
            }]
        });

        canvasPass.setPipeline(canvasPipeline);
        canvasPass.setVertexBuffer(0, vertexBuffer);
        canvasPass.setBindGroup(0, canvasBindGroup);
        canvasPass.draw(vertices.length / 2);
        canvasPass.end();

        device.queue.submit([encoder.finish()]);

        requestAnimationFrame(tick);
    }

    const resetSystem = () => {
        initializeVertexBuffer();
        initializeShaderModules();
        initializeUniforms();
        initializePipelineLayout();
        initializeNoiseTexture();
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

    gui.add(parameters, 'textureSize', [32,64,128,256,512]).onChange(() => {
        resetSystem();
    })

    gui.add(parameters, 'cellSize').min(2).max(64).step(1).onChange(() => {
        resetSystem();
    })

    gui.add(parameters, 'animate');

    parameters.saveImage = async () => {
        const bufferSize = parameters.textureSize * parameters.textureSize * 4; // Assuming a rgba8unorm format
        const readbackBuffer = device.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        });
        const commandEndcoder = device.createCommandEncoder();
        commandEndcoder.copyTextureToBuffer(
            {
                texture: noiseTexture,
                mipLevel: 0,
                origin: {x: 0, y: 0, z: 0},

            }, 
            {
                buffer: readbackBuffer,
                offset: 0,
                bytesPerRow: parameters.textureSize * 4,
                rowsPerImage: parameters.textureSize
            },
            {
                width: parameters.textureSize,
                height: parameters.textureSize,
                depthOrArrayLayers: 1
            }
        );
        device.queue.submit([commandEndcoder.finish()]);

        await readbackBuffer.mapAsync(GPUMapMode.READ);
        const data = new Uint8Array(readbackBuffer.getMappedRange());
        const clampedData = new Uint8ClampedArray(data.buffer);

        const canvas = document.createElement('canvas');
        canvas.width = parameters.textureSize;
        canvas.height = parameters.textureSize;
        const ctx = canvas.getContext('2d');
        const imageData = new ImageData(clampedData, parameters.textureSize, parameters.textureSize);
        ctx.putImageData(imageData, 0, 0);

        // Save as PNG (or change to 'image/jpeg' for JPEG)
        const imageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = parameters.shaderNames[parameters.shaderIndex] + ".png";
        link.click();
    };
    gui.add(parameters, "saveImage")

}



