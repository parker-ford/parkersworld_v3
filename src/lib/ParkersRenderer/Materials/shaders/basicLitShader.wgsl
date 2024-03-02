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

// struct DirectionalLightData {
//     direction: vec3<f32>,
//     intensity: f32,
//     color: vec4<f32>
// }

// struct DirectionalLightArray {
//     lights: array<DirectionalLightData>
// };

// struct PointLightData {
//     position: vec3<f32>,
//     intensity: f32,
//     color: vec4<f32>,
//     falloff: f32,
//     maxDistance: f32
//     // _padding: vec3<f32>
// };

// struct PointLightArray {
//     lights: array<PointLightData>
// };

// struct SpotLightData {
//     color: vec4<f32>,
//     position: vec4<f32>,
//     direction: vec4<f32>,
//     intensity: f32,
//     falloff: f32,
//     maxDistance: f32,
//     umbra: f32,
//     penumbra: f32
// };

// struct SpotLightArray {
//     lights: array<SpotLightData>
// };

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


@binding(0) @group(0) var<uniform> transformUBO: TransformData;
@binding(1) @group(0) var<storage, read> objects: ObjectData;
@binding(2) @group(0) var<uniform> color: vec4<f32>;
@binding(3) @group(0) var<storage, read> lights: LightArray; 
// @binding(3) @group(0) var<storage, read> directionalLights: DirectionalLightArray;
// @binding(4) @group(0) var<storage, read> pointLights: PointLightArray;
// @binding(5) @group(0) var<storage, read> spotLights: SpotLightArray;

const NUM_LIGHTS: u32 = 16;
// const NUM_POINT_LIGHTS: u32 = 8;
// const NUM_SPOT_LIGHTS: u32 = 8;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) normal : vec3<f32>,
    @location(1) world_position : vec3<f32>
};

@vertex
fn vertex_main(@builtin(instance_index) id: u32, 
@location(0) position: vec3<f32>,
@location(2) normal: vec3<f32> ) -> VertexOutput {
    var output: VertexOutput;
    var worldPos = (objects.models[id].model * vec4<f32>(position, 1.0));
    output.world_position = worldPos.xyz;
    output.position = transformUBO.projection * transformUBO.view * worldPos;
    output.normal = (objects.models[id].model_i_t * vec4(normal,0)).xyz;
    output.normal = normalize(output.normal);
    return output;
}

fn calculate_directional_light(normal: vec3<f32>, light: LightData) -> vec3<f32>{
    var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var ligtCol: vec4<f32> = light.color;
    var lightDir: vec3<f32> = normalize(-light.position);
    var attenuation: f32 = max(dot(-lightDir, normal), 0.0);
    res += ligtCol.xyz * attenuation * light.intensity;
    return res;
}

// fn calculate_point_light(normal: vec3<f32>, world_position: vec3<f32>) -> vec4<f32>{
//     var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
//     for(var i: u32 = 0; i < NUM_POINT_LIGHTS; i = i + 1){
//         if(pointLights.lights[i].intensity == 0.0) {continue;}
//         var d = pointLights.lights[i].position - world_position;
//         var r = length(d);
//         var l = d / r;

//         //This needs to change i think
//         // var r0: f32 = 1.0;
//         // var e: f32 = pointLights.lights[i].falloff;
//         // var c: vec3<f32> = pointLights.lights[i].color.rgb * ((r0 * r0) / (r * r + e));

//         // var rMax: f32 =  pointLights.lights[i].maxDistance;
//         // var win: f32 = 1 - pow((r / rMax), 4);
//         // win = max(win, 0.0);
//         // win = win * win;

//         // c *= win;

//         var attenuation: f32 = dot(l, normal);
//         //res += c * attenuation * pointLights.lights[i].intensity;
//         res += pointLights.lights[i].color.rgb * attenuation;

//     }

//     return vec4<f32>(res, 1.0);
// }

// fn calculate_spot_light(normal: vec3<f32>, world_position: vec3<f32>) -> vec4<f32>{
//     var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
//     for(var i: u32 = 0; i < NUM_SPOT_LIGHTS; i = i + 1){
//         if(spotLights.lights[i].intensity == 0.0) {continue;}
//         var d = spotLights.lights[i].position.xyz - world_position;
//         var r = length(d);
//         var l = d / r;

//         //This needs to change i think
//         var r0: f32 = 1.0;
//         var e: f32 = spotLights.lights[i].falloff;
//         var c: vec3<f32> = spotLights.lights[i].color.rgb * ((r0 * r0) / (r * r + e));

//         var rMax: f32 =  spotLights.lights[i].maxDistance;
//         var win: f32 = 1 - pow((r / rMax), 4);
//         win = max(win, 0.0);
//         win = win * win;
//         c *= win;

//         var t: f32 = (dot(l, spotLights.lights[i].direction.xyz) - cos(spotLights.lights[i].umbra)) / (cos(spotLights.lights[i].penumbra) - cos(spotLights.lights[i].umbra));
//         t*=t;

//         var attenuation: f32 = max(dot(l, normal), 0.0);
//         res += c * attenuation * spotLights.lights[i].intensity;

//     }

//     return vec4<f32>(res, 1.0);
// }

fn calculate_light(normal: vec3<f32>, world_position: vec3<f32>) -> vec3<f32>{
    var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    for(var i: u32 = 0; i < NUM_LIGHTS; i = i + 1){
        if(lights.lights[i].intensity == 0.0) {continue;}
        if(lights.lights[i].mode == 0){
            res += calculate_directional_light(normal, lights.lights[i]);
        }
        // else if(lights.lights[i].mode == 0){

        // }
    }
    return res;
}

@fragment
fn fragment_main(fragData: VertexOutput) -> @location(0) vec4<f32>{


    // var directional_light = calculate_directional_light(fragData.normal);
    // var point_light = calculate_point_light(fragData.normal, fragData.world_position);
    // var spot_light = calculate_spot_light(fragData.normal, fragData.world_position);
    var res: vec3<f32> = color.xyz * 0.1;
    res += calculate_light(fragData.normal, fragData.world_position);
    //res += point_light.xyz;
    // res += spot_light.xyz;
    return vec4<f32>(res, 1.0);
    
}