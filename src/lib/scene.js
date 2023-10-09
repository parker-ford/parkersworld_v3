import * as THREE from 'three';
import GUI from 'lil-gui'; 
import Stats from 'stats-js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import fragmentShader from './fragmentShader.glsl?raw'
import vertexShader from './vertexShader.glsl?raw'
import particleFragment from './particleFragment.glsl?raw'
import particleVertex from './particleVertex.glsl?raw'
import coneFragement from './coneFragment.glsl?raw'
import coneVertex from './coneVertex.glsl?raw'
import vignetteShader from './vignetteShader.glsl?raw'

/*
    Initial Setup
*/
let isMobile = false;
if (window.matchMedia('(max-width: 767px)').matches) {
    isMobile = true;
} else {
    isMobile = false;
}

const sizes = {
    width: document.body.clientWidth * 0.316,
    height: document.body.clientWidth * 0.316 * 0.833
}
if(isMobile){
    sizes.width = document.body.clientWidth * (4/5)
    sizes.height = document.body.clientWidth * (4/5)
}
const scene = new THREE.Scene();
const clock = new THREE.Clock();

/*
    GUI
*/
const gui = new GUI()
gui.domElement.id = 'gui';
gui.domElement.style.display = 'none';
const parameters = {
    color: 0xffffff,
    repeat: 1,
}

/*
    Loading Manager
*/
const loadingManager = new THREE.LoadingManager();

/*
    Textures
*/
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
})

/*
    Video
*/
var checkAllAssetsLoaded = () => {};
const video = document.createElement('video');
video.src = './images/portrait/vid3_compressed.mp4'
video.loop = true;
video.muted = true;
video.playbackRate = 0.8;
let videoReady = false;

video.oncanplaythrough = () => {
    videoReady = true;
    video.play();
    checkAllAssetsLoaded();
}
video.onerror = () => {
    console.error("Error Loading Video");
}


const videoTexture = new THREE.VideoTexture(video);

/*
    Post Processing
*/
const offScene = new THREE.Scene();
const offCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const offPlaneGeo = new THREE.PlaneGeometry(2,2);
parameters.postProcessColor = new THREE.Color(1,1,1);
parameters.boxBlurKernel = 5;
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        tDiffuse: { value: videoTexture },
        userColor: {value: parameters.postProcessColor},
        canvasSize: {value: new THREE.Vector2(512, 512) },
        boxBlurKernelSize: {value: 15},
        kuwaharaFilterSize: {value: 5},
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

const offPlane = new THREE.Mesh(offPlaneGeo, shaderMaterial);
offScene.add(offPlane);
const offTarget = new THREE.WebGLRenderTarget(640, 480);


/*
    Material
*/
const frameMaterial = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    bumpMap: bumpMap,
    metalnessMap: reflectionMap,
    metalness: 0.79,
    roughness: 0.58,
    bumpScale: 0.2,
    color: 0xd3c697,
})

/*
    Models
*/
const fbxLoader = new FBXLoader(loadingManager);
let paintingMesh;
const paintingParent = new THREE.Object3D();
scene.add(paintingParent);
const planeGeometry = new THREE.PlaneGeometry();
const planeMaterial = new THREE.MeshStandardMaterial(
    {
        map: offTarget.texture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.01,0.1),
        metalness: 0.15,
        roughness: 0.5
    }
);

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh)
planeMesh.position.set(0,0,.05)
planeMesh.scale.set(4,4,1)
paintingParent.add(planeMesh)

fbxLoader.load(
    './models/Frame/frame_new/frame.fbx',
    (object) => {
        paintingMesh = object;
        object.position.set(.3,-3,0);
        object.scale.set(.045,.053,.05);
        gui.add(object.scale, 'x').min(0).max(.1).step(.001)
        gui.add(object.scale, 'y').min(0).max(.1).step(.001)
        gui.add(object.scale, 'z').min(0).max(.1).step(.001)
        object.children[1].material = frameMaterial;
        paintingParent.add(object)
    },
    () => {
        // console.log('progress')
    },
    (error) => {
        console.log('error', error)
    }
);

