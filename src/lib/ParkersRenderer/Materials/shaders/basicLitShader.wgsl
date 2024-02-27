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
    _padding: f32,
    color: vec4<f32>
}

struct DirectionalLightArray {
    lights: array<DirectionalLightData>
};

@binding(0) @group(0) var<uniform> transformUBO: TransformData;
@binding(1) @group(0) var<storage, read> objects: ObjectData;
@binding(2) @group(0) var<uniform> color: vec4<f32>;
@binding(3) @group(0) var<storage, read> directionalLights: DirectionalLightArray;

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

@fragment
fn fragment_main(fragData: VertexOutput) -> @location(0) vec4<f32>{

    // return vec4<f32>(abs(directionalLights.lights[0].direction), 1.0);
    return vec4<f32>(directionalLights.lights[0].color.xyz, 1.0);
    // return vec4<f32>(directionalLights.lights[0].color[3] , 0, 0, 1.0);

/*
    var ligtCol: vec4<f32> = directionalLights.lights[0].color;
    // var lightDir: vec3<f32> = normalize(vec3<f32>(-1.0, 2.0, 0.0));
    var lightDir: vec3<f32> = normalize(directionalLights.lights[0].direction);
    var attenuation: f32 = dot(-lightDir, fragData.normal);
    var res: vec3<f32> = color.xyz * ligtCol.xyz * attenuation;
    return vec4<f32>(res, 1.0);
    */
}