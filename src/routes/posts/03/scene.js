import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'; 
import Stats from 'stats-js'


/*
    Initial Setup
*/
const sizes = {
    width: Math.min(document.body.clientWidth, 1400),
    height: Math.min(document.body.clientWidth, 1400) * .5
}
const scene = new THREE.Scene();

const clock = new THREE.Clock();

/*
    Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera)

/*
    GUI
*/
const gui = new GUI()
gui.domElement.id = 'gui';
const parameters = {
    useHelpers: false,
    ambientLight: true,
    useShadows: true,
    useFog: true,
}

/*
    Fog
*/
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;
//scene.fog = null;
function updateFog(){
    if(parameters.useFog == true){
        scene.fog = fog;
    }
    else{
        scene.fog = null;
    }
}
updateFog();
gui.add(parameters, 'useFog').onChange(updateFog).name("Show Fog")

/*
    Textures
*/
const loadingManager = new THREE.LoadingManager();

loadingManager.onError = () => {
    console.error('error loading')
}


const textureLoader = new THREE.TextureLoader(loadingManager);

const doorColorTexture = textureLoader.load('/images/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/images/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/images/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/images/door/height.png')
const doorNormalTexture = textureLoader.load('/images/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/images/door/metallic.jpg')
const doorRoughnessTexture = textureLoader.load('/images/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/images/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/images/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/images/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/images/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/images/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/images/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/images/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/images/grass/roughness.jpg')

grassColorTexture.repeat.set(8,8);
grassAmbientOcclusionTexture.repeat.set(8,8);
grassNormalTexture.repeat.set(8,8);
grassRoughnessTexture.repeat.set(8,8);

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/*
    Fonts
*/



/*
    Objects
*/
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
plane.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2))
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = 0;
scene.add(plane)

//House
const house = new THREE.Group();
scene.add(house)

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 2.5 / 2;
house.add(walls);

//Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
)
roof.position.y = 2.5 + (1 / 2)
roof.rotation.y = Math.PI * .25;
house.add(roof);

//Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture

    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door)

//Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

//Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for(let i = 0; i < 50; i++){
   const angle = Math.random() * Math.PI * 2;
   const radius = 3 + Math.random() * 6;
   const x = Math.sin(angle) * radius;
   const z = Math.cos(angle) * radius;
   
   const grave = new THREE.Mesh(graveGeometry, graveMaterial);
   grave.position.set(x, 0.3, z);
   grave.rotation.y = (Math.random() - 0.5) * 0.4;
   grave.rotation.z = (Math.random() - 0.5) * 0.4;
   grave.castShadow = true;
   graves.add(grave);
}

/*
    Lights
*/
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
scene.add(ambientLight)
function turnOnAmbientLight(){
    if(parameters.ambientLight == true){
        ambientLight.color.set('#b9d5ff')
    }
    else{
        ambientLight.color.set('#000000')
    }
}
gui.add(parameters, "ambientLight").onChange(turnOnAmbientLight).name("Ambient Light")

const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
directionalLight.position.set(4,5,-2);
scene.add(directionalLight)

//Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

//Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1);

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2);

const ghost3 = new THREE.PointLight('#fff00', 2, 3)
scene.add(ghost3);

//Helpers

const doorLightHelper = new THREE.PointLightHelper(doorLight, 0.1);
const ghost1LightHelper = new THREE.PointLightHelper(ghost1, 0.1);
const ghost2LightHelper = new THREE.PointLightHelper(ghost2, 0.1);
const ghost3LightHelper = new THREE.PointLightHelper(ghost3, 0.1);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);


function addHelpers(){
    if(parameters.useHelpers == true){
        scene.add(doorLightHelper);
        scene.add(ghost1LightHelper);
        scene.add(ghost2LightHelper);
        scene.add(ghost3LightHelper);
        scene.add(directionalLightHelper);
    }
    else{
        scene.remove(doorLightHelper);
        scene.remove(ghost1LightHelper);
        scene.remove(ghost2LightHelper);
        scene.remove(ghost3LightHelper);
        scene.remove(directionalLightHelper);
    }
}

addHelpers();

gui.add(parameters, 'useHelpers').onChange(addHelpers).name("Light Helpers")

/*
    Create Scene
*/
let renderer;
let controls;

function updataShadows(){
    renderer.shadowMap.enabled = parameters.useShadows;
    renderer.shadowMap.enabled = parameters.useShadows;
    directionalLight.castShadow = parameters.useShadows;
    doorLight.castShadow = parameters.useShadows;
    ghost1.castShadow = parameters.useShadows;
    ghost2.castShadow = parameters.useShadows;
    ghost3.castShadow = parameters.useShadows;
}

gui.add(parameters, "useShadows").onChange(updataShadows).name("Show Shadows")

export const createScene = (el, onLoaded) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el
    })

    loadingManager.onLoad = () => {
        onLoaded()
    }

    const alignGUIWithCanvas = () => {
        const canvasRect = el.getBoundingClientRect();
        const guiRect = gui.domElement.getBoundingClientRect();
        gui.domElement.style.position = 'absolute';
        gui.domElement.style.top = `220px`;
        gui.domElement.style.left = `${canvasRect.right - guiRect.width}px`;
        console.log("testing gui align");
        console.log(guiRect)
    }

    controls = new OrbitControls(camera, el)
    controls.enableDamping = true;

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setClearColor('#262837')

    alignGUIWithCanvas();

    //Shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    updataShadows()
    

    walls.castShadow = true;
    bush1.castShadow = true;
    bush2.castShadow = true;
    bush3.castShadow = true;
    bush4.castShadow = true;

    plane.receiveShadow = true;

    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;

    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.mapSize.far = 7;

    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.mapSize.far = 7;

    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.mapSize.far = 7;

    window.addEventListener('resize', () => {
        sizes.width = Math.min(document.body.clientWidth, 1400),
        sizes.height = Math.min(document.body.clientWidth, 1400) * .5 
    
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix
    
        renderer.setSize(sizes.width, sizes.height)
        alignGUIWithCanvas();
    })
    
    tick()
}
/*
    Update Function
*/
const tick = () => {

    const elapsedTime = clock.getElapsedTime();

    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = - elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = - elapsedTime * 0.18;
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 5) * (Math.sin(elapsedTime * 2));



    renderer.render(scene,camera)
    controls.update();
    window.requestAnimationFrame(tick) 

}

