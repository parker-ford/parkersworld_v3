@group(0) @binding(0) var<uniform> canvas: vec2f;
@group(0) @binding(1) var<uniform> time: f32;
@group(0) @binding(2) var<uniform> cellSize: f32;
    
const PI: f32 = 3.1415926535897932385;
const F: f32 = 0.5 * (sqrt(3.0) - 1.0);
const G: f32 = (3.0 - sqrt(3.0)) / 6.0;

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

fn skew_f32(f: f32) -> f32 {
    return f * F;
}

fn skew_vec2(v: vec2f) -> vec2f{
    var v_ : vec2f = vec2f();
    v_.x = v.x + (v.x + v.y) * F;
    v_.y = v.y + (v.x + v.y) * F;
    return v_;
}

fn unskew_vec2(v: vec2f) -> vec2f {
    var v_ : vec2f = vec2f();
    v_.x = v.x - (v.x + v.y) * G;
    v_.y = v.y - (v.x + v.y) * G;
    return v_;
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

fn calculate_contribution(v: vec2f, g: vec2f) -> f32{
    var t = max(0, 0.5 - (v.x * v.x + v.y * v.y));
    t = t * t;
    var n = t * t * dot(g,v);
    return n;
}

fn simplex_noise(in: vec2f) -> f32 {

    //Finding skewed simplex
    var skew: f32 = (in.x + in.y) * F;
    var simplexX_s: f32 = floor(in.x + skew);
    var simplexY_s: f32 = floor(in.y + skew);
    
    var unskew: f32 = (simplexX_s + simplexY_s) * G;
    var X0 = simplexX_s - unskew;
    var Y0 = simplexY_s - unskew;
    var x0 = in.x - X0;
    var y0 = in.y - Y0;

    var i1 = 0.0;
    var j1 = 0.0;
    if(x0 > y0){
        i1 = 1;
    }
    else{
        j1 = 1;
    }

    var x1 = x0 - i1 + G;
    var y1 = y0 - j1 + G;
    var x2 = x0 - 1.0 + 2.0 * G;
    var y2 = y0 - 1.0 + 2.0 * G;

    var g0 = gradient_vector(vec2f(simplexX_s, simplexY_s));
    var g1 = gradient_vector(vec2f(simplexX_s + i1, simplexY_s + j1));
    var g2 = gradient_vector(vec2f(simplexX_s + 1.0, simplexY_s + 1.0));
    var v0 = vec2f(x0, y0);
    var v1 = vec2f(x1, y1);
    var v2 = vec2f(x2, y2);

    var n0 = calculate_contribution(v0, g0);
    var n1 = calculate_contribution(v1, g1);
    var n2 = calculate_contribution(v2, g2);
    var n = n0 + n1 + n2;

    return n * 70.0;

    // let p: vec2f = in * 1;
    // let p_s: vec2f = skew_vec2(p);
    // let edge0_s: vec2f = floor(p_s);
    // let edge0: vec2f = unskew_vec2(edge0_s);
    // let v0: vec2f = unskew_vec2(p_s - edge0_s);
    // var ij: vec2f = vec2f(0);

    // return edge0_s;

    // if(v0.x < v0.y){
    //     ij.x = 1;
    // }
    // else{
    //     ij.y = 1;
    // }

    // let edge1: vec2f = edge0 + ij;
    // let edge2: vec2f = edge0 + vec2f(1.0);

    // let v1: vec2f = p - edge1;
    // let v2: vec2f = p - edge2;

    // let gv0: vec2f = gradient_vector(edge0);
    // let gv1: vec2f = gradient_vector(edge1);
    // let gv2: vec2f = gradient_vector(edge2);

    // var n0: f32 = max(0, 0.5 - ((v0.x * v0.x) + (v0.y * v0.y)));
    // n0 = n0 * n0 * n0 * n0;
    // n0 = n0 * dot(gv0, v0);

    // var n1: f32 = max(0, 0.5 - ((v1.x * v1.x) + (v1.y * v1.y)));
    // n1 = n1 * n1 * n1 * n1;
    // n1 = n1 * dot(gv1, v1);

    // var n2: f32 = max(0, 0.5 - ((v2.x * v2.x) + (v2.y * v2.y)));
    // n2 = n2 * n2 * n2 * n2;
    // n2 = n2 * dot(gv2, v2);

    // var n: f32 = n0 + n1 + n2;

    // return vec2f(n, -n) * 200;
    

    // //Scale to cellSize
    // var p: vec2f = in * cellSize;

    // //Skew grid and find skewed coordinates
    // var s: f32 = p.x * F + p.y * F;
    // var i: f32 = floor(p.x + s);
    // var j: f32 = floor(p.y + s);

    // //Unskew grid and find unskewed coordinates
    // var t: f32 = i * G + j * G;
    // var x0: f32 = i - t;
    // var y0: f32 = j - t;

    // //vector from coordinate to point
    // var v0: vec2f = vec2f(p.x - x0, p.y - y0);

    // var i1: f32;
    // var j1: f32;
    // if(v0.x > v0.y){
    //     i1 = 1.0 / cellSize;
    //     j1 = 0;
    // }
    // else{
    //     i1 = 0;
    //     j1 = 1.0 / cellSize;
    // }

    // var v1: vec2f = vec2f(v0.x - i1 + G, v0.y - j1 + G);
    // var v2: vec2f = vec2f(v0.x - (1.0 / cellSize) + 2.0 * G, v0.y - (1.0 / cellSize) + 2.0 * G);

    // var t0: f32 = 0.5 - v0.x * v0.x - v0.y * v0.y;
    // var n0: f32 = 0.0;
    // if(t0 > 0) {
    //     t0 *= t0;
    //     n0 = t0 * t0 * dot(gradient_vector(vec2f(i,j)), v0);
    // }

    // var t1: f32 = 0.5 - v1.x * v1.x - v1.y * v1.y;
    // var n1: f32 = 0.0;
    // if(t1 > 0) {
    //     t1 *= t1;
    //     n1 = t1 * t1 * dot(gradient_vector(vec2f(i + i1,j + j1)), v0);
    // }

    // var t2: f32 = 0.5 - v2.x * v2.x - v2.y * v2.y;
    // var n2: f32 = 0.0;
    // if(t2 > 0) {
    //     t2 *= t2;
    //     n2 = t2 * t2 * dot(gradient_vector(vec2f(i + 1,j + 1)), v0);
    // }

    // return vec2f(n0 + n1 + n2) * 70;




    // //Point and skewed point
    // var p: vec2f = in;
    // var p_s: vec2f = skew_vec2(p);

    // //Interval between cells
    // let i: f32 = 1.0 / cellSize;
    // let i_s: f32 = skew_f32(i);

    // //Skewed first point
    // let id_s: vec2f = floor(p_s / i) * i;

    // let pos: vec2f = p_s - id_s;

    // var id2_s: vec2f = vec2f();
    // var id3_s: vec2f = vec2f();

    // if(pos.x > pos.y){
    //     id2_s.x = id_s.x - i;
    //     id2_s.y = id_s.y;
    //     id3_s.x = id_s.x;
    //     id3_s.y = id_s.y - i;
    // }
    // else{
    //     id2_s.x = id_s.x - i;
    //     id2_s.y = id_s.y - i;
    //     id3_s.x = id_s.x;
    //     id3_s.y = id_s.y - i;
    // }

    // //return id2_s;

    // //MAY HAVE TO SWITCH PLUS TO MINUS ^^^
    
    // let id1: vec2f = unskew_vec2(id_s);
    // let id2: vec2f = unskew_vec2(id2_s);
    // let id3: vec2f = unskew_vec2(id3_s);

    // return id2;

    // let id1_v = (id1 - p);
    // let id2_v = id2 - p;
    // let id3_v = (id3 - p);

    // let id1_gv = gradient_vector(id1);
    // let id2_gv = gradient_vector(id2);
    // let id3_gv = gradient_vector(id3);

    // var fx: f32 = fade(fract(pos.x * cellSize));
    // var fy: f32 = fade(fract(pos.y * cellSize));

    // let id1_dot = dot(id1_v, id1_gv);
    // let id2_dot = dot(id2_v, id2_gv);
    // let id3_dot = dot(id3_v, id3_gv);

    // let n12 = mix(id1_dot, id2_dot, fy);
    // let n13 = mix(id1_dot, id3_dot, fy);
    // let n = mix(n12, n13, fx);

    //let n = id1_dot + id2_dot + id3_dot;

    //return n;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    var uv: vec2f = input.pos.xy / canvas;
    var in: vec2f = vec2f();
    in.x = map(input.pos.x, 0.0, canvas.x, 0.0, cellSize);
    in.y = map(input.pos.y, 0.0, canvas.y, 0.0, cellSize);

    var col: f32 = simplex_noise(in);
    col = (col + 1.0) / 2.0;

    return vec4f(vec3(col), 1.0);


    //var col: f32 = simplex_noise(uv);
    //return vec4f(col, -col, 0.0, 1.0);
    //col = (col + 1) / 2;
    //return vec4f(vec3f(col), 1.0);
}