/*
    Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
scene.add(directionalLight)
directionalLight.position.set(-3.3, 5, 3.3);
directionalLight.color.set(0xf4deb8);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1); // 0.2 is the size of the helper
// scene.add(lightHelper);

const spotlight = new THREE.SpotLight(0xf4deb8);
spotlight.position.set(-0.95, 1.58, 4.1);
spotlight.angle = 0.414;
spotlight.penumbra = 0.021;
spotlight.distance = 100;
spotlight.decay = 2;
spotlight.castShadow = true;
spotlight.intensity = 0.0
// scene.add(spotlight);

const spotlightHelper = new THREE.SpotLightHelper(spotlight);
// scene.add(spotlightHelper);

/*
    Particles
*/
const particleCount = 1000;

const positions = new Float32Array(particleCount * 3);
const initialX = new Float32Array(particleCount);
const initialY = new Float32Array(particleCount);
const initialZ = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    initialX[i] = (Math.random() - 0.5) * 10;
    initialY[i] = (Math.random() - 0.5) * 10;
    initialZ[i] = (Math.random() - 0.5) * 10 + 5;
  
    positions[i * 3] = initialX[i];
    positions[i * 3 + 1] = initialY[i];
    positions[i * 3 + 2] = initialZ[i];
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particleGeometry.setAttribute('initialX', new THREE.Float32BufferAttribute(initialX, 1));
particleGeometry.setAttribute('initialY', new THREE.Float32BufferAttribute(initialY, 1));
particleGeometry.setAttribute('initialZ', new THREE.Float32BufferAttribute(initialZ, 1));

const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    transparent: true,
    uniforms: {
        lightPosition: {value: spotlight.position},
        lightDirection: {value: new THREE.Vector3().subVectors(spotlight.target.position, spotlight.position).normalize()},
        lightAngle: {value: spotlight.angle},
        lightIntensity: {value: spotlight.intensity},
        lightColor: {value: spotlight.color},
        lightPenumbra: {value: spotlight.penumbra},
        time: {value: 0.0}
    }
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
// scene.add(particles);

const coneHeight = 20;
const radius = Math.tan(spotlight.angle) * coneHeight;
const segments = 32;
const coneGeometry = new THREE.ConeGeometry(radius, coneHeight, segments);
parameters.coneStrength = 1.55;
const coneMaterial = new THREE.ShaderMaterial({
    vertexShader: coneVertex,
    fragmentShader: coneFragement,
    transparent: true,
    uniforms:{
        coneHeight: {value: coneHeight},
        coneRadius: {value: radius},
        coneColor: {value: spotlight.color},
        coneStrength: {value: parameters.coneStrength},
        noiseTexture: {type: 't', value: whiteNoise},
        intensity: {value: spotlight.intensity}
    }
});
coneMaterial.depthWrite = false;

const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.set(0,0,(coneHeight / 2));
coneMesh.rotation.x = - Math.PI / 2;

const pivot = new THREE.Object3D();
pivot.add(coneMesh);
spotlight.add(pivot);
pivot.lookAt(spotlight.target.position)

/*
    Vignette
*/
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


/*
    Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5;
scene.add(camera)

/* 

Test object

*/
const boxGeo = new THREE.BoxGeometry();
const boxMat = new THREE.MeshBasicMaterial();
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
boxMesh.position.z = 4;
scene.add(boxMesh);


