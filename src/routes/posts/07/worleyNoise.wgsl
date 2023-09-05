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

fn pcg_hash_vec2(input: vec2f) -> vec2u {

    var v: vec2u = vec2u(input * canvas);

    v = v * 1664525u + 1013904223u;
    v.x += v.y * 1664525u;
    v.y += v.x * 1664525u;

    v = v ^ (v >> vec2u(16u));

    v.x += v.y * 1664525u;
    v.y += v.x * 1664525u;

    v = v ^ (v >> vec2u(16u));

    return v;
}

fn uv_to_seed(u: u32, v: u32) -> u32 {
    let seed1: u32 = u * 2654435761u;
    let seed2: u32 = v * 2246822519u;
    return (seed1 + seed2);
}

fn map(value: f32, in_min: f32, in_max: f32, out_min: f32, out_max: f32) -> f32 {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

fn normalize_u32(input: u32) -> f32 {
    return f32(input) / 4294967295.0;
}

fn normalize_vec2u(input: vec2u) -> vec2f {
    return vec2f(input) / 4294967295.0;
}

fn normalized_rand_vec2f(in: vec2f) -> vec2f {
    let r: vec2u = pcg_hash_vec2(in);
    return normalize_vec2u(r);
}

fn worley_noise(in: vec2f) -> vec3f {

    if(false){
        var m: f32 = 0;
        var minDist: f32 = 1000.0;
        for(var i: u32 = 0; i < u32(cellSize); i++){
            let r: vec2f = normalized_rand_vec2f(vec2f(f32(i)));
            let p: vec2f = (sin(r * time * 3.0 + 54984.0) + 1.0) / 2.0 * 0.9 + 0.05;
            let d: f32 = length(in - p);
            m += smoothstep(.02, .01, d);
            if(d < minDist){
                minDist = d;
            }
        }
        return vec3f(minDist);
    }
    else if(true){
        let p = in * cellSize;

        let id = floor(p);
        let uv = fract(p);

        var dist = 10000.0;
        for(var y = -1; y <= 1; y++){
            for(var x = -1; x <= 1; x++){
                let neighbor = id + vec2f(f32(x),f32(y));
                let r = normalized_rand_vec2f(neighbor);
                var d = distance(neighbor + r - id, uv);
                if(d < dist){
                    dist = d;
                }
            }
        }

        return vec3f(dist);
    }
    else{
        var uv: vec2f = fract(in * cellSize);
        var id: vec2f = floor(in * cellSize);
        var minDist: f32 = 1000.0;
        for(var i = -1; i <= 1; i++){
            for(var j = -1; j <= 1; j++){
                let offset: vec2f = vec2f(f32(j),f32(i));
                let cellPos: vec2f = id + vec2f(f32(i),f32(j));
                let r: vec2f = normalized_rand_vec2f(id + offset);
                let p: vec2f = offset + sin(r * time) * .5;
                let d: f32 = length(uv - p);
                if (d < minDist){
                    minDist = d;
                }
            }
        }
        return(vec3f(minDist));
    }

}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    var uv: vec2f = input.pos.xy / canvas;
    var col: vec3f = worley_noise(uv);
    return vec4f(col, 1.0);
}
