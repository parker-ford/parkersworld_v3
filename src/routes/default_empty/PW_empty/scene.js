import * as PW from '$lib/ParkersRenderer'
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

    const scene = new PW.Scene();
    onLoaded();

    //Camera
    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });
    camera.transform.position = [0, 0, -3];
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


    const cube = new PW.Renderable({
        mesh: new PW.CubeMesh({}),
        material: new PW.BasicMaterial({color: [1,0, 0,1]})
    });
    scene.add(cube);

    //Frame loop
    function frame() {
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


}