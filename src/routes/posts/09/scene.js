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

    const alignGUIWithCanvas = () => {
        const canvasRect = el.getBoundingClientRect();
        const guiRect = gui.domElement.getBoundingClientRect();
        gui.domElement.style.position = 'absolute';
        gui.domElement.style.top = `222px`;
        gui.domElement.style.left = `${canvasRect.right - guiRect.width - 2}px`;
        console.log("testing gui align");
        console.log(guiRect)
    };
    alignGUIWithCanvas();

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

    // const dragonMesh = new PW.OBJMesh({
    //     filePath: "../models/Dragon/DragonShadeSmooth.obj",
    //     wireframe: false
    // });
    // const dragonTransform = new PW.Transform();
    // dragonTransform.scale = [10,10,10];
    // dragonTransform.position[1] = -1;
    // quat.rotateX(dragonTransform.rotation, dragonTransform.rotation, Math.PI / 2);
    // await dragonMesh.loaded();

    const bunnyMesh = new PW.OBJMesh({
        filePath: "../models/StanfordBunny/StanfordBunnyShadeSmooth.obj",
        wireframe: false
    });
    const bunnyTransform = new PW.Transform();
    bunnyTransform.position = [0,-1,0];
    bunnyTransform.scale = [8,8,8];
    quat.rotateY(bunnyTransform.rotation, bunnyTransform.rotation, Math.PI );
    await bunnyMesh.loaded();

    onLoaded();
    
    const obj = new PW.Renderable({
        mesh: bunnyMesh,
        material: new PW.BasicMaterial({color: [1, 0, 0, 1]})
    });
    obj.transform = bunnyTransform;
    scene.add(obj);


    gui.addColor(parameters, 'color').onChange((value) => {
        let r = (value & 0xff0000) >> 16;
        let g = (value & 0x00ff00) >> 8;
        let b = (value & 0x0000ff);
        let color = [r/255, g/255, b/255, 1];
        obj.material.color = color;
        obj.material.updateMaterialBuffers();

    })

    function frame() {

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}