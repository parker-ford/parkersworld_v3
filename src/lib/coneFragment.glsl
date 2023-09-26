varying vec3 vPosition;
varying vec2 vUv;
uniform float coneHeight;
uniform float coneRadius;
uniform vec3 coneColor;
uniform float coneStrength;
uniform sampler2D noiseTexture;
uniform float intensity;

void main(){
    vec2 tiledUv = vec2(vUv.x * 40., vUv.y * 40.);
    float noiseVal = texture2D(noiseTexture, tiledUv).r;


    float distanceFromTip = (vPosition.y - coneHeight / 2.);
    float normalizedDistanceY = clamp(distanceFromTip / coneHeight, 0.0, 1.0);

    float distanceFromAxis = length(vec2(vPosition.x, vPosition.z));
    float normalizedDistanceR = clamp(distanceFromAxis / coneRadius, 0.0, 1.0);
    // normalizedDistanceR
    float radiusFalloff = mix(1.0, 0.0, pow(normalizedDistanceR, 0.2));
    // gl_FragColor = vec4(1.0 , 1.0, 1.0, radiusFalloff);

    float distanceFalloff = (distanceFromTip) * (-1. / coneHeight) * normalizedDistanceR;
    distanceFalloff = mix(1.0, 0.0, pow(distanceFalloff, 0.2));

    gl_FragColor = vec4(coneColor.rgb, distanceFalloff * radiusFalloff * intensity * coneStrength);
    // gl_FragColor = texture2D(noiseTexture, tiledUv);
}