import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import * as TWEEN from '@tweenjs/tween.js'
import { createNoise2D } from 'simplex-noise'
// import { bannerLoaded } from './stores.js'

/*
    Initial Setup
*/
const sizes = {
	width: document.body.clientWidth,
    height: 200
}

const scene = new THREE.Scene();
const clock = new THREE.Clock();
let elapsedTime = 0;

/*
    Loading Manager
*/

const loadingManager = new THREE.LoadingManager();

/*
    Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 1;
scene.add(camera)

/*
    Textures
*/
const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapTexture = textureLoader.load('/images/matcaps/matcap_2.png')
const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture});

/*
    Fonts
*/
const font = '/fonts/typeface/Righteous_Regular.json';
const fontLoader = new FontLoader(loadingManager);
let textGeometry;
let textMesh;

const moveScale = .1;
let hover = true;
let sizeScale = ((.0006 - .0014) / 1900) * document.body.clientWidth + .0014
const title = "Parkers World"
const letters = [...title];
const letterMeshes = [];
let bannerTween = {noiseScale: 1, nearScale: 0};
let tweenForward = new TWEEN.Tween(bannerTween).to({noiseScale: 0, nearScale: 0.3}, 200).easing(TWEEN.Easing.Back.InOut);
let tweenBack = new TWEEN.Tween(bannerTween).to({noiseScale: 1, nearScale: 0}, 3000).easing(TWEEN.Easing.Quintic.Out);
function addLettersToScene(){
   let letterGeometry;
   let letterMesh;
   fontLoader.load(
    font,
    (font) => {
        textGeometry = new TextGeometry(
            title,
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
        textGeometry.computeBoundingBox();
        textGeometry.translate(
            - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
    
        )
        textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.scale.set(document.body.clientWidth * sizeScale ,document.body.clientWidth * sizeScale, document.body.clientWidth * sizeScale);
        // scene.add(textMesh);

        const fullBoundingBox = textGeometry.boundingBox.max;
        let letterOffset = 0;
        letters.forEach(letter => {
            if(letter === " "){
                letterOffset += .25;
                return;
            }
            letterGeometry = new TextGeometry(
                letter,
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
            )
            letterGeometry.computeBoundingBox();
            letterMesh = new THREE.Mesh(letterGeometry, material);
            letterMeshes.push(letterMesh);
            letterGeometry.translate(
                - (fullBoundingBox.x - 0.02),
                - (fullBoundingBox.y - 0.02),
                - (fullBoundingBox.z - 0.03),
    
            );
            letterGeometry.translate(
                letterOffset,
                0,
                0
            );
            letterMesh.scale.set(document.body.clientWidth * sizeScale ,document.body.clientWidth * sizeScale, document.body.clientWidth * sizeScale)
            scene.add(letterMesh);
            letterOffset += letterGeometry.boundingBox.max.x - letterGeometry.boundingBox.min.x;
        });
        objectsToCheck = scene.children.filter(child => !(child == sphere || child == particleSystem));
    }
   );
}
addLettersToScene()

/*
    Particle System
*/
const createParticleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );

    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,192,32,1)');
    gradient.addColorStop(1, 'rgba(255,192,32,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
    color: 0xFF9900,
    // color: 0xFFFFFF,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    // map: createParticleTexture(),
    blending: THREE.AdditiveBlending
});

const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const velocities = [];
const lifetimes = [];
const particlesToAdd = [];
const liveParticles = [];
const alphas = [];
const lifetime = 1;
const velocityScale = 0.4;

for(let i = 0; i < particleCount; i++) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;

    velocities.push(
        new THREE.Vector3(
            (Math.random() - 0.5) * velocityScale, 
            1 * velocityScale, 
            (Math.random() - 0.5) * velocityScale)
    );
    lifetimes.push(lifetime);
    particlesToAdd.push(i);
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
// scene.add(particleSystem);

/*
    Raycaster
*/

//Sphere for testing
// const sphereGeometry = new THREE.SphereGeometry(.03, 32, 32);
// const sphereMaterial = new THREE.MeshBasicMaterial();
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphere);

let objectsToCheck = {};
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const intersectPoint = new THREE.Vector3();
let isIntersecting = false;
let canvasBounds;
window.addEventListener('mousemove', (event) => {
    // console.log("mouse move")
    if(canvasBounds !== null && objectsToCheck !== null){
        // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
        mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        if(raycaster !== null && objectsToCheck !== null){
            const intersects = raycaster.intersectObjects(objectsToCheck);
            if(intersects !== null && intersects.length > 0){
                isIntersecting = true;
                // if(particleSystem.parent !== scene){
                //     scene.add(particleSystem);
                // }
                intersectPoint.copy(intersects[0].point);
                //sphere.position.copy(intersects[0].point);
                // particleSystem.position.copy(intersects[0].point);
            }
            else{
                isIntersecting = false;
                // if(particleSystem.parent === scene){
                //     scene.remove(particleSystem);
                // }
            }
        }
    }
}, false)

