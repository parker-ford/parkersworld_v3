import * as THREE from 'three';
import gsap from 'gsap';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'


const sizes = {
    width: 800,
    height: 600
}
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
    
})

const scene = new THREE.Scene();

const geometry = new THREE.BufferGeometry();

const count = 500;
const positionArray = new Float32Array(count * 3 * 3);

for(let i = 0; i < count * 3 * 3; i++){
    positionArray[i] = (Math.random() - 0.5) * 4
}

const positionsAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute('position', positionsAttribute);


const material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true})
const mesh = new THREE.Mesh(geometry, material);

//position
mesh.position.x = 0;
mesh.position.y = 0;
mesh.position.z = 0;

//scale
mesh.scale.x = 1;
mesh.scale.y = 1;
mesh.scale.z = 1;

//Rotation
mesh.rotation.y = Math.PI * 0
mesh.rotation.x = Math.PI * 0

scene.add(mesh);


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

    renderer.render(scene,camera)
    controls.update();
    //window.requestAnimationFrame(tick) 
}

