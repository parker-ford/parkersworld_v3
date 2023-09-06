import Experience from "./Experience/Experience";

export const createScene = (el) => {
    const experience = new Experience(el);
}

// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
// import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
// import GUI from 'lil-gui'; 
// import Stats from 'stats-js'


// /*
//     Initial Setup
// */
// const sizes = {
//     width: Math.min(document.body.clientWidth, 1400),
//     height: Math.min(document.body.clientWidth, 1400) * .5
// }
// const scene = new THREE.Scene();

// const clock = new THREE.Clock();

// const useShadows = false;

// /*
//     Camera
// */
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.z = 4;
// scene.add(camera)

// /*
//     GUI
// */
// const gui = new GUI()
// gui.domElement.id = 'gui';


// /*
//     Textures
// */


// /*
//     Fonts
// */

// /*
//     Lights
// */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
// directionalLight.position.set(2,2,-1)
// directionalLight.castShadow = useShadows;
// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.top = 2;
// directionalLight.shadow.camera.right = 2;
// directionalLight.shadow.camera.bottom = - 2;
// directionalLight.shadow.camera.left = - 2;
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 6;
// directionalLight.shadow.radius = 10

// scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// directionalLightCameraHelper.visible = false;
// scene.add(directionalLightCameraHelper);


// const pointLight = new THREE.PointLight(0xffffff, 0.3)

// pointLight.castShadow = useShadows;
// pointLight.shadow.mapSize.width = 1024;
// pointLight.shadow.mapSize.height = 1024;
// pointLight.shadow.camera.near = 0.1;
// pointLight.shadow.camera.far = 5;

// pointLight.position.set(-1, 1, 0);
// scene.add(pointLight);

// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// pointLightCameraHelper.visible = false;
// scene.add(pointLightCameraHelper)


// /*
//     Objects
// */
// const material = new THREE.MeshStandardMaterial();
// material.roughness = 0.4;

// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     material
// )
// sphere.castShadow = true;


// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(5,5),
//     material
// )
// plane.rotation.x = -Math.PI * 0.5;
// plane.position.y = -0.65;
// plane.receiveShadow = true;

// scene.add(sphere, plane)


// /*
//     Create Scene
// */
// let renderer;
// let controls;
// export const createScene = (el) => {

//     renderer = new THREE.WebGLRenderer({
//         canvas: el
//     })

//     controls = new OrbitControls(camera, el)
//     controls.enableDamping = true;

//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

//     renderer.shadowMap.enabled = useShadows;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//     window.addEventListener('resize', () => {
//         sizes.width = Math.min(document.body.clientWidth, 1400),
//         sizes.height = Math.min(document.body.clientWidth, 1400) * .5 
    
//         camera.aspect = sizes.width / sizes.height
//         camera.updateProjectionMatrix
    
//         renderer.setSize(sizes.width, sizes.height)
//     })
    

//     // window.addEventListener('dblclick', () => {

//     //     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

//     //     // if(!fullscreenElement){
//     //     //     if(el.requestFullscreen){
//     //     //         el.requestFullscreen()
//     //     //     }
//     //     //     else if(el.webkitRequestFullscreen){
//     //     //         el.webkitRequestFullscreen()
//     //     //     }
//     //     // }
//     //     // else{
//     //     //     if(document.exitFullscreen){
//     //     //         document.exitFullscreen();
//     //     //     }
//     //     //     else if(document.webkitExitFullscreen){
//     //     //         document.webkitExitFullscreen();
//     //     //     }
//     //     // }
//     // })
//     tick()
// }
// /*
//     Update Function
// */
// const tick = () => {

//     const time = clock.getDelta();

//     renderer.render(scene,camera)
//     controls.update();
//     // window.requestAnimationFrame(tick) 

// }

