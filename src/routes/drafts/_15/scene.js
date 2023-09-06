import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'; 
import Stats from 'stats-js'
import { BoxGeometry } from 'three';


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


/*
    Textures
*/
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/images/particles/8.png')

/*
    Fonts
*/

/*
    Lights
*/

/*
    Objects
*/

/*
    Particles
*/
const particlesGeometry = new THREE.BufferGeometry();
const count = 8000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)



const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: '#ff88cc',
})
particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;
// particleMaterial.depthTest = false;
// particleMaterial.alphaTest = 0.001;
particleMaterial.depthWrite = false;
particleMaterial.blending = THREE.AdditiveBlending;
particleMaterial.vertexColors = true;

const particles = new THREE.Points(particlesGeometry, particleMaterial)
scene.add(particles)

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

    const elapsedTime = clock.getElapsedTime();

    // for(let i = 0; i < count; i++){
    //     const i3 = i*3;
    //     const x = particlesGeometry.attributes.position.array[i3 + 0];
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    // }

    //particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene,camera)
    controls.update();
    window.requestAnimationFrame(tick) 

}

