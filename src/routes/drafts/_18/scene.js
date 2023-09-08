import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'; 
import Stats from 'stats-js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera)

/*
    GUI
*/
const gui = new GUI()
gui.domElement.id = 'gui';


/*
    Textures
*/


/*
    Fonts
*/

/*
    Lights
*/
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.7);
directionalLight.position.set(1,2,3);
scene.add(directionalLight);

/*
    Objects
*/
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16,16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
)
object1.position.x = -2;
const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16,16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
)
const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16,16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
)
object3.position.x = 2;

scene.add(object1, object2, object3);

/*
    Raycaster
*/
const raycaster = new THREE.Raycaster()


/*
    Create Scene
*/
let renderer;
let controls;
let mouse;
export const createScene = (el) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el
    })

    /*
    Mouse
    */
    mouse = new THREE.Vector2();

    el.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX / sizes.width * 2 - 1
        //mouse.y = -(event.clientY / sizes.height) * 2 + 1
        mouse.y = -((event.clientY / sizes.height) - (145 / sizes.height)) * 2 + 1 
        //145 - 684  = 539
        //0.2685 - 1.266 = .9975
        //console.log("x: " + mouse.x, " y: " + mouse.y )
    })

    el.addEventListener('click', () => {
        if(currentIntersect){
            console.log(currentIntersect)
        }
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
    Model
*/
const gltfLoader = new GLTFLoader();
let model = null;
gltfLoader.load(
    '../../models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        model = gltf;
        gltf.scene.position.y = - 1.2
        scene.add(gltf.scene)
    }
)

/*
    Update Function
*/
let currentIntersect = null;

const tick = () => {
    const time = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;
    

    raycaster.setFromCamera(mouse, camera)


    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);

    for(const object of objectsToTest){
        object.material.color.set('#ff0000')
    }

    for(const intersect of intersects){
        intersect.object.material.color.set('#0000ff')
    }

    if(intersects.length){
        if(currentIntersect === null){
            console.log("mouse enter")
        }
        currentIntersect = intersects[0];
    }
    else{
        if(currentIntersect !== null){
            console.log("mouse leave");
        }
        currentIntersect = null;
    }

    if(model){
        const modelIntersects = raycaster.intersectObject(model.scene);
        if(modelIntersects.length > 0){
            model.scene.scale.set(1.2, 1.2, 1.2)
            // model = null
            // model.scale.set(1.2, 1.2, 1.2)
        }
        else{
            model.scene.scale.set(1, 1, 1)
            // model.scale.set(1,1,1)
        }
    }


    renderer.render(scene,camera)
    controls.update();
    // window.requestAnimationFrame(tick) 

}

