@group(0) @binding(0) var<uniform> canvas: vec2f;
@group(0) @binding(1) var<uniform> time: f32;
@group(0) @binding(2) var<uniform> cellSize: f32;
    
const PI: f32 = 3.1415926535897932385;

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

fn gradient_vector(uv: vec2f) -> vec2f {
    let vectors: array<vec2<f32>, 8> = array<vec2<f32>, 8>(
        (vec2f(1.0, 1.0)),
        (vec2f(1.0, -1.0)),
        (vec2f(-1.0, 1.0)),
        (vec2f(-1.0, -1.0)),
        (vec2f(1.0, 0)),
        (vec2f(0, -1.0)),
        (vec2f(0, 1.0)),
        (vec2f(-1.0, 0))
    );

    let seed: u32 = uv_to_seed(u32(uv.x * canvas.x), u32(uv.y * canvas.y));
    var r: u32 = pcg_hash(seed);
    r = pcg_hash(r);

    var v: vec2f = vectors[ r & 7];
    var v_ : vec2f = vec2f(v.x * cos(2 * PI * time ) - v.y * sin(2 * PI * time), v.x * sin(2 * PI * time) + v.y * cos(2 * PI * time));

    return v_;
}

fn map(value: f32, in_min: f32, in_max: f32, out_min: f32, out_max: f32) -> f32 {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

fn map_vec2_dist(v: vec2f) -> vec2f {
    let i: f32 = 1.0 / cellSize;
    var _v: vec2f = vec2f();
    _v.x = map(v.x, 0.0, i, 0.0, 1.0);
    _v.y = map(v.y, 0.0, i, 0.0, 1.0);
    return _v;
}

fn fade(x: f32) -> f32 {
    return ((6*x - 15)*x + 10)*x*x*x;
}

fn perlin_noise(in: vec2f) -> f32 {

    let p: vec2f = in * 1;

    //Interval between cells
    var i: f32 = 1.0 / cellSize;

    //Cell that pixel lies in
    let id: vec2f = floor(p * cellSize) / cellSize;

    //Coordinates of cell corners
    var tl: vec2f = vec2f(id.x, id.y);
    var tr: vec2f = vec2f(id.x + i, id.y);
    var bl: vec2f = vec2f(id.x, id.y + i);
    var br: vec2f = vec2f(id.x + i, id.y + i);

    //Vector from corners of cell to point
    var v_tl: vec2f = map_vec2_dist(vec2f((p.x - id.x), p.y - id.y));
    var v_tr: vec2f = map_vec2_dist(vec2f(p.x - id.x - i, p.y - id.y));
    var v_bl: vec2f = map_vec2_dist(vec2f(p.x - id.x, p.y - id.y - i));
    var v_br: vec2f = map_vec2_dist(vec2f(p.x - id.x - i, p.y - id.y - i));

    //Gradient vectors at each corner of cell
    var gv_tl: vec2f = gradient_vector(tl);
    var gv_tr: vec2f = gradient_vector(tr); 
    var gv_bl: vec2f = gradient_vector(bl); 
    var gv_br: vec2f = gradient_vector(br);  

    //Fade values
    var fx: f32 = fade(fract(p.x * cellSize));
    var fy: f32 = fade(fract(p.y * cellSize));

    //Dot product of each corners gradient vector and vector to point
    var dot_tl: f32 = dot((v_tl), (gv_tl));
    var dot_tr: f32 = dot((v_tr), (gv_tr));
    var dot_bl: f32 = dot((v_bl), (gv_bl));
    var dot_br: f32 = dot((v_br), (gv_br));

    //Bilinear interpolation
    var n_t: f32 = mix(dot_tl, dot_tr, fx);
    var n_b: f32 = mix(dot_bl, dot_br, fx);
    var n: f32 = mix(n_t, n_b, fy);

    return n;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    var uv: vec2f = input.pos.xy / canvas;
    var col: f32 = perlin_noise(uv + time);
    col = (col + 1) / 2;
    return vec4f(vec3f(col), 1.0);
}