/*
    Create Scene
*/
let renderer;
let controls;
export const createScene = (el, onLoaded) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el
    })

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    canvasBounds = renderer.domElement.getBoundingClientRect();

    loadingManager.onLoad = () => {
        onLoaded();
    }

    window.addEventListener('resize', () => {
        sizes.width = document.body.clientWidth,
        sizes.height = 200
        sizeScale = ((.0006 - .0014) / 1900) * document.body.clientWidth + .0014
        textMesh.scale.set(document.body.clientWidth * sizeScale ,document.body.clientWidth * sizeScale, document.body.clientWidth * sizeScale);
    
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
    
        renderer.setSize(sizes.width, sizes.height)
		
    });

    el.addEventListener('click', function() {
        window.location.href = '/';
    });

    el.addEventListener('mouseover', () => {
        tweenBack.stop();
        tweenForward.start();
        hover = false;
    });
    el.addEventListener('mouseout', () => {
        tweenForward.stop();
        tweenBack.start();
        hover = true;
    })

    tick()
}
/*
    Update Function
*/
const noiseGenerator = createNoise2D();


console.log(noiseGenerator(10, 0))
function updateLetterPostion(t){
    let i = 1;
    const waveSpeed = .6;
    const waveLength = .1
    letterMeshes.forEach((letterMesh) => {
        // const value = ((t * waveSpeed) + i * waveLength) - (Math.floor((t * waveSpeed) + i * waveLength));
        // const n = noise.perlin2( value , 0) * 0.5;
        const n = noiseGenerator((t * .1) + (i * .1), 0) * 0.1 * bannerTween.noiseScale;
        letterMesh.position.set(0, n , bannerTween.nearScale)
        letterMesh.rotation.x = Math.PI * n
        letterMesh.rotation.y = Math.PI * n * .1
        i++;
    })
}
// updateLetterPostion()

const tick = () => {

    const deltaTime = clock.getDelta();
    elapsedTime += deltaTime;
    TWEEN.update();
    if(textMesh && hover && false){
        elapsedTime += deltaTime;
        //textMesh.rotation.x = Math.sin(elapsedTime);
        textMesh.rotation.x = -.3
        textMesh.position.y = Math.sin(elapsedTime) * .1 - .1 ;
    }

    if(letterMeshes.length > 1){
        updateLetterPostion(elapsedTime)
    }



    // for(let i = 0; i < particleCount; i++){
    //     lifetimes[i] -= deltaTime;
    //     if(lifetimes[i] <= 0) {
    //         particleSystem.geometry.attributes.position.setXYZ(i, 0, 0, 0);
    //         lifetimes[i] = lifetime;
    //     }
    //     else {
    //         const v = velocities[i];
    //         particleSystem.geometry.attributes.position.setXYZ(
    //             i,
    //             particleSystem.geometry.attributes.position.getX(i) + v.x * deltaTime,
    //             particleSystem.geometry.attributes.position.getY(i) + v.y * deltaTime,
    //             particleSystem.geometry.attributes.position.getZ(i) + v.z * deltaTime
    //         );
    //     }
    // }

    if(isIntersecting){
        for(let i = 0; i < 5; i++){
            let currentParticle = null;
            if(particlesToAdd.length !== 0){
                currentParticle = particlesToAdd.shift();
            }
            //console.log(currentParticle)
            if(currentParticle !== null){
                liveParticles.push(currentParticle);
                particleSystem.geometry.attributes.position.setXYZ(currentParticle, intersectPoint.x, intersectPoint.y, intersectPoint.z);
            }
        }
    }

    const particlesToRemove = [];
    for(let i = 0; i < liveParticles.length; i++){
        const currentParticle = liveParticles[i];
        lifetimes[currentParticle] -= deltaTime;
        const v = velocities[currentParticle];

        if(lifetimes[currentParticle] <= 0){
            particleSystem.geometry.attributes.position.setXYZ(currentParticle, 0, -10, 0);
            lifetimes[currentParticle] = lifetime;
            particlesToRemove.push(i);
        }
        else{
                particleSystem.geometry.attributes.position.setXYZ(
                    currentParticle,
                    particleSystem.geometry.attributes.position.getX(currentParticle) + v.x * deltaTime,
                    particleSystem.geometry.attributes.position.getY(currentParticle) + v.y * deltaTime,
                    particleSystem.geometry.attributes.position.getZ(currentParticle) + v.z * deltaTime
                )
        }
    };
    for(let i = particlesToRemove.length - 1; i >= 0; i--){
        const toRemove = particlesToRemove[i];
        const currentParticle = liveParticles[toRemove];
        liveParticles.splice(toRemove, 1);
        particlesToAdd.push(currentParticle);

    }



    particleSystem.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene,camera);
    window.requestAnimationFrame(tick);
	
	

}

