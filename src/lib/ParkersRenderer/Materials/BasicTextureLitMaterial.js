import { vec4 } from 'gl-matrix';
import { Material } from './Material.js';
import { Renderer } from '../Renderer.js';
import shader from './shaders/basicTextureLit.wgsl?raw';

export class BasicTextureLitMaterial extends Material {
    static pipelines = {};
    static bindGroupLayout = null;
    static colorBuffer = null;
    static count = 0;

    constructor(options) {
        super();
        this.id = this.constructor.count++;
        this.color = options.color ? options.color : vec4.fromValues(1, 1, 1, 1);
    }

    init(options){
        this.topology = options.wireframe ? 'line-list' : 'triangle-list';
        if(!this.constructor.bindGroupLayout){
            this.constructor.bindGroupLayout = this.createBindGroupLayout();
        }
        if(!this.constructor.pipelines[this.topology]){
            this.constructor.pipelines[this.topology] = this.createPipeline(options);
        }
        this.createTestTexture();
        this.createMaterialBuffers();
        this.createBindGroup();
    }

    createTestTexture(){

        //Texture data
        const kTextureWidth = 5;
        const kTextureHeight = 7;
        const _ = [255,   0,   0, 255];  // red
        const y = [255, 255,   0, 255];  // yellow
        const b = [  0,   0, 255, 255];  // blue
        const textureData = new Uint8Array([
            b, _, _, _, _,
            _, y, y, y, _,
            _, y, _, _, _,
            _, y, y, _, _,
            _, y, _, _, _,
            _, y, _, _, _,
            _, _, _, _, _,
        ].flat());

        //Texture
        this.texture = Renderer.instance.getDevice().createTexture({
            size: [kTextureWidth, kTextureHeight],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
          });

          Renderer.instance.getDevice().queue.writeTexture(
            { texture: this.texture },
            textureData,
            {bytesPerRow: kTextureWidth * 4},
            {width: kTextureWidth, height: kTextureHeight, depthOrArrayLayers: 1}
          );

          //Sampler
          this.sampler = Renderer.instance.getDevice().createSampler({
            magFilter: 'linear',
          });
    }

    updateMaterialBuffers(){
        this.createMaterialBuffers();
        this.createBindGroup();
    }

    createMaterialBuffers(){
        this.colorBuffer = Renderer.instance.getDevice().createBuffer({
            label: this.constructor.name + '-color-buffer' + this.id,
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        new Float32Array(this.colorBuffer.getMappedRange()).set(this.color);
        this.colorBuffer.unmap();
    }

    createBindGroup(){
        this.bindGroup = Renderer.instance.getDevice().createBindGroup({
            label: this.constructor.name + '-bind-group' + this.id,
            layout: this.constructor.bindGroupLayout,
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
                },
                {
                    binding: 3,
                    resource: {
                        buffer: Renderer.instance.lightBuffer
                    }
                },
                {
                    binding: 4,
                    resource: this.sampler
                },
                {
                    binding: 5,
                    resource: this.texture.createView()
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
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage',
                        hasDynamicOffset: false
                    }
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {sampleType: 'float'}
                }
            ]
        });

        return bindGroupLayout;
    }

    createPipeline(options){
        const pipelineLayout = Renderer.instance.getDevice().createPipelineLayout({
            bindGroupLayouts: [this.constructor.bindGroupLayout]
        })

        const shaderModule = Renderer.instance.getDevice().createShaderModule({ code: shader });
        const pipeline = Renderer.instance.getDevice().createRenderPipeline({
            label: this.constructor.name + '-pipeline-' + this.id,
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

    getPipeline(topology){
        return this.constructor.pipelines[topology];
    }
}