export const createScene = async (el, onLoaded) => {
    onLoaded();

    el.width = 512;
    el.height = 512;

    let wgsltxt = `
        struct vsout {
            @builtin(position) Position: vec4<f32>,
            @location(0) uv: vec2<f32>,
        }

        @vertex
        fn main_vs(@builtin(vertex_index) VertexIndex: u32) -> vsout {
            var s = 0.9;
            var pos = array<vec2<f32>, 4>(
                vec2<f32>(-s, s),
                vec2<f32>(-s, -s),
                vec2<f32>(s, s),
                vec2<f32>(s, -s)
            );
            
            s = 1.0;
            var uvs = array<vec2<f32>, 4>(
                vec2<f32>(-s, -s),
                vec2<f32>(-s, s),
                vec2<f32>(s, -s),
                vec2<f32>(s, s)
            );

            var ret: vsout;
            ret.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
            ret.uv = uvs[VertexIndex] * 0.5 + 0.5;
            return ret;
        }

        struct hitdata {
            rayLength: f32,
            normal: vec3<f32>,
        };

        fn rayIntersectSphere(ray:vec3<f32>, dir:vec3<f32>, center:vec3<f32>, radius:f32) -> hitdata {
            var rc = ray - center;
            var c = dot(rc,rc) - (radius * radius);
            var b = dot(dir, rc);
            var d = b*b - c;
            var t = -b - sqrt(abs(d));

            if(d < 0.0 || t < 0.0) {
                t = 0.0;
            }

            var hit: hitdata;

            var hitPos = ray + dir * t;
            hit.normal = normalize(hitPos - center);
            hit.rayLength = t;
            return hit;
        }

        fn background(rd:vec3<f32>) -> vec3<f32> {
            let sky = max(0.0, dot(rd, vec3<f32>(0.0, 0.2, -0.7)));
            return pow(sky, 1.0)*vec3<f32>(0.5, 0.6, 0.7);
        }

        @fragment
        fn main_fs(@location(0) uvs: vec2<f32>) -> @location(0) vec4<f32> {
            var uv = (-1.0 + 2.0*uvs);
            var ro = vec3<f32>(0.0, 0.0, -6.0);
            var rd = normalize(vec3<f32>(uv, 1.0));
            var transmit = vec3<f32>(1.0);
            var light = vec3<f32>(0.0);

            var epsilon = 0.001;

            var bounceCount = 2.0;

            for(var i = 0.0; i <bounceCount; i=i + 1.0) {
                var data = rayIntersectSphere(ro, rd, vec3<f32>(0.0, 0.0, 0.0), 3.5);

                if(data.rayLength > 0.0) {
                    transmit = transmit * 0.9;
                    var nml = data.normal;
                    ro = ro + rd*data.rayLength;
                    rd = reflect(rd, nml);
                    ro = ro + rd*epsilon;
                }
                else{
                    light = light + transmit * background(rd);
                    break;
                }
            }

            return vec4<f32>(light, 1.0);
        
        }
    `;


    const gpu = navigator.gpu;
    const adapter = await gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const ctx = el.getContext("webgpu");

    let configuration = {
        device: device,
        format: "bgra8unorm",
        size: {
            width: el.width,
            height: el.height,
        }
    };

    const res = ctx.configure(configuration);
    
    const wgsl = device.createShaderModule({
        code: wgsltxt
    });

    const layout = device.createPipelineLayout({ bindGroupLayouts: [] });

    const pipeline = device.createRenderPipeline({
        layout: layout,
        vertex: {module : wgsl, entryPoint: "main_vs"},
        fragment: {module : wgsl, entryPoint: "main_fs", targets: [{format: "bgra8unorm"}]},
        primitive: {topology: "triangle-strip"},
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
        passEncoder.draw(4, 1, 0, 0);
        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}