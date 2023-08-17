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
    let vectors: array<vec2<f32>, 4> = array<vec2<f32>, 4>(
        (vec2f(1.0, 1.0)),
        (vec2f(1.0, -1.0)),
        (vec2f(-1.0, 1.0)),
        (vec2f(-1.0, -1.0))
    );

    let seed: u32 = uv_to_seed(u32(uv.x * canvas.x), u32(uv.y * canvas.y));
    let r: u32 = pcg_hash(seed);

    var v: vec2f = vectors[ r & 3];
    var v_ : vec2f = vec2f(v.x * cos(2 * PI * time ) - v.y * sin(2 * PI * time), v.x * sin(2 * PI * time) + v.y * cos(2 * PI * time));

    return v_;
}

fn fade(x: f32) -> f32 {
    return ((6*x - 15)*x + 10)*x*x*x;
}

fn perlin_noise(p: vec2f) -> f32 {

    var i: f32 = 1.0 / cellSize;

    let id: vec2f = floor(p * cellSize) / cellSize;

    var tl: vec2f = vec2f(id.x, id.y);
    var tr: vec2f = vec2f(id.x + i, id.y);
    var bl: vec2f = vec2f(id.x, id.y + i);
    var br: vec2f = vec2f(id.x + i, id.y + i);


    var v_tl: vec2f = vec2f(p.x - id.x, p.y - id.y);
    var v_tr: vec2f = vec2f(p.x - id.x - i, p.y - id.y);
    var v_bl: vec2f = vec2f(p.x - id.x, p.y - id.y - i);
    var v_br: vec2f = vec2f(p.x - id.x - i, p.y - id.y - i);

    // -- QUESTIONABLE ^^^

    var gv_tl: vec2f = gradient_vector(tl);
    var gv_tr: vec2f = gradient_vector(tr); 
    var gv_bl: vec2f = gradient_vector(bl); 
    var gv_br: vec2f = gradient_vector(br);  

    var fx: f32 = fade(fract(p.x * cellSize));
    var fy: f32 = fade(fract(p.y * cellSize));


    var dot_tl: f32 = dot(v_tl, gv_tl);
    var dot_tr: f32 = dot(v_tr, gv_tr);
    var dot_bl: f32 = dot(v_bl, gv_bl);
    var dot_br: f32 = dot(v_br, gv_br);

    // -- GOOD LINE --

    var n_t: f32 = mix(dot_tl, dot_tr, fx);
    var n_b: f32 = mix(dot_bl, dot_br, fx);
    var n: f32 = mix(n_t, n_b, fy);

    return n;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    var uv: vec2f = input.pos.xy / canvas;

    var col: f32 = perlin_noise(uv) ;




    //return vec4f(vec3f(col), 1.0); 

    return vec4f(vec3f(abs(col) * 3), 1.0);

    //var col: vec3f = vec3f(perlin_noise(uv));
    //col = (col + 1) / 2;
    //return vec4f(col, 1.0);


    //var col: vec2f = perlin_noise(uv);
    //return vec4f(col, 0.0, 1.0);
}


// @fragment
// fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {

//     //Getting UV
//     var uv: vec2f = input.pos.xy / canvas;

//     //Getting cell corner coordinates
//     var luv_tl: vec2f = floor(uv * cellSize) / cellSize;
//     var luv_tr: vec2f = luv_tl + vec2f((1.0/cellSize), 0);
//     var luv_bl: vec2f = luv_tl + vec2f(0, (1.0/cellSize));
//     var luv_br: vec2f = luv_tl + vec2f((1.0/cellSize), (1.0/cellSize));

//     //Getting gradient vectors
//     var v_tl: vec2f = gradient_vector(luv_tl);
//     var v_tr: vec2f = gradient_vector(luv_tr);
//     var v_bl: vec2f = gradient_vector(luv_bl);
//     var v_br: vec2f = gradient_vector(luv_br);

//     //Getting dot products from gradient vector and vector from corner to point
//     var dot_tl: f32 = (dot(v_tl, (uv - luv_tl)));
//     var dot_tr: f32 = (dot(v_tr, (uv - luv_tr)));
//     var dot_bl: f32 = (dot(v_bl, (uv - luv_bl)));
//     var dot_br: f32 = (dot(v_br, (uv - luv_br)));

//     // Linearly interpolating x and y
//     var luv: vec2f = fract(uv * cellSize);
//     luv = 6 * (luv * luv * luv * luv * luv) - 15 * (luv * luv * luv * luv) + 10 * (luv * luv * luv);

//     var n_t =  (1 - luv.x) * dot_tl + (luv.x) * dot_tr; 
//     var n_b = (1 - luv.x) * dot_bl + (luv.x) * dot_br;

//     // Linearly interpolating result
//     var n = (1 - luv.y) * n_t + luv.y * n_b;

//     //n = dot_tl;
//     n = (n + 1.0) / 2.0;
//     //n = n * 2.0 - 1;

//     return vec4f((v_tl + 1) / 2 , 0.0, 1.0);
//     //return vec4f(vec3f(n), 1.0);

// }

// fn fade(x: f32) -> f32 {
//     return ((6*x - 15)*x + 10)*x*x*x;
// }


// @fragment
// fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
//     let interval = canvas.x / cellSize;
//     let x = input.pos.x;
//     let y = input.pos.y;

//     let tl = floor(input.pos.xy / interval) * interval;
//     let tr = tl + vec2f(interval, 0);
//     let bl = tl + vec2f(0, interval);
//     let br = tl + vec2f(interval, interval);

//     let v_tl = gradient_vector(tl);
//     let v_tr = gradient_vector(tr);
//     let v_bl = gradient_vector(bl);
//     let v_br = gradient_vector(br);

//     let dot_tl = dot(v_tl, input.pos.xy - tl);
//     let dot_tr = dot(v_tr, input.pos.xy - tr);
//     let dot_bl = dot(v_bl, input.pos.xy - bl);
//     let dot_br = dot(v_br, input.pos.xy - br);

//     let fx = fade(x);
//     let fy = fade(y);

//     let nt = (512 - fx) * dot_tl + (fx) * dot_tr;
//     let nb = (512 - fx) * dot_bl + (fx) * dot_br;
//     var n = (512 - fy) * nt + (fy) * nb;

//     n = (n + 1) / 2;

//     return vec4f(vec3f(dot_tl), 1);
// }