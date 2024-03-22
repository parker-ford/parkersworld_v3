import * as PW from '$lib/ParkersRenderer'
import { quat } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {

    //Initial setup
    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

    const renderer = new PW.Renderer(el);
    if (! await renderer.init()) {
        console.log("renderer initialization failed");
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
    camera.transform.position = [0, 1, -3];
    scene.add(camera);

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


    const texture = new PW.Texture({path: "../images/matcaps/1.png"});
    await texture.loaded();

    const checkerTexture = new PW.Texture({path: "../images/misc/checker.png", useMips: true});
    await checkerTexture.loaded();

    onLoaded();

    const defaultTexture = new PW.Texture({});
    await defaultTexture.loaded();


    const cube = new PW.Renderable({
        mesh: new PW.CubeMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: texture, tiling: 2.0, offset: 0.1}),
        // material: new PW.BasicTextureLitMaterial({}),
    });
    cube.transform.position = [0, 0.5, 0];
    scene.add(cube);

    const plane = new PW.Renderable({
        mesh: new PW.PlaneMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: checkerTexture, tiling: 10}),
    });
    quat.rotateX(plane.transform.rotation, plane.transform.rotation, - Math.PI / 2);
    plane.transform.scale = [100,100,100]
    scene.add(plane);

    const directionalLight = new PW.DirectionalLight({color: [1, 1, 1, 1]});
    directionalLight.intensity = 1.0;
    directionalLight.transform.position = [1, 5, -3];
    scene.add(directionalLight);

    //Frame loop
    function frame() {
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


}