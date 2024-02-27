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

@binding(0) @group(0) var<uniform> transformUBO: TransformData;
@binding(1) @group(0) var<storage, read> objects: ObjectData;
@binding(2) @group(0) var<uniform> color: vec4<f32>;
@binding(3) @group(0) var<storage, read> directionalLights: DirectionalLightArray;

const NUM_DIR_LIGHTS: u32 = 8;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) normal : vec3<f32>,
};

@vertex
fn vertex_main(@builtin(instance_index) id: u32, 
@location(0) position: vec3<f32>,
@location(2) normal: vec3<f32> ) -> VertexOutput {
    var output: VertexOutput;
    output.position = transformUBO.projection * transformUBO.view * objects.models[id].model * vec4<f32>(position, 1.0);
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
        res += color.xyz * ligtCol.xyz * attenuation * directionalLights.lights[i].intensity;
    }
    return vec4<f32>(res, 1.0);
}

@fragment
fn fragment_main(fragData: VertexOutput) -> @location(0) vec4<f32>{

    // return vec4<f32>(directionalLights.lights[1].color[3], 0, 0, 1.0);

    var ligtCol: vec4<f32> = directionalLights.lights[0].color;
    var lightDir: vec3<f32> = normalize(directionalLights.lights[0].direction);
    var attenuation: f32 = dot(-lightDir, fragData.normal);
    var directional_light = calculate_directional_light(fragData.normal);
    // var res: vec3<f32> = color.xyz * ligtCol.xyz * attenuation * directionalLights.lights[0].intensity;
    var res: vec3<f32> = color.xyz * directional_light.xyz + color.xyz * 0.05;
    return vec4<f32>(res, 1.0);
    
}