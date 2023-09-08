import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'; 
import Stats from 'stats-js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

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
    color: 0xffffff
}

/*
    Textures
*/
const textureLoader = new THREE.TextureLoader();
const bumpMap = textureLoader.load('./models/Frame/frame_new/frame_bump.png');
const diffuseMap = textureLoader.load('./models/Frame/frame_new/frame_diff.png');
const reflectionMap = textureLoader.load('./models/Frame/frame_new/frame_refl.png');


/*
    Material
*/
const frameMaterial = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    bumpMap: bumpMap,
    metalnessMap: reflectionMap,
    metalness: 1,
    roughness: 0
    // envMap: reflectionMap
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
fbxLoader.load(
    './models/Frame/frame_new/frame.fbx',
    (object) => {
        console.log(object)
        object.position.set(.3,-2.8,0);
        object.scale.set(.05,.05,.05);
        object.children[1].material = frameMaterial
        scene.add(object)
    },
    () => {
        console.log('progress')
    },
    () => {
        console.log('error')
    }
)
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

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
scene.add(directionalLight)
directionalLight.position.set(-3.3, 5, 3.3);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1); // 0.2 is the size of the helper
scene.add(lightHelper);


gui.add(directionalLight.position, "x").min(-10).max(10)
gui.add(directionalLight.position, "y").min(-10).max(10)
gui.add(directionalLight.position, "z").min(-10).max(10)
gui.add(directionalLight, "intensity").min(0).max(1)
gui.addColor(directionalLight, 'color')



/*
    Create Scene
*/
let renderer;
let controls;
export const createScene = (el) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el,
        antialias: true
    })

    controls = new OrbitControls(camera, el)
    controls.enableDamping = true;

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setClearColor(0x333333);

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
    })
    
    tick()
}
/*
    Update Function
*/
const tick = () => {

    const time = clock.getDelta();

    renderer.render(scene,camera)
    controls.update();
    lightHelper.update()
    window.requestAnimationFrame(tick) 

}

