import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'; 
import { MeshLambertMaterial } from 'three';

const sizes = {
    width: 800,
    height: 600
}

const scene = new THREE.Scene();

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log("onStart")
}

loadingManager.onLoad = () => {
    console.log('onLoad')
}

loadingManager.onProgress = () => {
    console.log('onProgress')
}

loadingManager.onError = () => {
    console.log('onError')
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/images/door/color.jpg');
const alphaTexture = textureLoader.load('/images/door/alpha.jpg');
const heightTexture = textureLoader.load('/images/door/height.png');
const metallicTexture = textureLoader.load('/images/door/metallic.jpg');
const normalTexture = textureLoader.load('/images/door/normal.jpg');
const roughnessTexture = textureLoader.load('/images/door/roughness.jpg');
const ambientOcclusion = textureLoader.load('/images/door/ambientOcclusion.jpg');
const matcapTexture = textureLoader.load('/images/matcaps/1.png');
const gradientTexture = textureLoader.load('/images/gradients/3.jpg');
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;


// const material = new THREE.MeshBasicMaterial();
// material.map = colorTexture;
// //material.color.set(0x00ff00);
// material.transparent = true;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

//const material = new THREE.MeshNormalMaterial()

//const material = new THREE.MeshMatcapMaterial();
//material.matcap = matcapTexture

//const material = new THREE.MeshDepthMaterial();

//const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular.set(0xff0000);

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture;

const material = new THREE.MeshStandardMaterial();
material.map = colorTexture;
material.aoMap = ambientOcclusion;
material.aoMapIntensity = 1;
material.displacementMap = heightTexture;
material.displacementScale = 0.1;
material.metalnessMap = metallicTexture;
material.roughnessMap = roughnessTexture;
material.normalMap = normalTexture;
material.alphaMap = alphaTexture;
material.transparent = true;

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
sphere.position.x = -1.5;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1, 100, 100),
    material
)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
torus.position.x = 1.5

scene.add(sphere, plane, torus);




const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight);

window.addEventListener('resize', () => {
    //console.log("resize")

    //update sizes
    //widht = ...
    //height = ...

    //update camera
    //camera.aspect = width / height
    //camera.updateProjectionMatrix

    //update renderer
    //renderer.setSize(width, height)
    //reset window pixel ration
})




const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4;
scene.add(camera)

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

    window.addEventListener('dblclick', () => {

        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

        if(!fullscreenElement){
            if(el.requestFullscreen){
                el.requestFullscreen()
            }
            else if(el.webkitRequestFullscreen){
                el.webkitRequestFullscreen()
            }
        }
        else{
            if(document.exitFullscreen){
                document.exitFullscreen();
            }
            else if(document.webkitExitFullscreen){
                document.webkitExitFullscreen();
            }
        }
    })
    //renderer.render(scene,camera)
    tick()
}

//let time = Date.now()

//Clock
const clock = new THREE.Clock();

const tick = () => {

    const elapshedTime = clock.getElapsedTime()

    sphere.rotation.y = 0.1 * elapshedTime;
    plane.rotation.y = 0.1 * elapshedTime;
    torus.rotation.y = 0.1 * elapshedTime;

    sphere.rotation.x = 0.15 * elapshedTime;
    plane.rotation.x = 0.15 * elapshedTime;
    torus.rotation.x = 0.15 * elapshedTime;

    renderer.render(scene,camera)
    controls.update();
    window.requestAnimationFrame(tick) 
}

