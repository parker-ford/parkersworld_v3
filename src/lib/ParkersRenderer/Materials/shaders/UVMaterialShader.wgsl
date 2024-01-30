struct TransformData {
    view: mat4x4<f32>,
    projection: mat4x4<f32>
};

struct ObjectData {
    model: array<mat4x4<f32>>,
};

@binding(0) @group(0) var<uniform> transformUBO: TransformData;
@binding(1) @group(0) var<storage, read> objects: ObjectData;


struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) uv : vec2<f32>,
};

@vertex
fn vertex_main(@builtin(instance_index) id: u32, 
    @location(0) position: vec4<f32>, 
    @location(1) color: vec4<f32>,
    @location(2) uv: vec2<f32>
) -> VertexOutput {
    var output: VertexOutput;
    output.position = transformUBO.projection * transformUBO.view * objects.model[id] * position;
    output.uv = uv;
    return output;
}

@fragment
fn fragment_main(fragData: VertexOutput) -> @location(0) vec4<f32>{
    return vec4<f32>(fragData.uv, 0.0, 1.0);
}