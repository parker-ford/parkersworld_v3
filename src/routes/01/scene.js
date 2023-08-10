import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'; 


/*
    Initial Setup
*/
const sizes = {
    width: Math.min(document.body.clientWidth, 1400),
    height: Math.min(document.body.clientWidth, 1400) * .5
}
const scene = new THREE.Scene();
const rotationClock = new THREE.Clock();
let rotationTime = 0;
const positionClock = new THREE.Clock();
let positionTime = 0;

/*
    Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4;
scene.add(camera)


//
/*
    Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight);


/*
    Textures
*/
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


/*
    Objects
*/
let geometry = new THREE.BoxGeometry(1,1,1);
let material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


/*
    GUI
*/
const gui = new GUI()
gui.domElement.id = 'gui';

const parameters = {
    color: 0xff0000,
    animateRotation: true,
    animatePosition: false,
    material: 'Basic',
    wireframe: false,
    x: 0,
    y: 0,
    z: 0,
    shininess: 0,
}

function updateGeometry() {
    mesh.geometry = geometry;
    mesh.geometry.needsUpdate = true;
}

const geometryFolder = gui.addFolder('Geometry')

geometryFolder.add({geometry: 'Box'}, 'geometry', ['Box', 'Sphere', 'Torus']).onChange((value) => {
    if (value == 'Box'){
        console.log("BOX");
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    else if( value == 'Sphere'){
        console.log("SPHERE");
        geometry = new THREE.SphereGeometry(1, 32, 32);
    }
    else if( value == 'Torus'){
        console.log("Torus");
        geometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
    }

    updateGeometry();
})

const materialFolder = gui.addFolder("Material");

function updateMaterialGUI() {
    colorController.disable();
    shininessController.disable();

    if(parameters.material === 'Basic' || parameters.material === 'Phong' || parameters.material === 'Lambert' || parameters.material === 'Toon' || parameters.material === 'Standard'){
        colorController.enable();
    }
    if(parameters.material == 'Phong' || parameters.material === 'Standard'){
        shininessController.enable()
    }
}

function updateMaterial() {
    if(parameters.material === 'Basic' || parameters.material === 'Phong' || parameters.material === 'Lambert' || parameters.material === 'Toon')
        mesh.material.color.set(parameters.color)

    if(parameters.material == 'Phong' || parameters.material === 'Standard'){
        mesh.material.shininess = parameters.shininess;
    }

    mesh.material.wireframe = parameters.wireframe
}


materialFolder.add(parameters, 'material', ['Basic', 'Phong', "Lambert", "Normal", "Depth", "Toon", "Standard"]).onChange((value) => {
    if(value === "Basic"){
        mesh.material = new THREE.MeshBasicMaterial();
    }
    else if(value === "Phong"){
        mesh.material = new THREE.MeshPhongMaterial();
    }
    else if(value === "Lambert"){
        mesh.material = new THREE.MeshLambertMaterial();
    }
    else if(value === "Normal"){
        mesh.material = new THREE.MeshNormalMaterial();
    }
    else if(value === "Depth"){
        mesh.material = new THREE.MeshDepthMaterial();
    }
    else if(value === "Toon"){
        mesh.material = new THREE.MeshToonMaterial();
    }
    else if(value === "Standard"){
        mesh.material = new THREE.MeshStandardMaterial();
        mesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2))
        mesh.material.map = colorTexture;
        mesh.material.aoMap = ambientOcclusion;
        mesh.material.aoMapIntensity = 1;
        mesh.material.displacementMap = heightTexture;
        mesh.material.displacementScale = 0.1;
        mesh.material.metalnessMap = metallicTexture;
        mesh.material.roughnessMap = roughnessTexture;
        mesh.material.normalMap = normalTexture;
        mesh.material.alphaMap = alphaTexture;
        mesh.material.transparent = true;
    }

    updateMaterial()
    updateMaterialGUI()
})

const colorController  = materialFolder.addColor(parameters, 'color').onChange((value) => {
    mesh.material.color.set(value);
})

const wireframeController = materialFolder.add(parameters, 'wireframe').onChange((value) => {
    mesh.material.wireframe = value
})

const shininessController = materialFolder.add(parameters, 'shininess').onChange((value) => {
    mesh.material.shininess = value;
}).min(0).max(500)

updateMaterialGUI()

const positionFolder = gui.addFolder("Position")

positionFolder.add(parameters, 'x').min(-5).max(5).onChange(() => {mesh.position.x = parameters.x})
positionFolder.add(parameters, 'y').min(-5).max(5).onChange(() => {mesh.position.y = parameters.y})
positionFolder.add(parameters, 'z').min(-5).max(5).onChange(() => {mesh.position.z = parameters.z})

positionFolder.add(parameters, 'animateRotation').onChange((value) => {
    if(value){
        rotationClock.start();
        rotationClock.elapsedTime = rotationTime;
    }
    else{
        rotationTime = rotationClock.getElapsedTime();
        rotationClock.stop();
    }
})
positionFolder.add(parameters, 'animatePosition').onChange((value) => {
    if(value){
        positionClock.start();
        positionClock.elapsedTime = positionTime;
    }
    else{
        positionTime = positionClock.getElapsedTime();
        positionClock.stop();

        mesh.position.x = parameters.x;
        mesh.position.y = parameters.y;
        mesh.position.z = parameters.z;
    }
})


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

    if(parameters.animateRotation){
        const elapsedTime = rotationClock.getElapsedTime();
        //console.log(elapsedTime)
        mesh.rotation.y = elapsedTime + Math.sin(elapsedTime);
        mesh.rotation.x = elapsedTime + Math.cos(elapsedTime);
    }

    if(parameters.animatePosition){
        const elapsedTime = positionClock.getElapsedTime()
        mesh.position.y = Math.sin(elapsedTime);
        mesh.position.x = Math.cos(elapsedTime);
        mesh.position.z = Math.cos(elapsedTime * .8) * 2
    }



    renderer.render(scene,camera)
    controls.update();
    window.requestAnimationFrame(tick) 
}

