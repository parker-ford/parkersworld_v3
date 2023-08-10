import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'; 
import Stats from 'stats-js'
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

/*
    Initial Setup
*/
const sizes = {
    width: Math.min(document.body.clientWidth, 1400),
    height: Math.min(document.body.clientWidth, 1400) * .5
}
const scene = new THREE.Scene();

const clock = new THREE.Clock();

const useShadows = false;

const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/*
    Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4;
scene.add(camera)

/*
    GUI
*/
const gui = new GUI()
gui.domElement.id = 'gui';
const parameters = {}
/*
    Update all materials
*/
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = parameters.envMapIntensity
        }
    })
}

/*
    Textures
*/
const environmentMap = cubeTextureLoader.load([
    '/images/environmentMaps/1/px.png',
    '/images/environmentMaps/1/nx.png',
    '/images/environmentMaps/1/py.png',
    '/images/environmentMaps/1/ny.png',
    '/images/environmentMaps/1/pz.png',
    '/images/environmentMaps/1/nz.png',
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap
parameters.envMapIntensity = 5;
gui.add(parameters, 'envMapIntensity').min(0).max(10).step(0.001).onChange(() => {
    updateAllMaterials()
})
/*
    Fonts
*/

/*
    Lights
*/
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Light Intensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('Light X')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('Light Y')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('Light Z')

/*
    Models
*/
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10,10,10)
        gltf.scene.position.set(0,-4,0)
        gltf.scene.rotation.y = Math.PI * 0.5;
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.1).name("Rotation")

        updateAllMaterials()
    }
)

/*
    Objects
*/
/*
    Create Scene
*/
let renderer;
let controls;
export const createScene = (el) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el
    })

    controls = new OrbitControls(camera, el)
    controls.enableDamping = true;

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding

    renderer.shadowMap.enabled = useShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    window.addEventListener('resize', () => {
        sizes.width = Math.min(document.body.clientWidth, 1400),
        sizes.height = Math.min(document.body.clientWidth, 1400) * .5 
    
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix
    
        renderer.setSize(sizes.width, sizes.height)
    })
    

    // window.addEventListener('dblclick', () => {

    //     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

    //     // if(!fullscreenElement){
    //     //     if(el.requestFullscreen){
    //     //         el.requestFullscreen()
    //     //     }
    //     //     else if(el.webkitRequestFullscreen){
    //     //         el.webkitRequestFullscreen()
    //     //     }
    //     // }
    //     // else{
    //     //     if(document.exitFullscreen){
    //     //         document.exitFullscreen();
    //     //     }
    //     //     else if(document.webkitExitFullscreen){
    //     //         document.webkitExitFullscreen();
    //     //     }
    //     // }
    // })
    tick()
}
/*
    Update Function
*/
const tick = () => {

    const time = clock.getDelta();

    renderer.render(scene,camera)
    controls.update();
    // window.requestAnimationFrame(tick) 

}

