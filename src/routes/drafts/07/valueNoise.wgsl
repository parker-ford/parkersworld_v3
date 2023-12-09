@group(0) @binding(0) var<uniform> canvas: vec2f;
@group(0) @binding(1) var<uniform> time: f32;
@group(0) @binding(2) var<uniform> cellSize: f32;
    
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

fn pcg_hash(input: u32) -> u32{
    var state: u32 = input;
    var word: u32 = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

fn uv_to_seed(u: u32, v: u32) -> u32 {
    let seed1: u32 = u * 2654435761u;
    let seed2: u32 = v * 2246822519u;
    return (seed1 + seed2);
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
    //uv = uv * uv * (3.0 -2.0 * uv );
    var luv: vec2f = fract(uv * cellSize);

    //Derived smoothstep
    luv = luv * luv * (3.0 -2.0 * luv);

    var luv_tl: vec2f = floor(uv * cellSize) / cellSize;
    var luv_tr: vec2f = luv_tl + vec2f((1.0/cellSize), 0);
    var luv_bl: vec2f = luv_tl + vec2f(0, (1.0/cellSize));
    var luv_br: vec2f = luv_tl + vec2f((1.0/cellSize), (1.0/cellSize));

    var n_tl = random_uniform(luv_tl);
    var n_tr = random_uniform(luv_tr);
    var n_bl = random_uniform(luv_bl);
    var n_br = random_uniform(luv_br);

    var n_t =  (1 - luv.x) * n_tl + (luv.x) * n_tr; 
    var n_b = (1 - luv.x) * n_bl + (luv.x) * n_br;

    var n = (1 - luv.y) * n_t + luv.y * n_b;

    //return vec4f(luv, 0.0, 1.0);
    return vec4f(vec3(n), 1.0);
}