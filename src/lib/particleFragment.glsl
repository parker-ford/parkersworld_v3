uniform vec3 lightPosition;
uniform vec3 lightDirection;
uniform float lightAngle;
uniform float lightIntensity;
uniform vec3 lightColor;
uniform float lightPenumbra;
varying vec3 vPosition;

void main() {

    vec4 illuminatedColor = vec4(1.0,1.0, 1.0, 1.0);
    vec4 unilluminatedColor = vec4(1.0, 1.0, 1.0, 0.0);

    vec3 lightToParticle = vPosition - lightPosition;
    vec3 dir = normalize(-lightPosition);
    float angle = acos(dot(normalize(lightToParticle), normalize(dir)));

    float outerCone = lightAngle;
    float innerCone = lightAngle * (1.0 - 0.8); 

    if (angle < innerCone) {
        gl_FragColor = illuminatedColor;
    } else if (angle < outerCone) {
        // Calculate the gradient in the penumbra region
        float t = (angle - innerCone) / (outerCone - innerCone);
        gl_FragColor = mix(illuminatedColor, unilluminatedColor, t);
    } else {
        gl_FragColor = unilluminatedColor;
    }


    // if(angle < lightAngle){ 
    //     gl_FragColor = illuminatedColor;
    // }
    // else{
    //     gl_FragColor = unilluminatedColor;
    // }
    
}