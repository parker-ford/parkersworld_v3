uniform float vignetteOffsetX;
uniform float vignetteDarknessX;
uniform float vignetteOffsetY;
uniform float vignetteDarknessY;
uniform sampler2D tDiffuse;
uniform float fadeRate;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(tDiffuse, vUv);

    float distX = (vUv.x - 0.5) / vignetteDarknessX;
    float distY = (vUv.y - 0.5) / vignetteDarknessY;
    float dist = sqrt(distX * distX + distY * distY);

    float fade = smoothstep(sqrt(vignetteOffsetX * vignetteOffsetX + vignetteOffsetY * vignetteOffsetY), 1.0, dist);

    fade = pow(fade, fadeRate);

    color.rgb *= (1. - fade);
    gl_FragColor = color;
    // gl_FragColor = vec4(vec3(fade), 1.0);
}