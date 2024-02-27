import * as PW from '$lib/ParkersRenderer'
import { quat } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {
    

    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

    // const gui = new GUI()
    // gui.domElement.id = 'gui';

    // const parameters= {
    //     color: 0xff0000,
    // }

    // const alignGUIWithCanvas = () => {
    //     const canvasRect = el.getBoundingClientRect();
    //     const guiRect = gui.domElement.getBoundingClientRect();
    //     gui.domElement.style.position = 'absolute';
    //     gui.domElement.style.top = `222px`;
    //     gui.domElement.style.left = `${canvasRect.right - guiRect.width - 2}px`;
    //     console.log("testing gui align");
    //     console.log(guiRect)
    // };
    // alignGUIWithCanvas();

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
        // mesh: bunnyMesh,
        mesh: new PW.SphereMesh({resolution: 32}),
        material: new PW.BasicLitMaterial({color: [1,1,1,1]})
    });
    // obj.transform = bunnyTransform;
    scene.add(obj);

    const plane = new PW.Renderable({
        mesh: new PW.PlaneMesh({width: 10, height: 10}),
        material: new PW.BasicLitMaterial({color: [1,1,1,1]})
    });
    plane.transform.position = [0,-0.5,0];
    plane.transform.scale = [10,10,10];
    scene.add(plane);
    quat.rotateX(plane.transform.rotation, plane.transform.rotation, -Math.PI / 2);

    const light = new PW.DirectionalLight({color: [0,0,1,1]});
    light.intensity = 1.0;
    light.transform.position = [3,0,0];
    scene.add(light);
    
    const light2 = new PW.DirectionalLight({color: [1,0,0,1]});
    light2.intensity = 1.0;
    light2.transform.position = [-3,0,0];
    scene.add(light2);

    const light3 = new PW.DirectionalLight({color: [0,1,0,1]});
    light3.intensity = 1.0;
    light3.transform.position = [0,3,0];
    scene.add(light3);

    const pointLight = new PW.PointLight({color: [1,1,1,1]});
    pointLight.transform.position = [1,1,0];
    scene.add(pointLight);

    // gui.addColor(parameters, 'color').onChange((value) => {
    //     let r = (value & 0xff0000) >> 16;
    //     let g = (value & 0x00ff00) >> 8;
    //     let b = (value & 0x0000ff);
    //     let color = [r/255, g/255, b/255, 1];
    //     obj.material.color = color;
    //     obj.material.updateMaterialBuffers();

    // })

    function frame() {

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}