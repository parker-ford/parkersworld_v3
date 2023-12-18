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

fn xorshift(input: u32) -> f32 {
    var x: u32 = input;
    x ^= (x << 13u);
    x ^= (x << 17u);
    x ^= (x << 5u);
    return f32(x) / 4294967295.0;
}

fn xorshift_wang(input: u32) -> f32{
    var seed: u32 = input;
    seed = (seed ^ 61) ^ (seed >> 16);
    seed *= 9;
    seed = seed ^ (seed >> 4);
    seed *= 0x27d4eb2d;
    seed = seed ^ (seed >> 15);
    return f32(seed) / 4294967295.0;
}

fn pcg_hash(input: u32) -> u32{
    var state: u32 = input;
    var word: u32 = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

fn lcg(input: u32) -> u32 {
    let m: u32 = 4294967295u;
    let a: u32 = 1664525u;
    let c: u32 = 1013904223u;
    return (a * input + c) % m;
}

fn uv_to_seed(u: u32, v: u32) -> u32 {
    let seed1: u32 = u * 2654435761u;
    let seed2: u32 = v * 2246822519u;
    return (seed1 + seed2);
    //return (seed1 ^ (seed2 << 16u)) | (seed2 >> 16u);
}

fn normalize_u32(input: u32) -> f32 {
    return f32(input) / 4294967295.0;
}

fn random_uniform(uv: vec2f) -> f32{
    let seed: u32 = uv_to_seed(u32(uv.x * canvas.x), u32(uv.y * canvas.y));
    return normalize_u32(pcg_hash(seed * u32(time * 1000)));
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    var uv: vec2f = input.pos.xy / canvas;
    return vec4f(vec3(random_uniform(uv)), 1.0);
}