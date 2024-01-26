import { Material } from './Material.js';
import { Renderer } from './Renderer.js';
import basicMaterialShader from './shaders/basicMaterialShader.wgsl?raw';

export class BasicMaterial extends Material {
    static pipeline = null;
    static bindGroupLayout = null;

    constructor(options) {
        super();
        this.color = options.color;
    }

    init(options){
        if(!BasicMaterial.bindGroupLayout){
            BasicMaterial.bindGroupLayout = this.createBindGroupLayout();
        }
        if(!BasicMaterial.pipeline) {
            BasicMaterial.pipeline = this.createPipeline(options);
        }

        this.bindGroup = this.createBindGroup();
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
                }
            ]
        });

        return bindGroupLayout;
    }

    createBindGroup(){
        const bindGroup = Renderer.instance.getDevice().createBindGroup({
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
                }
            ]
        });

        return  bindGroup;
    }

    createPipeline(options){
        //Not sure about this, but will leave it for now
        const pipelineLayout = Renderer.instance.getDevice().createPipelineLayout({
            bindGroupLayouts: [BasicMaterial.bindGroupLayout]
        })

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
                primitive: {
                    topology: 'triangle-list',
                }
            },

            //Depth stencil may need to be per material rather than per renderer
            depthStencil: Renderer.instance.depthStencilState,
        });

        return pipeline;
    }

    getPipeline(){
        return BasicMaterial.pipeline;
    }
}