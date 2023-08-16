@group(0) @binding(0) var noiseTexture: texture_2d<f32>;
@group(0) @binding(1) var texSampler: sampler;
@group(0) @binding(2) var<uniform> canvas: vec2f;

    
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
    return textureSample(noiseTexture, texSampler, uv);
}


