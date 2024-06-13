import * as PW from '$lib/ParkersRenderer'
import GUI from 'lil-gui'; 
import { texture } from 'three/examples/jsm/nodes/Nodes.js';


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

    const scene = new PW.Scene();

    //Textures
    const testTexture = new PW.Texture2D({path: "../images/test/test.jpg"});
    await testTexture.loaded();

    const woodTexture = new PW.Texture2D({path: "../images/wood/wood.jpg", useMips: true});
    await woodTexture.loaded();

    const globeTexture = new PW.Texture2D({path: "../images/globe/globe.jpg"});
    await globeTexture.loaded();

    const wallpaintTexture = new PW.Texture2D({path: "../images/wallpaint/wallpaint3.jpg", addressMode: "repeat", useMips: true});
    await wallpaintTexture.loaded();

    const skyboxTexture = new PW.CubeMapTexture({paths: [
        "../images/environmentMaps/rural_road/px.png",
        "../images/environmentMaps/rural_road/nx.png",
        "../images/environmentMaps/rural_road/ny.png",
        "../images/environmentMaps/rural_road/py.png",
        "../images/environmentMaps/rural_road/pz.png",
         "../images/environmentMaps/rural_road/nz.png"
    ]});
    await skyboxTexture.loaded();


    // await defaultTexture.loaded();


    //Models
    const deskMesh = new PW.OBJMesh({
        filePath: "../models/Desk/Desk.obj",
        wireframe: false
    });
    await deskMesh.loaded();

    const globeMesh = new PW.OBJMesh({
        filePath: "../models/Globe/Globe.obj",
        wireframe: false
    });
    await globeMesh.loaded();

    const windowMesh = new PW.OBJMesh({
        filePath: "../models/Window/Window.obj",
        wireframe: false
    });
    await windowMesh.loaded();



    onLoaded();

    // const defaultTexture = await PW.Texture2D.getDefaultTexture();


    //Renderables
    const desk = new PW.Renderable({
        mesh: deskMesh,
        // material: new PW.UVMaterial({color: [1,1,1,1]})
        material: new PW.BasicTextureLitMaterial({texture: woodTexture,  ambient: 0.0}),
    });
    desk.transform.scale = [0.01, 0.01, 0.01];
    scene.add(desk);

    const globe = new PW.Renderable({
        mesh: globeMesh,
        material: new PW.BasicTextureLitMaterial({texture: globeTexture}),
    });
    globe.transform.scale = [0.9, 0.9, 0.9];
    globe.transform.position = [1, 1.71, 0];
    scene.add(globe);

    const window = new PW.Renderable({
        mesh: windowMesh,
        material: new PW.BasicTextureLitMaterial({ambient: 0.0}),
    });
    window.transform.scale = [0.05, 0.05, 0.05];
    window.transform.position = [0, 1.71, 6];
    scene.add(window);

    const wall1 = new PW.Renderable({
        mesh: new PW.PlaneMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: wallpaintTexture, tiling: 5, color:[1.0, 1.0, 1.0, 1.0], ambient: 0.8}),
    });
    wall1.transform.position = [6.5, 2.5, 6];
    wall1.transform.scale = [10, 10, 10];
    scene.add(wall1);

    const wall2= new PW.Renderable({
        mesh: new PW.PlaneMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: wallpaintTexture, tiling: 5, color:[1.0, 1.0, 1.0, 1.0], ambient: 0.8}),
    });
    wall2.transform.position = [-6.5, 2.5, 6];
    wall2.transform.scale = [10, 10, 10];
    scene.add(wall2);

    const wall3 = new PW.Renderable({
        mesh: new PW.PlaneMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: wallpaintTexture, tiling: 5, color:[1.0, 1.0, 1.0, 1.0], ambient: 0.8}),
    });
    wall3.transform.position = [0, 8.3, 6.001];
    wall3.transform.scale = [10, 10, 10];
    scene.add(wall3);

    const wall4 = new PW.Renderable({
        mesh: new PW.PlaneMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: wallpaintTexture, tiling: 5, color:[1.0, 1.0, 1.0, 1.0], ambient: 0.8}),
    });
    wall4.transform.position = [0, -5.0, 6.001];
    wall4.transform.scale = [10, 10, 10];
    scene.add(wall4);

    //Camera
    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });
    camera.transform.position = [0, 1.5, -3];
    scene.add(camera);

    //Lights
    const directionalLight = new PW.DirectionalLight({color: [1, 1, 1, 1]});
    directionalLight.intensity = 0.5;
    directionalLight.transform.position = [1, 5, -3];
    // scene.add(directionalLight);

    //SkyBox
    const skyBox = new PW.SkyBox({texture: skyboxTexture});
    scene.add(skyBox);

    //GUI
    const gui = new GUI()
    gui.domElement.id = 'gui';
    const parameters= {
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

    //Frame loop
    function frame() {
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


}