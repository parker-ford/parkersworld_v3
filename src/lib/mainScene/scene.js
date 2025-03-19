import * as THREE from 'three';
import GUI from 'lil-gui'; 
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import fragmentShader from './fragmentShader.glsl?raw'
import vertexShader from './vertexShader.glsl?raw'
import vignetteShader from './vignetteShader.glsl?raw'

// Check if mobile device
const isMobile = window.matchMedia('(max-width: 767px)').matches;

// Set up sizes based on device
const sizes = {
    width: isMobile ? document.body.clientWidth * (4/5) : document.body.clientWidth * 0.316,
    height: isMobile ? document.body.clientWidth * (4/5) : document.body.clientWidth * 0.316 * 0.833
}

// Create scene and clock
const scene = new THREE.Scene();
const clock = new THREE.Clock();

// Set up GUI
const gui = new GUI();
gui.domElement.id = 'gui';
gui.domElement.style.display = 'none';

const parameters = {
    color: 0xffffff,
    repeat: 1,
    postProcessColor: new THREE.Color(1,1,1),
    boxBlurKernel: 5
};

// Loading manager
const loadingManager = new THREE.LoadingManager();

// Load textures
const textureLoader = new THREE.TextureLoader();
const bumpMap = textureLoader.load('./models/Frame/frame_new/frame_bump.png');
const diffuseMap = textureLoader.load('./models/Frame/frame_new/frame_diff.png');
const reflectionMap = textureLoader.load('./models/Frame/frame_new/frame_refl.png');
const whiteNoise = textureLoader.load('./images/noise/WhiteNoise.png');
whiteNoise.wrapS = THREE.RepeatWrapping;
whiteNoise.wrapT = THREE.RepeatWrapping;

const normalMap = textureLoader.load('./images/portrait/normal2.jpg');
gui.add(parameters, "repeat").min(1).max(6).onChange((val) => {
    normalMap.repeat.set(val,val);
});

// Set up video
let videoReady = false;
let checkAllAssetsLoaded = () => {};
const video = document.createElement('video');
video.loop = true;
video.muted = true;
video.setAttribute('muted', '');
video.setAttribute('playsinline', '');
video.setAttribute('webkit-playsinline', '');
video.playbackRate = 0.8;

const source = document.createElement('source');
source.src = './images/portrait/vid3_compressed.mp4';
source.type = 'video/mp4';
video.appendChild(source);

video.oncanplaythrough = () => {
    videoReady = true;
    video.play();
    checkAllAssetsLoaded();
};

video.onerror = () => {
    console.error("Error Loading Video");
};

video.load();
const videoTexture = new THREE.VideoTexture(video);

// Post processing setup
const offScene = new THREE.Scene();
const offCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const offPlaneGeo = new THREE.PlaneGeometry(2,2);

const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        tDiffuse: { value: videoTexture },
        userColor: {value: parameters.postProcessColor},
        canvasSize: {value: new THREE.Vector2(512, 512) },
        boxBlurKernelSize: {value: 15},
        kuwaharaFilterSize: {value: 5},
    },
    vertexShader,
    fragmentShader
});

const offPlane = new THREE.Mesh(offPlaneGeo, shaderMaterial);
offScene.add(offPlane);
const offTarget = new THREE.WebGLRenderTarget(640, 480);

// Frame material
const frameMaterial = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    bumpMap: bumpMap,
    metalnessMap: reflectionMap,
    metalness: 0.79,
    roughness: 0.58,
    bumpScale: 0.2,
    color: 0xd3c697,
});

// Set up models
const fbxLoader = new FBXLoader(loadingManager);
let paintingMesh;
const paintingParent = new THREE.Object3D();
scene.add(paintingParent);

