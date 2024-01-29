import { vec4 } from 'gl-matrix';
import { Material } from './Material.js';
import { Renderer } from './Renderer.js';
import basicMaterialShader from './shaders/basicMaterialShader.wgsl?raw';

export class BasicMaterial extends Material {
    static pipelines = {};
    static pipeline = null;
    static bindGroupLayout = null;
    static colorBuffer = null;
    static count = 0;

    constructor(options) {
        super();
        this.id = BasicMaterial.count++;
        this.color = options.color ? options.color : vec4.fromValues(1, 0, 0, 1);
    }

    init(options){
        this.topology = options.wireframe ? 'line-list' : 'triangle-list';
        if(!BasicMaterial.bindGroupLayout){
            BasicMaterial.bindGroupLayout = this.createBindGroupLayout();
        }
        if(!BasicMaterial.pipeline) {
            BasicMaterial.pipeline = this.createPipeline(options);
        }
        if(!BasicMaterial.pipelines[this.topology]){
            BasicMaterial.pipelines[this.topology] = this.createPipeline(options);
        }
        this.createMaterialBuffers();
        this.createBindGroup();
    }

    createMaterialBuffers(){
        this.colorBuffer = Renderer.instance.getDevice().createBuffer({
            label: 'basic-material-color-buffer' + this.id,
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        new Float32Array(this.colorBuffer.getMappedRange()).set(this.color);
        this.colorBuffer.unmap();
    }

    createBindGroup(){
        this.bindGroup = Renderer.instance.getDevice().createBindGroup({
            label: 'basic-material-bind-group' + this.id,
            layout: BasicMaterial.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: Renderer.instance.uniformBuffer
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: Renderer.instance.objectsBuffer
                    }
                },
                {
                    binding: 2,
                    resource: {
                        buffer: this.colorBuffer
                    }
                }
            ]
        });
    }

    createBindGroupLayout(){
        const bindGroupLayout = Renderer.instance.getDevice().createBindGroupLayout({
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
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {type: 'uniform'}
                }
            ]
        });

        return bindGroupLayout;
    }


    //TODO: Make seperate pipelines for wireframe
    createPipeline(options){
        const pipelineLayout = Renderer.instance.getDevice().createPipelineLayout({
            bindGroupLayouts: [BasicMaterial.bindGroupLayout]
        })

        //const topology = options.wireframe ? 'line-list' : 'triangle-list';

        const shaderModule = Renderer.instance.getDevice().createShaderModule({ code: basicMaterialShader });
        const pipeline = Renderer.instance.getDevice().createRenderPipeline({
            label: 'basic-material-pipeline',
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: "vertex_main",
                buffers: options.vertexBufferDescriptors
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fragment_main",
                targets: [
                    { format: Renderer.instance.presentationFormat }
                ],
            },
            primitive: {
                topology: this.topology,
            },
            
            //Depth stencil may need to be per material rather than per renderer
            depthStencil: Renderer.instance.depthStencilState,
        });

        return pipeline;
    }

    // getPipeline(){
    //     return BasicMaterial.pipeline;
    // }
    getPipeline(topology){
        return BasicMaterial.pipelines[topology];
    }
}