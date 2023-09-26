uniform sampler2D tDiffuse;
uniform vec3 userColor;
uniform int boxBlurKernelSize;
uniform int kuwaharaFilterSize;
uniform vec2 canvasSize;

varying vec2 vUv;

vec4 boxBlur(sampler2D tex, vec2 uv) {
    int kernelSize = boxBlurKernelSize;
    int offset = kernelSize / 2;
    vec4 sumColor = vec4(0,0,0,0);

    for(int i = -offset; i < offset; i++){
        for(int j = -offset; j < offset; j++){
            sumColor += texture2D(tex, uv + (vec2(float(i), float(j)) / canvasSize));
        }
    }
    int numSamples = (2 * offset + 1) * (2 * offset + 1);
    return sumColor / float(numSamples);
    // return vec4(canvasSize, 0.0, 1.0);
}

vec4 calculateMean(int lowerX, int upperX, int lowerY, int upperY,sampler2D tex, vec2 uv){
    vec4 sumColor = vec4(0.0, 0.0, 0.0, 0.0);
    for(int i = lowerX; i < upperX; i++){
        for(int j = lowerY; j < upperY; j++){
            sumColor += texture2D(tex, uv + (vec2(float(i), float(j)) / canvasSize));
        }
    }
    int numSamples = (upperX - lowerX) * (upperY - lowerY);
    return sumColor / float(numSamples);
}

vec4 calculateStandardDeviation(int lowerX, int upperX, int lowerY, int upperY, vec4 meanColor, sampler2D tex, vec2 uv){
    vec4 sumSqDiff = vec4(0.0, 0.0, 0.0, 0.0);
    for(int i = lowerX; i < upperX; i++){
        for(int j = lowerY; j < upperY; j++){
            vec4 color = texture2D(tex, uv + (vec2(float(i), float(j)) / canvasSize));
            sumSqDiff += (color - meanColor) * (color - meanColor);
        }
    }
    int numSamples = (upperX - lowerX) * (upperY - lowerY);
    vec4 variance = sumSqDiff / float(numSamples);
    return sqrt(variance);
}

vec4 kuwaharaFilter(sampler2D tex, vec2 uv){
    int kernelSize = kuwaharaFilterSize;
    float minStandardDeviation = 256.0;
    vec4 resultColor = vec4(0.0, 0.0, 0.0, 0.0);

    //Quadrant 1, Upper Left
    vec4 avgColor1 = calculateMean(-kernelSize, 1, -kernelSize, 1, tex, uv);
    float standardDeviation1 = length(calculateStandardDeviation(-kernelSize, 1, -kernelSize, 1, avgColor1, tex, uv));
    if(standardDeviation1 < minStandardDeviation){
        minStandardDeviation = standardDeviation1;
        resultColor = avgColor1;
    }

    //Quadrant 2, Upper Right
    vec4 avgColor2 = calculateMean(-kernelSize, 1, 0, kernelSize + 1, tex, uv);
    float standardDeviation2 = length(calculateStandardDeviation(-kernelSize, 1, 0, kernelSize + 1, avgColor2, tex, uv));
    if(standardDeviation2 < minStandardDeviation){
        minStandardDeviation = standardDeviation2;
        resultColor = avgColor2;
    }

    //Quadrant 3, Lower Left
    vec4 avgColor3 = calculateMean(0, kernelSize + 1, -kernelSize, 1, tex, uv);
    float standardDeviation3 = length(calculateStandardDeviation(0, kernelSize + 1, -kernelSize, 1, avgColor3, tex, uv));
    if(standardDeviation3 < minStandardDeviation){
        minStandardDeviation = standardDeviation3;
        resultColor = avgColor3;
    }

    //Quadrant 4, Lower Right
    vec4 avgColor4 = calculateMean(0, kernelSize + 1, 0, kernelSize + 1, tex, uv);
    float standardDeviation4 = length(calculateStandardDeviation(0, kernelSize + 1, 0, kernelSize + 1, avgColor4, tex, uv));
    if(standardDeviation4 < minStandardDeviation){
        minStandardDeviation = standardDeviation4;
        resultColor = avgColor4;
    }

    return resultColor;
}

void main() {
//   gl_FragColor = texture2D(tDiffuse, vUv) * vec4(userColor, 1.0);
//   gl_FragColor = boxBlur(tDiffuse, vUv);
    // gl_FragColor = kuwaharaFilter(tDiffuse, vUv);
    gl_FragColor = texture2D(tDiffuse, vUv);
}