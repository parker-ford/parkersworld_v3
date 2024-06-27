import * as PW from '$lib/ParkersRenderer'
import { quat } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {

    const fallbackVideo = document.getElementById('fallback-video');

   

    //Initial setup
    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

    const renderer = new PW.Renderer(el);
    if (! await renderer.init()) {
        console.log("renderer initialization failed");
        fallbackVideo.style.display = 'block';
        fallbackVideo.width = el.width;
        fallbackVideo.height = el.height;
        el.style.display = 'none';
        onLoaded();
        return;
    }

    renderer.viewLightHelpers = true;

    const scene = new PW.Scene();

    //Camera
    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });
    camera.transform.position = [0, 2, -5];
    scene.add(camera);


    //Lights
    const directionalLight = new PW.DirectionalLight({color: [1, 1, 1, 1]});
    directionalLight.intensity = 1.0;
    directionalLight.transform.position = [0, 5, 0];
    scene.add(directionalLight);
    
    //GUI
    const gui = new GUI()
    gui.domElement.id = 'gui';
    const parameters= {
        lightX: directionalLight.transform.position[0],
        lightY: directionalLight.transform.position[1],
        lightZ: directionalLight.transform.position[2],
        planeRotX: - Math.PI / 2,
        planeRotY: 0,
        planeRotZ: 0,
    }

    const alignGUIWithCanvas = () => {
        const canvasRect = el.getBoundingClientRect();
        const guiRect = gui.domElement.getBoundingClientRect();
        gui.domElement.style.position = 'absolute';
        gui.domElement.style.top = `222px`;
        gui.domElement.style.left = `${canvasRect.right - guiRect.width - 2}px`;
        camera.setGui(gui);
    };
    alignGUIWithCanvas();


    //Mesh
    const dragonMesh = new PW.OBJMesh({
        filePath: "../models/Dragon/DragonShadeSmooth.obj",
        wireframe: false
    });
    const dragonTransform = new PW.Transform();
    dragonTransform.scale = [10,10,10];
    dragonTransform.position[1] = 1;
    quat.rotateX(dragonTransform.rotation, dragonTransform.rotation, Math.PI / 2);
    await dragonMesh.loaded();
    onLoaded();


    //Renderables
    const plane = new PW.Renderable({
        mesh: new PW.PlaneMesh({resolution: 32}),
        material: new PW.BasicLitMaterial({color: [1,1,1,1]})
    });
    quat.rotateX(plane.transform.rotation, plane.transform.rotation, - Math.PI / 2);
    plane.transform.scale = [100, 100, 1]
    plane.transform.position = [0, 0, 0];
    scene.add(plane);


    const cube = new PW.Renderable({
        // mesh: new PW.CubeMesh({}),
        mesh: dragonMesh,
        // material: new PW.BasicLitProjectionShadowMaterial({color: [1,0, 0,1]})
        material: new PW.BasicLitMaterial({color: [1,0,0,1]})
    });
    cube.useProjectionShadows(directionalLight, plane);
    scene.add(cube);
    // cube.transform.position = [0, 0.5, 0];
    cube.transform = dragonTransform;



    //Frame loop
    function frame() {
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


        gui.add(parameters, 'lightX', -10, 10).onChange((value) => {
            directionalLight.transform.position[0] = value;
            // cube.projectionShadowObject.lightPosition = directionalLight.transform.position;
        });
        gui.add(parameters, 'lightY', -10, 10).onChange((value) => {
            directionalLight.transform.position[1] = value;
            // cube.projectionShadowObject.lightPosition = directionalLight.transform.position;
        });
        gui.add(parameters, 'lightZ', -10, 10).onChange((value) => {
            directionalLight.transform.position[2] = value;
            // cube.projectionShadowObject.lightPosition = directionalLight.transform.position;
        });

        gui.add(parameters, 'planeRotX', -Math.PI, Math.PI).onChange((value) => {
            plane.transform.rotation = quat.create();
            quat.rotateX(plane.transform.rotation, plane.transform.rotation, value);
            quat.rotateY(plane.transform.rotation, plane.transform.rotation, parameters.planeRotY);
            quat.rotateZ(plane.transform.rotation, plane.transform.rotation, parameters.planeRotZ);
        }).name('X Rotation');
        gui.add(parameters, 'planeRotY', -Math.PI, Math.PI).onChange((value) => {
            plane.transform.rotation = quat.create();
            quat.rotateX(plane.transform.rotation, plane.transform.rotation, parameters.planeRotX);
            quat.rotateY(plane.transform.rotation, plane.transform.rotation, value);
            quat.rotateZ(plane.transform.rotation, plane.transform.rotation, parameters.planeRotZ);
        }).name('Y Rotation');
        gui.add(parameters, 'planeRotZ', -Math.PI, Math.PI).onChange((value) => {
            plane.transform.rotation = quat.create();
            quat.rotateX(plane.transform.rotation, plane.transform.rotation, parameters.planeRotX);
            quat.rotateY(plane.transform.rotation, plane.transform.rotation, parameters.planeRotY);
            quat.rotateZ(plane.transform.rotation, plane.transform.rotation, value);
        }).name('Z Rotation');


}