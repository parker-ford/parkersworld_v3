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
    var pos: vec2f = input.pos.xy / canvas;
    //return vec4f(0.0, pos, 1.0);
    return vec4f(pos.x * sin(time * 1.5), 0.0, pos.y * cos(time * 2), 1.0);
}