const planeGeometry = new THREE.PlaneGeometry();
const planeMaterial = new THREE.MeshStandardMaterial({
    map: offTarget.texture,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.01,0.1),
    metalness: 0.15,
    roughness: 0.5
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.set(0,0,.05);
planeMesh.scale.set(4,4,1);
paintingParent.add(planeMesh);

// Load frame model
fbxLoader.load(
    './models/Frame/frame_new/frame.fbx',
    (object) => {
        paintingMesh = object;
        object.position.set(.3,-3,0);
        object.scale.set(.045,.053,.05);
        object.children[1].material = frameMaterial;
        paintingParent.add(object);
        
        // Add GUI controls
        gui.add(object.scale, 'x').min(0).max(.1).step(.001);
        gui.add(object.scale, 'y').min(0).max(.1).step(.001);
        gui.add(object.scale, 'z').min(0).max(.1).step(.001);
    },
    undefined,
    (error) => console.log('error', error)
);

// Set up lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(-3.3, 5, 3.3);
directionalLight.color.set(0xf4deb8);
scene.add(directionalLight);

const spotlight = new THREE.SpotLight(0xf4deb8);
spotlight.position.set(-0.95, 1.58, 4.1);
spotlight.angle = 0.414;
spotlight.penumbra = 0.021;
spotlight.distance = 100;
spotlight.decay = 2;
spotlight.castShadow = true;
spotlight.intensity = 0.0;

// Set up vignette effect
const vignetteMaterial = new THREE.ShaderMaterial({
    uniforms: {
        tDiffuse: { value: null },
        vignetteOffsetX: { value: 0.0 },
        vignetteDarknessX: { value: 1.0 },
        vignetteOffsetY: { value: 0.0 },
        vignetteDarknessY: { value: 1.0 },
        fadeRate: {value: 1.7}
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: vignetteShader
});

// Set up camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

// Scene variables
let renderer;
let controls;
let prevTarget = new THREE.Vector3();
let target = isMobile ? new THREE.Vector3(0,0,3) : new THREE.Vector3(-1,0,3);
const lerpAmount = 0.01;
let composer;

// Create and export scene
export const createScene = (el, onLoaded) => {
    renderer = new THREE.WebGLRenderer({
        canvas: el,
        antialias: true
    });

    let modelsLoaded = false;
    loadingManager.onLoad = () => {
        modelsLoaded = true;
        checkAllAssetsLoaded();
    };

    checkAllAssetsLoaded = () => {
        if(modelsLoaded && videoReady) {
            onLoaded();
        }
    };

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.sortObjects = true;

    // Set up post processing
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const shaderPass = new ShaderPass(vignetteMaterial);
    shaderPass.renderToScreen = true;
    composer.addPass(shaderPass);

    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        
        sizes.width = isMobile ? document.body.clientWidth * (4/5) : document.body.clientWidth * 0.316;
        sizes.height = isMobile ? document.body.clientWidth * (4/5) : document.body.clientWidth * 0.316 * 0.833;
    
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
    });

    // Handle mouse movement
    window.addEventListener('mousemove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const pointNDC = new THREE.Vector3(x, y, 0.5);
        pointNDC.unproject(camera);
        const dir = pointNDC.sub(camera.position).normalize();
        target = camera.position.clone().add(dir.multiplyScalar(1.75));
    });

    tick();
};

// Animation loop
let elapsedTime = 0;
const tick = () => {
    const time = clock.getDelta();
    elapsedTime += time;

    // Render to offscreen target
    renderer.setRenderTarget(offTarget);
    renderer.render(offScene, offCamera);
    renderer.setRenderTarget(null);

    // Update painting position and rotation
    prevTarget.lerp(target, lerpAmount);
    paintingParent.lookAt(prevTarget);

    if(paintingMesh) {
        paintingParent.position.y = Math.sin(elapsedTime * 1.1) * .11;
    }

    composer.render();
    requestAnimationFrame(tick);
};

