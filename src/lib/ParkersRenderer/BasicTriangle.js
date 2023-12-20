import { Renderer } from './Renderer.js';

export class BasicTriangle {
    constructor(options) {
        this.points = new Float32Array(options.points.flat());
        this.colors = new Float32Array(options.colors.flat());
        this.indices = new Uint32Array([0, 1, 2]);
        this.shader = options.shader;
        this.constructBuffers();
        this.setupShaders();

        this.renderPassDescriptor = {
            colorAttachments: [
                {
                    loadOp: "clear",
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    storeOp: "store"
                }
            ]
        }
    }

    constructBuffers() {

        let concatData = [];
        for (let i = 0; i < this.points.length; i += 4) {
            concatData.push(this.points[i]);
            concatData.push(this.points[i + 1]);
            concatData.push(this.points[i + 2]);
            concatData.push(this.points[i + 3]);
            concatData.push(this.colors[i]);
            concatData.push(this.colors[i + 1]);
            concatData.push(this.colors[i + 2]);
            concatData.push(this.colors[i + 3]);
        }
        const vertexData = new Float32Array(concatData);

        this.vertexBuffer = Renderer.instance.getDevice().createBuffer({
            size: vertexData.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        new Float32Array(this.vertexBuffer.getMappedRange()).set(vertexData);
        this.vertexBuffer.unmap();

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

    setupShaders() {

        this.shaderModule = Renderer.instance.getDevice().createShaderModule({ code: this.shader });
        this.pipeline = Renderer.instance.getDevice().createRenderPipeline({
            layout: 'auto',
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
            }
        });
    }


}