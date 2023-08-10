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

const useShadows = false;

/*
    Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.y = 6;
camera.position.z = 6;
camera.position.x = 6;
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
const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 6
parameters.branches = 5
parameters.spin = 1.5
parameters.randomness = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

//Stars
const starsGeometry = new THREE.BufferGeometry();
const count = 8000;
const starPositions = new Float32Array(count * 3);
const starColors = new Float32Array(count * 3);
for(let i = 0; i < count * 3; i++){
    const angle = Math.random() * Math.PI * 2;
    const radius = 100 + Math.random() * 100;
    starPositions[i] = Math.sin(angle) * radius;
    starColors[i] = 1;
}

starsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(starPositions, 3)
)
starsGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(starColors, 3)
)
const starsMaterial = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    color: '#ffffff',
})
starsMaterial.transparent = true;
starsMaterial.alphaMap = particleTexture;
// starsMaterial.depthTest = false;
// starsMaterial.alphaTest = 0.001;
starsMaterial.depthWrite = false;
starsMaterial.blending = THREE.AdditiveBlending;
starsMaterial.vertexColors = true;

const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)



let geometry = null;
let material = null;
let points = null;

//Galaxy
const generateGalaxy = () => {
    if(points != null){
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }


    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++){
        const i3 = i*3;

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * 2 * Math.PI;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ


        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);
        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    points = new THREE.Points(geometry, material);
    scene.add(points)
}

generateGalaxy();
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)


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

    const time = clock.getDelta();

    renderer.render(scene,camera)
    controls.update();
    window.requestAnimationFrame(tick) 

}