// Set up GUI controls
const setupGUIControls = () => {
    const postProcessFolder = gui.addFolder("Post Process");
    postProcessFolder.addColor(parameters, "postProcessColor");
    postProcessFolder.add(parameters, "boxBlurKernel");

    const materialFolder = gui.addFolder("Material");
    materialFolder.add(frameMaterial, 'metalness', 0, 1);
    materialFolder.add(frameMaterial, 'roughness', 0, 1);
    materialFolder.add(frameMaterial, 'bumpScale', 0, 1);
    materialFolder.addColor(frameMaterial, 'color');
    materialFolder.addColor(frameMaterial, 'emissive');
    materialFolder.add(frameMaterial, 'emissiveIntensity', 0, 1);

    const paintingMaterialFolder = gui.addFolder("Painting Material");
    paintingMaterialFolder.add(planeMaterial, "metalness", 0, 1);
    paintingMaterialFolder.add(planeMaterial, "roughness", 0, 1);
    parameters.normalScale = 1;
    paintingMaterialFolder.add(parameters, "normalScale", 0, 1)
        .onChange(val => planeMaterial.normalScale.set(val, val));

    const ambientLightFolder = gui.addFolder("Ambient Light");
    ambientLight.color.set(0xffeed1);
    ambientLightFolder.addColor(ambientLight, "color");
    ambientLightFolder.add(ambientLight, "intensity", 0, 1);

    const directionalLightFolder = gui.addFolder("Directional Light");
    parameters.directionalLightOn = true;
    parameters.directionaLightIntensity = directionalLight.intensity;
    
    directionalLightFolder.add(directionalLight.position, "x", -10, 10);
    directionalLightFolder.add(directionalLight.position, "y", -10, 10);
    directionalLightFolder.add(directionalLight.position, "z", -10, 10);
    directionalLightFolder.add(directionalLight, "intensity", 0, 3)
        .onChange(value => parameters.directionaLightIntensity = value);
    directionalLightFolder.addColor(directionalLight, 'color');
    directionalLightFolder.add(parameters, 'directionalLightOn')
        .onChange(value => {
            directionalLight.intensity = value ? parameters.directionaLightIntensity : 0;
        });

    const spotLightFolder = gui.addFolder("Spot Light");
    parameters.spotLightIntensity = spotlight.intensity;
    parameters.spotLightOn = true;

    spotLightFolder.add(spotlight.position, "x", -10, 10);
    spotLightFolder.add(spotlight.position, "y", -10, 10);
    spotLightFolder.add(spotlight.position, "z", -10, 10);
    spotLightFolder.add(spotlight, "distance", 1, 20);
    spotLightFolder.add(spotlight, "decay");
    spotLightFolder.addColor(spotlight, "color");
    spotLightFolder.add(spotlight, "intensity", 0, 3);
    spotLightFolder.add(parameters, "spotLightOn")
        .onChange(value => {
            spotlight.intensity = value ? parameters.spotLightIntensity : 0;
        });

    const vignetteFolder = gui.addFolder("Vignette");
    parameters.vignetteDarknessX = vignetteMaterial.uniforms.vignetteDarknessX.value;
    parameters.vignetteOffsetX = vignetteMaterial.uniforms.vignetteOffsetX.value;
    parameters.vignetteDarknessY = vignetteMaterial.uniforms.vignetteDarknessY.value;
    parameters.vignetteOffsetY = vignetteMaterial.uniforms.vignetteOffsetY.value;
    parameters.fadeRate = vignetteMaterial.uniforms.fadeRate.value;

    vignetteFolder.add(parameters, "vignetteDarknessX", 0, 1)
        .onChange(value => vignetteMaterial.uniforms.vignetteDarknessX.value = value);
    vignetteFolder.add(parameters, "vignetteOffsetX", 0, 1)
        .onChange(value => vignetteMaterial.uniforms.vignetteOffsetX.value = value);
    vignetteFolder.add(parameters, "vignetteDarknessY", 0, 1)
        .onChange(value => vignetteMaterial.uniforms.vignetteDarknessY.value = value);
    vignetteFolder.add(parameters, "vignetteOffsetY", 0, 1)
        .onChange(value => vignetteMaterial.uniforms.vignetteOffsetY.value = value);
    vignetteFolder.add(parameters, "fadeRate", 0.1, 3.0)
        .onChange(value => vignetteMaterial.uniforms.fadeRate.value = value);
};

setupGUIControls();
