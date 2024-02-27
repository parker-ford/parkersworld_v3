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

struct DirectionalLightData {
    direction: vec3<f32>,
    intensity: f32,
    color: vec4<f32>
}

struct DirectionalLightArray {
    lights: array<DirectionalLightData>
};

struct PointLightData {
    position: vec3<f32>,
    intensity: f32,
    color: vec4<f32>,
    falloff: f32,
    _padding: vec3<f32>
};

struct PointLightArray {
    lights: array<PointLightData>
};

@binding(0) @group(0) var<uniform> transformUBO: TransformData;
@binding(1) @group(0) var<storage, read> objects: ObjectData;
@binding(2) @group(0) var<uniform> color: vec4<f32>;
@binding(3) @group(0) var<storage, read> directionalLights: DirectionalLightArray;
@binding(4) @group(0) var<storage, read> pointLights: PointLightArray;

const NUM_DIR_LIGHTS: u32 = 8;
const NUM_POINT_LIGHTS: u32 = 8;

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

fn calculate_directional_light(normal: vec3<f32>) -> vec4<f32>{
    var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    for(var i: u32 = 0; i < NUM_DIR_LIGHTS; i = i + 1){
        if(directionalLights.lights[i].intensity == 0.0) {continue;}
        var ligtCol: vec4<f32> = directionalLights.lights[i].color;
        var lightDir: vec3<f32> = normalize(directionalLights.lights[i].direction);
        var attenuation: f32 = max(dot(-lightDir, normal), 0.0);
        res += ligtCol.xyz * attenuation * directionalLights.lights[i].intensity;
    }
    return vec4<f32>(res, 1.0);
}

fn calculate_point_light(normal: vec3<f32>, world_position: vec3<f32>) -> vec4<f32>{
    var res: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    for(var i: u32 = 0; i < NUM_POINT_LIGHTS; i = i + 1){
        if(pointLights.lights[i].intensity == 0.0) {continue;}
        var d = pointLights.lights[i].position - world_position;
        var r = length(d);
        var l = d / r;

        //This needs to change i think
        var r0: f32 = 1.0;
        var e: f32 = 1.0;
        var c: vec3<f32> = pointLights.lights[i].color.rgb * ((r0 * r0) / (r * r + e));

        var rMax: f32 = 3.0;
        var win: f32 = 1 - pow((r / rMax), 4);
        win = max(win, 0.0);
        win = win * win;

        c *= win;

        var attenuation: f32 = max(dot(l, normal), 0.0);
        res += c * attenuation * pointLights.lights[i].intensity;

    }

    return vec4<f32>(res, 1.0);
}

@fragment
fn fragment_main(fragData: VertexOutput) -> @location(0) vec4<f32>{

    // return vec4<f32>(abs(pointLights.lights[0].falloff), 0, 0, 1.0);

    var directional_light = calculate_directional_light(fragData.normal);
    var point_light = calculate_point_light(fragData.normal, fragData.world_position);
    var res: vec3<f32> = color.xyz * 0.1;
    // res += directional_light.xyz;
    res += point_light.xyz;
    return vec4<f32>(res, 1.0);
    
}