/*
    Create Scene
*/
let renderer;
let controls;
let prevTarget = new THREE.Vector3();
let target = isMobile ? new THREE.Vector3(0,0,3) : new THREE.Vector3(-1,0,3);
const lerpAmount = 0.01;
let composer;
export const createScene = (el, onLoaded) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el,
        antialias: true
    })

    var modelsLoaded = false;
    loadingManager.onLoad = (() => {
        modelsLoaded = true;
        // onLoaded();
        checkAllAssetsLoaded();
    })

    checkAllAssetsLoaded = () => {
        console.log("test")
        if(modelsLoaded && videoReady){
            onLoaded();
            scene.remove(boxMesh);
        }
    }

    // controls = new OrbitControls(camera, el)
    // controls.enableDamping = true;

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.sortObjects = true;
    // renderer.setClearColor(0x333333);
    composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const shaderPass = new ShaderPass(vignetteMaterial);
    shaderPass.renderToScreen = true;
    composer.addPass(shaderPass)

    window.addEventListener('resize', () => {

        if (window.matchMedia('(max-width: 767px)').matches) {
            isMobile = true;
        } else {
            isMobile = false;
        }     

        if(!isMobile){
            sizes.width = document.body.clientWidth * 0.316
            sizes.height = document.body.clientWidth * 0.316 * 0.833
        }
        if(isMobile){
            sizes.width = document.body.clientWidth * (4/5)
            sizes.height = document.body.clientWidth * (4/5)
        }
    
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
    });

    window.addEventListener('mousemove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        const pointNDC = new THREE.Vector3(x, y, 0.5);
        pointNDC.unproject(camera);
        const dir = pointNDC.sub(camera.position).normalize();
        target = camera.position.clone().add(dir.multiplyScalar(1.75));
        //prevTarget.lerp(target, lerpAmount);
        
        // if(paintingMesh){
        //     paintingMesh.lookAt(pointNDC);
        // }
        // paintingParent.lookAt(prevTarget);
        // cubeMesh.lookAt(target);
    })

    
    tick()
}
/*
    Update Function
*/
let elapsedTime = 0;
const tick = () => {

    const time = clock.getDelta();
    elapsedTime += time;

    renderer.setRenderTarget(offTarget);
    renderer.render(offScene, offCamera);
    renderer.setRenderTarget(null);

    prevTarget.lerp(target, lerpAmount);
    paintingParent.lookAt(prevTarget);

    if(paintingMesh){
        paintingParent.position.y = Math.sin(elapsedTime * 1.1) * .11 ;
    }

    particleMaterial.uniforms.time.value = performance.now() / 1000;
    // renderer.render(scene,camera)
    composer.render()
    // controls.update();
    lightHelper.update()
    spotlightHelper.update();
    window.requestAnimationFrame(tick) 
}


/*
GUI Parameters
*/

const postProcessFolder = gui.addFolder("Post Process")
postProcessFolder.addColor(parameters, "postProcessColor");
postProcessFolder.add(parameters,"boxBlurKernel");

const materialFolder = gui.addFolder("Material")
materialFolder.add(frameMaterial, 'metalness').min(0).max(1)
materialFolder.add(frameMaterial, 'roughness').min(0).max(1)
materialFolder.add(frameMaterial, 'bumpScale').min(0).max(1)
materialFolder.addColor(frameMaterial, 'color')
materialFolder.addColor(frameMaterial, 'emissive')
materialFolder.add(frameMaterial, 'emissiveIntensity').min(0).max(1)

const paintingMaterialFolder = gui.addFolder("Painting Material");
paintingMaterialFolder.add(planeMaterial, "metalness").min(0).max(1);
paintingMaterialFolder.add(planeMaterial, "roughness").min(0).max(1);
parameters.normalScale = 1;
paintingMaterialFolder.add(parameters, "normalScale").min(0).max(1).onChange((val) => {
    planeMaterial.normalScale.set(val,val);
});

const ambientLightFolder = gui.addFolder("Ambient Light");
ambientLight.color.set(0xffeed1)
ambientLightFolder.addColor(ambientLight, "color");
ambientLightFolder.add(ambientLight, "intensity").min(0).max(1);

