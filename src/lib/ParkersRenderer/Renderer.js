import { Scene } from "./Scene";
import { BasicTriangleTransform } from "./BasicTriangleTransform";
import {Plane} from './Plane.js';
import transformShader from './shaders/transformShader.wgsl?raw';
import { mat4 } from "gl-matrix";
import { Renderable } from "./Renderable.js";

export class Renderer {

    static instance;

    constructor(canavs) {

        if (Renderer.instance) {
            return Renderer.instance;
        }

        this.canvas = canavs;
        this.gpu = null;
        this.adapter = null;
        this.device = null;
        this.context = null;
        this.commandBuffers = [];
        this.renderFuncrions = [];
        
        //DEBUGGING
        this.printOD = true;

        Renderer.instance = this;
    }

    async setupDevice() {
        //Checks to see if WebGPU is available
        if (!"gpu" in window.navigator) {
            console.log("gpu not in navigator");
            return false;
        }
        this.gpu = navigator.gpu;

        //The adapter represents the physicsal gpu device.
        //This method can not fail but it may be null.
        this.adapter = await this.gpu.requestAdapter();
        if (!this.adapter) {
            console.log("no adapter");
            return false;
        }

        //This is the logical connection of the gpu. It allows you to create thins like buffers and textures.
        this.device = await this.adapter.requestDevice();
        if (!this.device) {
            console.log("no device");
            return false;
        }

        this.context = this.canvas.getContext('webgpu');
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.presentationSize = [this.canvas.clientWidth * devicePixelRatio, this.canvas.clientHeight * devicePixelRatio];
        this.presentationFormat = this.gpu.getPreferredCanvasFormat();
        let configuration = {
            device: this.device,
            format: this.presentationFormat,
            size: this.presentationSize,
        };
        this.context.configure(configuration);

        return true;
    }

    setupDepthStencil() {
        this.depthStencilState = {
            format: 'depth24plus-stencil8',
            depthWriteEnabled: true,
            depthCompare: 'less-equal',
        }
        
        const size = {
            width: this.canvas.width,
            height: this.canvas.height,
            depthOrArrayLayers: 1,
        }

        const depthBufferDescriptor = {
            size: size,
            format: this.depthStencilState.format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }

        this.depthStencilBuffer = this.device.createTexture(depthBufferDescriptor);

        const viewDescriptor = {
            format: this.depthStencilState.format,
            dimension: '2d',
            aspect: 'all',
        }
        this.depthStencilView = this.depthStencilBuffer.createView(viewDescriptor);

        this.depthStencilAttachment = {
            view: this.depthStencilView,
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
            stencilLoadOp: 'clear',
            stencilStoreOp: 'discard',
        }
    }

    setupBuffers(){

        this.objectsBuffer = this.device.createBuffer({
            size: 64 * 1024,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.uniformBuffer = this.device.createBuffer({
            size: 64 * 2,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.vertexBufferDescriptors = [
            {
                attributes: [
                    {
                        shaderLocation: 0,
                        offset: 0,
                        format: "float32x4"
                    },
                    {
                        shaderLocation: 1,
                        offset: 16,
                        format: "float32x4"
                    },
                ],
                arrayStride: 32,
                stepMode: "vertex",
            }
        ];
    }

    setupBindGroup(){

        this.bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {type: 'uniform'}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'read-only-storage',
                        hasDynamicOffset: false
                    }
                }
            ]
        });

        this.bindGroup = this.device.createBindGroup({
            layout: this.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: this.objectsBuffer
                    }
                }
            ]
        });
    }

    setupPipeline(){

        this.pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [this.bindGroupLayout]
        })

        this.shaderModule = this.device.createShaderModule({ code: transformShader });
        this.pipeline = this.device.createRenderPipeline({
            layout: this.pipelineLayout,
            vertex: {
                module: this.shaderModule,
                entryPoint: "vertex_main",
                buffers: this.vertexBufferDescriptors
            },
            fragment: {
                module: this.shaderModule,
                entryPoint: "fragment_main",
                targets: [
                    { format: Renderer.instance.presentationFormat }
                ],
                primitive: {
                    topology: 'triangle-list',
                }
            },
            depthStencil: this.depthStencilState,
        });
    }

    async init() {

        if(!await this.setupDevice()){
            console.log("device setup failed");
            return false;
        }

        this.setupDepthStencil();
        this.setupBuffers();
        this.setupBindGroup();
        this.setupPipeline();

        return true;
    }

    getDevice() {
        return this.device;
    }
    
    render(scene, camera) {
        if (!(scene instanceof Scene)) {
            throw new TypeError('render must take in a Scene object');
        }

        //Update everything in the scene
        scene.update();

        //Model, View, Projection Matrices
        this.device.queue.writeBuffer(this.objectsBuffer, 0, scene.object_data, 0, scene.object_data.length);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, camera.viewMatrix);
        this.device.queue.writeBuffer(this.uniformBuffer, 64, camera.projectionMatrix);

        const commandEncoder = this.device.createCommandEncoder();
        const renderPassDescriptor = {
            colorAttachments: [
                {
                    loadOp: "clear",
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    storeOp: "store"
                }
            ],
            depthStencilAttachment: this.depthStencilAttachment,
        }
        renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

        scene.objects.forEach(element => {
            this.renderObject(renderPass, element, scene.object_count);
        });

        renderPass.end();
        this.device.queue.submit([commandEncoder.finish()]);
    }

    renderObject(renderPass, element, count) {
        switch (element.constructor) {
            case Renderable:
                this.renderRenderable(renderPass, element, count);
                break;
            default:
                //console.log("non renderable object in scene");
        }
    }

    renderRenderable(renderPass, element, count) {
        console.log(element.material.getPipeline());
        renderPass.setPipeline(element.material.getPipeline());
        renderPass.setVertexBuffer(0, element.mesh.vertexBuffer);
        renderPass.setBindGroup(0, this.bindGroup);
        renderPass.draw(3, count, 0, 0);
    }
}