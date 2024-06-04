import * as PW from '$lib/ParkersRenderer'
import { quat } from 'gl-matrix';
import GUI from 'lil-gui'; 

export const createScene = async (el, onLoaded) => {

    const fallbackVideo = document.getElementById('fallback-video');

    el.width = Math.min(document.body.clientWidth * 0.95, 1400);
    el.height = Math.min(document.body.clientWidth *   0.95, 1400) * .5;

    const gui = new GUI()
    gui.domElement.id = 'gui';

    const parameters= {
        wireframe: false,
        model: 'bunny'
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
        fallbackVideo.style.display = 'block';
        fallbackVideo.width = el.width;
        fallbackVideo.height = el.height;
        el.style.display = 'none';
        gui.domElement.style.display = 'none';

        onLoaded();
        const modal = document.getElementById('webgpu__modal');
        if (localStorage.getItem("hideWebGPUModal") !== "true") {
            modal.showModal();
        }
        return;
    }

    const scene = new PW.Scene();

    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });

    scene.add(camera);
    camera.transform.position[2] = -5;

    const dragonMesh = new PW.OBJMesh({
        filePath: "../models/Dragon/DragonShadeSmooth.obj",
        wireframe: false
    });
    const dragonTransform = new PW.Transform();
    dragonTransform.scale = [10,10,10];
    dragonTransform.position[1] = -1;
    quat.rotateX(dragonTransform.rotation, dragonTransform.rotation, Math.PI / 2);

    const armadilloMesh = new PW.OBJMesh({
        filePath: "../models/Armadillo/Armadillo.obj",
        wireframe: false
    });
    const armadilloTransform = new PW.Transform();
    armadilloTransform.scale = [0.01,0.01,0.01];

    const bunnyMesh = new PW.OBJMesh({
        filePath: "../models/StanfordBunny/StanfordBunnyShadeSmooth.obj",
        wireframe: false
    });
    const bunnyTransform = new PW.Transform();
    bunnyTransform.position = [0,-1,0];
    bunnyTransform.scale = [8,8,8];
    quat.rotateY(bunnyTransform.rotation, bunnyTransform.rotation, Math.PI );


    await dragonMesh.loaded();
    await armadilloMesh.loaded();
    await bunnyMesh.loaded();
    onLoaded();

    const obj = new PW.Renderable({
        mesh: bunnyMesh,
        material: new PW.NormalMaterial({color: [1, 0, 0, 1]})
    });
    obj.transform = bunnyTransform;
    
    scene.add(obj)

    let lastFrameTime = performance.now();
    let fps = 0;

    gui.add(parameters, 'model', ['bunny', 'armadillo', 'dragon']).onChange((value) => {
        if(value === 'bunny'){
            obj.mesh = bunnyMesh;
            obj.transform = bunnyTransform;
        }
        if(value === 'armadillo'){
            obj.mesh = armadilloMesh;
            obj.transform = armadilloTransform;
        }
        if(value === 'dragon'){
            obj.mesh = dragonMesh;
            obj.transform = dragonTransform;
        }
    })

    gui.add(parameters, 'wireframe').onChange((value) => {
        obj.changeWireframe(value);
    });

    function frame() {

        // const currentTime = performance.now();
        // const deltaTime = currentTime - lastFrameTime;
        // lastFrameTime = currentTime;
        // fps = 1 / (deltaTime / 1000);

        //quat.rotateY(obj.transform.rotation, obj.transform.rotation, PW.Time.deltaTime );

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}