parameters.directionalLightOn = true;
parameters.directionaLightIntensity = directionalLight.intensity;
const directionalLightFolder = gui.addFolder("Directional Light")
directionalLightFolder.add(directionalLight.position, "x").min(-10).max(10)
directionalLightFolder.add(directionalLight.position, "y").min(-10).max(10)
directionalLightFolder.add(directionalLight.position, "z").min(-10).max(10)
directionalLightFolder.add(directionalLight, "intensity").min(0).max(3).onChange((value) => {parameters.directionaLightIntensity = value})
directionalLightFolder.addColor(directionalLight, 'color')
directionalLightFolder.add(parameters, 'directionalLightOn').onChange((value) => {
    if(value){
        directionalLight.intensity = parameters.directionaLightIntensity;
    }
    else{
        directionalLight.intensity = 0;
    }
});

gui.add(parameters, "coneStrength").min(0).max(4).onChange((value) => {
    coneMaterial.uniforms.coneStrength.value = value;
})

const spotLightFolder = gui.addFolder("Spot Light");
parameters.spotLightIntensity = spotlight.intensity;
parameters.spotLightOn = true;
spotLightFolder.add(spotlight.position, "x").min(-10).max(10).onChange(() => {pivot.lookAt(spotlight.target.position)})
spotLightFolder.add(spotlight.position, "y").min(-10).max(10).onChange(() => {pivot.lookAt(spotlight.target.position)})
spotLightFolder.add(spotlight.position, "z").min(-10).max(10).onChange(() => {pivot.lookAt(spotlight.target.position)})
spotLightFolder.add(spotlight, "angle").min(0).max(1).onChange((value) => {
    particleMaterial.uniforms.lightAngle.value = value;

    const coneBaseRadius = Math.tan(value) * coneHeight * .12;
    
    // Set the scale of the cone directly
    coneMesh.scale.setX(coneBaseRadius);
    coneMesh.scale.setZ(coneBaseRadius);

})
spotLightFolder.add(spotlight, "penumbra").min(0).max(1).onChange((value) => {
    particleMaterial.uniforms.lightPenumbra.value = value;
})
spotLightFolder.add(spotlight, "distance").min(1).max(20).onChange((value) => {
    coneMesh.scale.set(value * .1,value * .1,value * .1);
    coneMesh.position.set(0,0,(value / 2));
});
spotLightFolder.add(spotlight, "decay")
spotLightFolder.addColor(spotlight, "color")
spotLightFolder.add(spotlight, "intensity").min(0).max(3).onChange((value) => {
    particleMaterial.uniforms.lightIntensity.value = value;
    parameters.spotLightIntensity = value;
    coneMaterial.uniforms.intensity.value = value;
});
spotLightFolder.add(parameters, "spotLightOn").onChange((value) => {
    if(value){
        spotlight.intensity = parameters.spotLightIntensity;
        coneMaterial.uniforms.intensity.value = parameters.spotLightIntensity;
    }
    else{
        spotlight.intensity = 0;
        coneMaterial.uniforms.intensity.value = 0;
    }
})

parameters.vignetteDarknessX = vignetteMaterial.uniforms.vignetteDarknessX.value;
parameters.vignetteOffsetX = vignetteMaterial.uniforms.vignetteOffsetX.value;
parameters.vignetteDarknessY = vignetteMaterial.uniforms.vignetteDarknessY.value;
parameters.vignetteOffsetY = vignetteMaterial.uniforms.vignetteOffsetY.value;
parameters.fadeRate = vignetteMaterial.uniforms.fadeRate.value;;

gui.add(parameters, "vignetteDarknessX").min(0).max(1).onChange((value) => {
    vignetteMaterial.uniforms.vignetteDarknessX.value = value;
})
gui.add(parameters, "vignetteOffsetX").min(0).max(1).onChange((value) => {
    vignetteMaterial.uniforms.vignetteOffsetX.value = value;
})
gui.add(parameters, "vignetteDarknessY").min(0).max(1).onChange((value) => {
    vignetteMaterial.uniforms.vignetteDarknessY.value = value;
})
gui.add(parameters, "vignetteOffsetY").min(0).max(1).onChange((value) => {
    vignetteMaterial.uniforms.vignetteOffsetY.value = value;
})
gui.add(parameters, "fadeRate").min(0.1).max(3.0).onChange((value)=>{
    vignetteMaterial.uniforms.fadeRate.value = value;
})
