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
let tweenForward;
let tweenBack;
const moveScale = .1;
let hover = true;
let sizeScale = ((.0006 - .0014) / 1900) * document.body.clientWidth + .0014
const title = "Parkers World"
const letters = [...title];
const letterMeshes = [];
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
    }
   );
}
addLettersToScene()

/*
    Create Scene
*/
let renderer;
let controls;
export const createScene = (el, onLoaded) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

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
        tweenForward.start();
        hover = false;
    });
    el.addEventListener('mouseout', () => {
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
        const n = noiseGenerator((t * .1) + (i * .1), 0) * 0.1;
        letterMesh.position.set(0, n ,0)
        letterMesh.rotation.x = Math.PI * n
        letterMesh.rotation.y = Math.PI * n * .1
        i++;
    })
}
// updateLetterPostion()

const tick = () => {

    const time = clock.getDelta();
    elapsedTime += time;
    TWEEN.update();
    if(textMesh && hover && false){
        elapsedTime += time;
        //textMesh.rotation.x = Math.sin(elapsedTime);
        textMesh.rotation.x = -.3
        textMesh.position.y = Math.sin(elapsedTime) * .1 - .1 ;
    }

    if(letterMeshes.length > 1){
        updateLetterPostion(elapsedTime)
    }

    renderer.render(scene,camera);
    window.requestAnimationFrame(tick);
	
	

}

