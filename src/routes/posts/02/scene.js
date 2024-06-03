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
    width: Math.min(document.body.clientWidth * 0.95, 1400),
    height: Math.min(document.body.clientWidth * 0.95, 1400) * .5
}
const scene = new THREE.Scene();

const clock = new THREE.Clock();

// var stats = new Stats()
// stats.showPanel(0)
//document.body.appendChild(stats.dom)

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
// gui.style.display = 'none';

const parameters = {
    text: 'Parkers World',
    font: 'Righteous',
    wireframe: false,
    matcap: 1,
}

const textFolder = gui.addFolder("Text");

textFolder.add(parameters, 'text').onChange(()=>{
    scene.remove(textMesh)
    addTextToScene()
})

textFolder.add(parameters, 'font', ['Righteous', 'Chicle', 'Rubik Gemstone', 'Rampart', 'Barcode']).onChange(()=>{
    scene.remove(textMesh)
    addTextToScene()
})


const materialFolder = gui.addFolder("Material");

materialFolder.add(parameters, 'matcap', [0,1,2,3,4,5,6,7]).onChange((value) => {
    material.matcap = matcapTextures[value]
})

materialFolder.add(parameters, 'wireframe').onChange((value) => {
    material.wireframe = value
})

/*
    Textures
*/
const loadingManager = new THREE.LoadingManager();

loadingManager.onError = () => {
    console.error('error loading')
}


const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapTexture = textureLoader.load('/images/matcaps/1.png')
const matcapTextures = new Array(8);
matcapTextures[0] = textureLoader.load('/images/matcaps/matcap_1.png')
matcapTextures[1] = textureLoader.load('/images/matcaps/matcap_2.png')
matcapTextures[2] = textureLoader.load('/images/matcaps/matcap_3.png')
matcapTextures[3] = textureLoader.load('/images/matcaps/matcap_4.png')
matcapTextures[4] = textureLoader.load('/images/matcaps/matcap_5.png')
matcapTextures[5] = textureLoader.load('/images/matcaps/matcap_6.png')
matcapTextures[6] = textureLoader.load('/images/matcaps/matcap_7.png')
matcapTextures[7] = textureLoader.load('/images/matcaps/matcap_8.png')


const material = new THREE.MeshMatcapMaterial({matcap: matcapTextures[parameters.matcap]});

/*
    Fonts
*/
const fonts = {
    'Righteous' : '/fonts/typeface/Righteous_Regular.json',
    'Chicle' : '/fonts/typeface/Chicle_Regular.json',
    'Rubik Gemstone' : '/fonts/typeface/Rubik_Gemstones_Regular.json',
    'Rampart' : '/fonts/typeface/Rampart_One_Regular.json',
    'Barcode' : '/fonts/typeface/Libre_Barcode_39_Regular.json'
}


const fontLoader = new FontLoader();
let textGeometry;
let textMesh;

function addTextToScene(){
    fontLoader.load(
        fonts[parameters.font],
        (font) => 
        {
            textGeometry = new TextGeometry(
                parameters.text,
                {
                    font: font,
                    size: 0.5,
                    height: 0.2,
                    curveSegments: 6,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelSegments: 3
                }
            );
            textGeometry.computeBoundingBox()
            textGeometry.translate(
                - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
                - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
                - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
    
            )
    
            textMesh = new THREE.Mesh(textGeometry, material);
            scene.add(textMesh);
    
        }
    )
}
addTextToScene()


/*
    Objects
*/
const numberOfDonuts = 2000;
const donutsArr = new Array(numberOfDonuts);
const donutMinPos = -20;
const donutMaxPos = 20


function addDonutsToScene(){
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

    for(let i = 0; i < numberOfDonuts; i++){
        const donut = new THREE.Mesh(donutGeometry, material);

        donut.position.x = (Math.random() - 0.5) * 40 
        donut.position.y = (Math.random() - 0.5) * 40 
        donut.position.z = (Math.random() - 0.5) * 20
        
        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)

        donutsArr[i] = {
            mesh: donut,
            weight: Math.pow((1.5 - donut.scale.x), 1.8) * .5,
            xRot: Math.random() - 0.5,
            yRot: Math.random() - 0.5,
        };
        scene.add(donut)
    }
}
addDonutsToScene()


/*
    Create Scene
*/
let renderer;
let controls;
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

    alignGUIWithCanvas();

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

    //stats.begin()


    const time = clock.getDelta()
    donutsArr.forEach((donut) => {


        donut.mesh.position.y += (time * donut.weight)
        donut.mesh.rotation.x += (time * donut.xRot * donut.weight * 5)
        donut.mesh.rotation.y += (time * donut.yRot * donut.weight * 5)

        if(donut.mesh.position.y > donutMaxPos){
        donut.mesh.position.y = donutMinPos;
        }
    })

    renderer.render(scene,camera)
    controls.update();
    window.requestAnimationFrame(tick) 

    //stats.end()
}

