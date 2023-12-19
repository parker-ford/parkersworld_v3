export const createScene = async (el, onLoaded) => {
    onLoaded();

    el.width = 500;
    el.height = 500;

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

    const gpu = navigator.gpu;
    const adapter = await gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const ctx = el.getContext("webgpu");
    console.log('ctx', ctx);

    let configuration = {
        device: device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        size: {
            width: el.width,
            height: el.height,
        }
    };

    const res = ctx.configure(configuration);
    console.log('getCurrentTexture', ctx.getCurrentTexture());

    const wgsl = device.createShaderModule({
        code: wgsltxt
    });

    const layout = device.createPipelineLayout({ bindGroupLayouts: [] });

    const pipeline = device.createRenderPipeline({
        layout: layout,
        vertex: {module : wgsl, entryPoint: "main_vs"},
        fragment: {module : wgsl, entryPoint: "main_fs", targets: [{format: "bgra8unorm"}]},
        primitive: {topology: "triangle-list"},
    });

    let render = function() {
        const commandEncoder = device.createCommandEncoder();
        const textureView = ctx.getCurrentTexture().createView();
        const renderPassDescriptor = {
            colorAttachments: [{view: textureView,
                loadOp: 'clear',
                clearValue: {r:1, g:1, b:1, a:1},
                storeOp: 'store'
            }]
        }
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

}