struct TransformData {
    view: mat4x4<f32>,
    projection: mat4x4<f32>
};

struct ModelData{
    model: mat4x4<f32>,
    model_i_t: mat4x4<f32>
};

struct ObjectData {
    models: array<ModelData>,
};

struct LightData {
    color: vec4<f32>,
    position: vec3<f32>,
    direction: vec3<f32>,
    intensity: f32,
    falloff: f32,
    maxDistance: f32,
    umbra: f32,
    penumbra: f32,
    mode: u32
};

struct LightArray {
    lights: array<LightData>
};

struct Uniforms {
    color: vec4f,
    ambient: f32,
    time: f32,
}

const NUM_LIGHTS: u32 = 16;
const PI: f32 = 3.14159265359;

@binding(0) @group(0) var<uniform> transformUBO: TransformData;
@binding(1) @group(0) var<storage, read> objects: ObjectData;
@binding(2) @group(0) var<uniform> uniforms: Uniforms;
@binding(3) @group(0) var<storage, read> lights: LightArray;

fn calculate_directional_light(normal: vec3<f32>, light: LightData) -> vec3<f32>{
    var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var ligtCol: vec4<f32> = light.color;
    var lightDir: vec3<f32> = normalize(-light.position);
    var attenuation: f32 = max(dot(-lightDir, normal), 0.0);
    res += ligtCol.xyz * attenuation * light.intensity;
    return res;
}

fn calculate_point_light(normal: vec3<f32>, world_position: vec3<f32>, light: LightData) -> vec3<f32>{

    var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var color: vec3<f32> = light.color.rgb;

    //Normalizing light ray
    var lightToPos: vec3<f32> = world_position - light.position;
    var distToPos: f32 = length(lightToPos);
    lightToPos = lightToPos / distToPos;

   //Distance attenuation
    color *=  mix(light.color.rgb * (1 / (distToPos * distToPos + light.falloff)), vec3<f32>(1.0, 1.0, 1.0), 1.0 - light.falloff);

    //Windowing function
    var win: f32 = 1 - pow((distToPos / light.maxDistance), 4);
    win = max(win, 0.0);
    win = win * win;
    color *= mix(win, 1.0, 1.0 - light.falloff);

    //Diffuse
    var diffuse: f32 = max(dot(-lightToPos, normal), 0.0);

    res += color * diffuse * light.intensity;

    return res;
}

fn calculate_spot_light(normal: vec3<f32>, world_position: vec3<f32>, light: LightData) -> vec3<f32>{

    var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var color: vec3<f32> = light.color.rgb;

    //Normalizing light ray
    var lightToPos: vec3<f32> = world_position - light.position;
    var distToPos: f32 = length(lightToPos);
    lightToPos = lightToPos / distToPos;

    //Distance attenuation
    color *=  mix(light.color.rgb * (1 / (distToPos * distToPos + light.falloff)), vec3<f32>(1.0, 1.0, 1.0), 1.0 - light.falloff);

    //Windowing function
    var win: f32 = 1 - pow((distToPos / light.maxDistance), 4);
    win = max(win, 0.0);
    win = win * win;
    color *= mix(win, 1.0, 1.0 - light.falloff);

    //Spotlight effect
    var spotAngle: f32 = dot(normalize(lightToPos), normalize(light.direction.xyz));
    var umbraAngle: f32 = cos(light.umbra);
    var penumbraAngle: f32 = cos(mix(0, light.umbra, light.penumbra));
    var spot: f32 =  max(((spotAngle - umbraAngle) / (penumbraAngle - umbraAngle)), 0);
    spot = spot * spot;
    spot = min(spot, 1.0);

    //Diffuse
    var diffuse: f32 = max(dot(-lightToPos, normal), 0.0);

    //Final result
    res = color * spot * diffuse * light.intensity;

    return res;
}

fn calculate_light(normal: vec3<f32>, world_position: vec3<f32>) -> vec3<f32>{
    var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    for(var i: u32 = 0; i < NUM_LIGHTS; i = i + 1){
        if(lights.lights[i].intensity == 0.0) {continue;}
        if(lights.lights[i].mode == 0){
            res += calculate_directional_light(normal, lights.lights[i]);
        }
        else if(lights.lights[i].mode == 1){
            res += calculate_point_light(normal, world_position, lights.lights[i]);
        }
        else if(lights.lights[i].mode == 2){
            res += calculate_spot_light(normal, world_position, lights.lights[i]);
        }
    }
    return res;
}

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) normal : vec3<f32>,
    @location(1) world_position : vec3<f32>,
    @location(2) uv : vec2<f32>,
};


@vertex
fn vertex_main(@builtin(instance_index) id: u32, 
@location(0) position: vec3<f32>,
@location(1) uv: vec2<f32>,
@location(2) normal: vec3<f32> ) -> VertexOutput {
    var output: VertexOutput;
    var worldPos = (objects.models[id].model * vec4<f32>(position, 1.0));
    output.world_position = worldPos.xyz;
    output.position = transformUBO.projection * transformUBO.view * worldPos;
    output.normal = (objects.models[id].model_i_t * vec4(normal,0)).xyz;
    output.normal = normalize(output.normal);
    output.uv = uv;
    return output;
}

fn procedural_function(uv_in: vec2<f32>) -> vec3<f32> {
    var uv: vec2<f32> = uv_in;
    uv *= 256.0;

    var time: f32 = uniforms.time * 0.2;

    var color1: f32 = (sin(dot(uv, vec2<f32>(sin(time * 3.0), cos(time * 3.0)))*0.02 + time * 3.0) + 1.0) / 2.0;
    var center: vec2<f32> = vec2<f32>(640.0 / 2.0, 360.0 / 2.0) + vec2<f32>(640.0 / 2.0 * sin(-time * 3.0), 360.0 / 2.0 * cos(-time * 3.0));
    var color2: f32 = (cos(length(uv - center) * 0.03) + 1.0) / 2.0;
    var color: f32 = (color1 + color2) / 2.0;

    var red: f32 = (cos(PI * color / 0.5 + time * 3.0) + 1.0) / 2.0;
    var green: f32 = (sin(PI * color / 0.5 + time * 3.0) + 1.0) / 2.0;
    var blue: f32 = (sin(time * 3.0) + 1.0) / 2.0;

    return vec3<f32>(red, green, blue);
}

@fragment
fn fragment_main(fragData: VertexOutput) -> @location(0) vec4<f32>{

    var res: vec3<f32> = uniforms.color.xyz * uniforms.ambient;
    res += calculate_light(fragData.normal, fragData.world_position) * uniforms.color.xyz;
    res *= procedural_function(fragData.uv);
    return vec4<f32>(res, 1.0);

}