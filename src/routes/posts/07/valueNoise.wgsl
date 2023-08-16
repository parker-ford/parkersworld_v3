@group(0) @binding(0) var<uniform> canvas: vec2f;
@group(0) @binding(1) var<uniform> time: f32;
    
struct VertexInput {
    @location(0) pos: vec2f,
};

struct VertexOutput {
    @builtin(position) pos: vec4f,
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput{
    var output: VertexOutput;
    output.pos = vec4f(input.pos, 0, 1);
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    var uv: vec2f = input.pos.xy / canvas;
    var c: f32 = fract(sin(uv.x*100.0 + uv.y*2345.0)*8732.0);
    return vec4f(vec3(c), 1.0);
}