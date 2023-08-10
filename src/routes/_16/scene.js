import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'; 
import Stats from 'stats-js'
import { BoxGeometry } from 'three';
import CANNON from 'cannon';

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
camera.position.set(- 3, 3, 3)
scene.add(camera)

/*
    GUI
*/
const gui = new GUI()
gui.domElement.id = 'gui';
const parameters = {};
parameters.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3,
        }
    )
}
gui.add(parameters, "createSphere")
parameters.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3,
        }
    )
}
gui.add(parameters, "createBox")

parameters.reset = () => {
    for(const object of objectsToUpdate){
        object.body.removeEventListener('collide', playHitSound);
        world.removeBody(object.body);

        scene.remove(object.mesh);
    }

    objectsToUpdate.splice(0, objectsToUpdate.length);
}
gui.add(parameters, "reset");

/*
    Sounds
*/
const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if(impactStrength > 1.5){
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play();
    }
    }
/*
    Textures
*/
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    'images/environmentMaps/0/px.png',
    '/images/environmentMaps/0/nx.png',
    '/images/environmentMaps/0/py.png',
    '/images/environmentMaps/0/ny.png',
    '/images/environmentMaps/0/pz.png',
    '/images/environmentMaps/0/nz.png'
])


/*
    Physics
*/
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

const defaultMaterial = new CANNON.Material('default');


const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;



const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI / 2
)
world.addBody(floorBody);

/*
    Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/*
    Objects
*/


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)


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
    Utils
*/
//Sphere
const objectsToUpdate = []
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createSphere = (radius, position) => {
    //Threejs mesh
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    );
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // cannon js body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position);
    world.addBody(body)

    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}


//Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createBox = (width, height, depth, position) => {
    
    //Threejs mesh
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    );
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // cannon js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.addBody(body)

    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

/*
    Update Function
*/
let oldElapesedTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapesedTime;
    oldElapesedTime = elapsedTime;


    world.step(1 / 60, deltaTime, 3);

    for(const object of objectsToUpdate){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    controls.update();
    renderer.render(scene,camera)
    //window.requestAnimationFrame(tick) 

}

