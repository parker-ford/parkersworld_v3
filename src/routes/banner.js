import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import * as TWEEN from '@tweenjs/tween.js'

/*
    Initial Setup
*/
const sizes = {
	width: document.body.clientWidth,
    height: 200
}

console.log(sizes.width)
const scene = new THREE.Scene();
const clock = new THREE.Clock();
let elapsedTime = 0;

/*
    Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 1;
scene.add(camera)

/*
    Textures
*/
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/images/matcaps/matcap_2.png')
const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture});

/*
    Fonts
*/
const font = '/fonts/typeface/Righteous_Regular.json';

const fontLoader = new FontLoader();
let textGeometry;
let textMesh;
let tweenForward;
let tweenBack;
const moveScale = .1;
let hover = true;
//const sizeScale = .0014;
let sizeScale = ((.0006 - .0014) / 1900) * document.body.clientWidth + .0014

function addTextToScene(){
    fontLoader.load(
        font,
        (font) => 
        {
            textGeometry = new TextGeometry(
                "Parkers World",
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
            textMesh.scale.set(document.body.clientWidth * sizeScale ,document.body.clientWidth * sizeScale, document.body.clientWidth * sizeScale);
    
            const startPos = textMesh.position.y;
            tweenForward = new TWEEN.Tween({x: 0}).to({x: 1}, 200).easing(TWEEN.Easing.Quadratic.Out).onUpdate((coords) => {
                textMesh.position.z = startPos + (coords.x * moveScale);
            });
            tweenBack = new TWEEN.Tween({ x: 0}).to({x: -1}, 200).onUpdate((coords) => {
                textMesh.position.z = startPos + (coords.x * moveScale);
            });
        }
    )


}
addTextToScene()


/*
    Create Scene
*/
let renderer;
let controls;
export const createScene = (el) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

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
const tick = () => {

    const time = clock.getDelta();
    TWEEN.update();
    if(textMesh && hover){
        elapsedTime += time;
        //textMesh.rotation.x = Math.sin(elapsedTime);
        textMesh.rotation.x = -.3
        textMesh.position.y = Math.sin(elapsedTime) * .1 - .1 ;
    }
    renderer.render(scene,camera);
    window.requestAnimationFrame(tick);
	
	

}

