import * as PW from '$lib/ParkersRenderer'
import { quat } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {
    

    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

    const gui = new GUI()
    gui.domElement.id = 'gui';

    const parameters= {
        color: 0xff0000,
    }

    const renderer = new PW.Renderer(el);
    if (! await renderer.init()) {
        console.log("renderer initialization failed");
    }

    const scene = new PW.Scene();

    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });

    scene.add(camera);
    camera.transform.position[2] = -9;

    const dragonMesh = new PW.OBJMesh({
        filePath: "../models/Dragon/DragonShadeSmooth.obj",
        wireframe: false
    });
    const dragonTransform = new PW.Transform();
    dragonTransform.scale = [10,10,10];
    dragonTransform.position[1] = -1;
    quat.rotateX(dragonTransform.rotation, dragonTransform.rotation, Math.PI / 2);

    await dragonMesh.loaded();
    onLoaded();
    
    const sphere = new PW.Renderable({
        mesh: dragonMesh,
        material: new PW.GoochMaterial({
            color: [1, 0, 0],
            wireframe: false
        }),
    })
    scene.add(sphere);
    sphere.transform = dragonTransform;

    gui.addColor(parameters, 'color').onChange((value) => {
        let r = (value & 0xff0000) >> 16;
        let g = (value & 0x00ff00) >> 8;
        let b = (value & 0x0000ff);
        let color = [r/255, g/255, b/255];
        sphere.material.color = color;
        sphere.material.updateMaterialBuffers();

    })

    function frame() {

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}