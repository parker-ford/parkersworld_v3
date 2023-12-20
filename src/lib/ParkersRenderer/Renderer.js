import { Scene } from "./Scene";
import { BasicTriangle } from "./BasicTriangle";

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

        Renderer.instance = this;
    }

    async init() {

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
        this.presentationSize = [ this.canvas.clientWidth * devicePixelRatio, this.canvas.clientHeight * devicePixelRatio ];
        this.presentationFormat = this.gpu.getPreferredCanvasFormat();
        let configuration = {
            device: this.device,
            format: this.presentationFormat,
            size: this.presentationSize,
        };
        this.context.configure(configuration);


        return true;
    }

    getDevice() {
        return this.device;
    }

    render(scene) {
        if (!(scene instanceof Scene)) {
            throw new TypeError('render must take in a Scene object');
        }
        this.commandBuffers = [];
        scene.objects.forEach(element => {
            this.renderObject(element);
        });
        this.device.queue.submit(this.commandBuffers);
    }

    renderObject(element) {
        switch (element.constructor) {
            case BasicTriangle:
                this.renderBasicTriangle(element);
                break;
            default:
                console.log("non renderable object in scene");
        }
    }

    renderBasicTriangle(triangle) {
        triangle.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();
        const commandEncoder = this.device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(triangle.renderPassDescriptor);
        renderPass.setPipeline(triangle.pipeline);
        renderPass.setVertexBuffer(0, triangle.vertexBuffer);
        renderPass.draw(3);
        renderPass.end();
        this.commandBuffers.push(commandEncoder.finish());
        //this.device.queue.submit([commandEncoder.finish()]);
    }

    renderTest() {
        let wgsltxt = `
            struct vsout {
                @builtin(position) Position: vec4<f32>,
                @location(0) p : vec3<f32>,
            };

            @vertex
            fn main_vs(@builtin(vertex_index) VertexIndex : u32) -> vsout {
                var pos = array<vec2<f32>, 3>(
                    vec2<f32>(0.0, 0.5),
                    vec2<f32>(-0.5, -0.5),
                    vec2<f32>(0.5, -0.5)
                );
                var ret : vsout;
                ret.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
                ret.p = vec3<f32>(pos[VertexIndex], 0.0);
                return ret;
            }
            
            fn random(st:vec2<f32>) -> f32 {
                return fract(sin(dot(st.xy, vec2<f32>(12.9898,78.233))) * 43758.5453123);
            }

            @fragment
            fn main_fs(@location(0)p : vec3<f32>) -> @location(0) vec4<f32> {
                var r = random(p.xy);
                var g = random(p.xy * 2.0);
                var b = random(p.xy * 3.0);
                return vec4<f32>(r, g, b, 1.0);
            }
        `;

        const wgsl = this.device.createShaderModule({
            code: wgsltxt
        });


        const layout = this.device.createPipelineLayout({ bindGroupLayouts: [] });

        const pipeline = this.device.createRenderPipeline({
            layout: layout,
            vertex: { module: wgsl, entryPoint: "main_vs" },
            fragment: { module: wgsl, entryPoint: "main_fs", targets: [{ format: "bgra8unorm" }] },
            primitive: { topology: "triangle-list" },
        });

        function render(device, context) {
            const commandEncoder = device.createCommandEncoder();
            const textureView = context.getCurrentTexture().createView();
            const renderPassDescriptor = {
                colorAttachments: [{
                    view: textureView,
                    loadOp: 'clear',
                    clearValue: { r: 1, g: 1, b: 1, a: 1 },
                    storeOp: 'store'
                }]
            }
            const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
            passEncoder.setPipeline(pipeline);
            passEncoder.draw(3, 1, 0, 0);
            passEncoder.end();
            device.queue.submit([commandEncoder.finish()]);
            requestAnimationFrame(() => render(device, context));
        }

        render(this.device, this.context);
    }
}