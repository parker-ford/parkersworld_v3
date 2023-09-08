import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'; 
import Stats from 'stats-js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { BoxGeometry } from 'three';

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
    Textures
*/
const textureLoader = new THREE.TextureLoader();
const bumpMap = textureLoader.load('./models/Frame/frame_new/frame_bump.png');
const diffuseMap = textureLoader.load('./models/Frame/frame_new/frame_diff.png');
const reflectionMap = textureLoader.load('./models/Frame/frame_new/frame_refl.png');

const normalMap = textureLoader.load('./images/portrait/normal2.jpg');
gui.add(parameters, "repeat").min(1).max(6).onChange((val) => {

    normalMap.repeat.set(val,val);
})


/*
    Video
*/
const video = document.createElement('video');
video.src = './images/portrait/vid3_compressed.mp4'
video.loop = true;
video.muted = true;
video.playbackRate = 0.8;
video.play();
const videoTexture = new THREE.VideoTexture(video);


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
console.log(frameMaterial);
const materialFolder = gui.addFolder("Material")
materialFolder.add(frameMaterial, 'metalness').min(0).max(1)
materialFolder.add(frameMaterial, 'roughness').min(0).max(1)
materialFolder.add(frameMaterial, 'bumpScale').min(0).max(1)
materialFolder.addColor(frameMaterial, 'color')
materialFolder.addColor(frameMaterial, 'emissive')
materialFolder.add(frameMaterial, 'emissiveIntensity').min(0).max(1)

/*
    Models
*/
const fbxLoader = new FBXLoader();
let paintingMesh;
const paintingParent = new THREE.Object3D();
scene.add(paintingParent);

const planeGeometry = new THREE.PlaneGeometry();
const planeMaterial = new THREE.MeshStandardMaterial(
    {
        map: videoTexture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.1,0.1),
        metalness: 0.15,
        roughness: 0.5
    }
);
const paintingMaterialFolder = gui.addFolder("Painting Material");
paintingMaterialFolder.add(planeMaterial, "metalness").min(0).max(1);
paintingMaterialFolder.add(planeMaterial, "roughness").min(0).max(1);
parameters.normalScale = 1;
paintingMaterialFolder.add(parameters, "normalScale").min(0).max(1).onChange((val) => {
    planeMaterial.normalScale.set(val,val);
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh)
planeMesh.position.set(0,0,.05)
planeMesh.scale.set(4,4,1)
paintingParent.add(planeMesh)

fbxLoader.load(
    './models/Frame/frame_new/frame.fbx',
    (object) => {
        console.log(object)
        paintingMesh = object;
        const axesHelper = new THREE.AxesHelper(10);
        // object.add(axesHelper)
        object.position.set(.3,-3,0);
        object.scale.set(.045,.053,.05);
        gui.add(object.scale, 'x').min(0).max(.1).step(.001)
        gui.add(object.scale, 'y').min(0).max(.1).step(.001)
        gui.add(object.scale, 'z').min(0).max(.1).step(.001)
        object.children[1].material = frameMaterial;
        // object.children[0].material.map = paintingMap;
        paintingParent.add(object)
        // scene.add(object)
    },
    () => {
        console.log('progress')
    },
    (error) => {
        console.log('error', error)
    }
)

/*
    Test Object
*/

const cubeGeometry = new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshPhongMaterial();
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
const axesHelper2 = new THREE.AxesHelper(1);
cubeMesh.add(axesHelper2);
// scene.add(cubeMesh);


/*
    Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5;
scene.add(camera)


/*
    Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const ambientLightFolder = gui.addFolder("Ambient Light");
ambientLight.color.set(0xffeed1)
ambientLightFolder.addColor(ambientLight, "color");
ambientLightFolder.add(ambientLight, "intensity").min(0).max(1);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
scene.add(directionalLight)
directionalLight.position.set(-3.3, 5, 3.3);
directionalLight.color.set(0xf4deb8);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1); // 0.2 is the size of the helper
// scene.add(lightHelper);


const directionalLightFolder = gui.addFolder("Directional Light")
directionalLightFolder.add(directionalLight.position, "x").min(-10).max(10)
directionalLightFolder.add(directionalLight.position, "y").min(-10).max(10)
directionalLightFolder.add(directionalLight.position, "z").min(-10).max(10)
directionalLightFolder.add(directionalLight, "intensity").min(0).max(1)
directionalLightFolder.addColor(directionalLight, 'color')



/*
    Create Scene
*/
let renderer;
// let controls;
let prevTarget = new THREE.Vector3();
let target = new THREE.Vector3();
const lerpAmount = 0.01;
export const createScene = (el) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el,
        antialias: true
    })

    // controls = new OrbitControls(camera, el)
    // controls.enableDamping = true;

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    // renderer.setClearColor(0x333333);

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
    prevTarget.lerp(target, lerpAmount);
    paintingParent.lookAt(prevTarget);

    if(paintingMesh){
        paintingParent.position.y = Math.sin(elapsedTime * 1.1) * .11 ;
    }

    renderer.render(scene,camera)
    //controls.update();
    lightHelper.update()
    window.requestAnimationFrame(tick) 

}

