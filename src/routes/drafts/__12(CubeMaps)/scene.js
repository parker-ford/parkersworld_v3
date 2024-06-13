import * as PW from '$lib/ParkersRenderer'
import { quat } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {
    onLoaded();

    //Initial setup
    el.width = Math.min(document.body.clientWidth * .95, 1400);
    el.height = Math.min(document.body.clientWidth * .95, 1400) * .5;

    const renderer = new PW.Renderer(el);
    if (! await renderer.init()) {
        console.log("renderer initialization failed");
    }

    const scene = new PW.Scene();


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



    // const texture = new PW.CubeMapTexture({paths: [
    //     "../images/environmentMaps/rural_road/px.png",
    //     "../images/environmentMaps/rural_road/nx.png",
    //     "../images/environmentMaps/rural_road/ny.png",
    //     "../images/environmentMaps/rural_road/py.png",
    //     "../images/environmentMaps/rural_road/pz.png",
    //      "../images/environmentMaps/rural_road/nz.png"
    // ]});
    // await texture.loaded();


    const cube = new PW.Renderable({
        // mesh: new PW.CubeMesh({}),
        mesh: new PW.SphereMesh({radius: 1, resolution: 100}),
        material: new PW.CubeMapMaterial({texture: texture, color: [1, 0, 0, 1]})
        // material: new PW.BasicLitMaterial({color: [1, 1, 1, 1]})
        // material: new PW.BasicTextureLitMaterial({texture: testTexture, color: [1, 1, 1, 1]})
    });
    
    // const skyBox = new PW.SkyBox({texture: texture});
    // scene.add(cube);
    // scene.add(skyBox);

    const directionalLight = new PW.DirectionalLight({});
    directionalLight.transform.position = [2, 3, -4];
    scene.add(directionalLight);

    //Frame loop
    function frame() {

        // quat.rotateY(cube.transform.rotation, cube.transform.rotation, - 1 * PW.Time.deltaTime);

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


}