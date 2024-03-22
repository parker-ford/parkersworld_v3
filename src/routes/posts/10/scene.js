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
        far: 500,
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

    const abstractTexture1 = new PW.Texture({path: "../images/abstract/4.png"});
    await abstractTexture1.loaded();

    const abstractTexture2 = new PW.Texture({path: "../images/abstract/3.png"});
    await abstractTexture2.loaded();

    const abstractTexture3 = new PW.Texture({path: "../images/abstract/2.png"});
    await abstractTexture3.loaded();

    const abstractTexture4 = new PW.Texture({path: "../images/abstract/5.png"});
    await abstractTexture4.loaded();

    const abstractTexture5 = new PW.Texture({path: "../images/abstract/6.png"});
    await abstractTexture5.loaded();

    const abstractTexture6 = new PW.Texture({path: "../images/abstract/10.png"});
    await abstractTexture6.loaded();

    const abstractTexture7 = new PW.Texture({path: "../images/abstract/15.png"});
    await abstractTexture7.loaded();

    onLoaded();

    const defaultTexture = new PW.Texture({});
    await defaultTexture.loaded();


    const cube = new PW.Renderable({
        mesh: new PW.CubeMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: abstractTexture7, tiling: 3.0, offset: 0.0, ambient: 0.5}),
    });
    cube.transform.position = [0, 0.9, 1];
    scene.add(cube);

    const sphere1 = new PW.Renderable({
        mesh: new PW.SphereMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: abstractTexture1, tiling: 2.0, offset: 0.0, color: [1, 1, 1, 1]}),
    });
    sphere1.transform.position = [-75, 40, 200];
    sphere1.transform.scale = [30, 30, 30];
    scene.add(sphere1);

    const sphere2 = new PW.Renderable({
        mesh: new PW.SphereMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: abstractTexture2, tiling: 2.0, offset: 0.0, color: [1, 1, 1, 1]}),
    });
    sphere2.transform.position = [-40, 40, 150];
    sphere2.transform.scale = [7, 7, 7];
    scene.add(sphere2);

    const sphere3 = new PW.Renderable({
        mesh: new PW.SphereMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: abstractTexture3, tiling: 2.0, offset: 0.0, color: [1, 1, 1, 1]}),
    });
    sphere3.transform.position = [60, 60, 200];
    sphere3.transform.scale = [35, 35, 35];
    scene.add(sphere3);

    const torus = new PW.Renderable({
        mesh: new PW.TorusMesh({tubeSubdivisions: 32, ringSubdivisions: 32}),
        material: new PW.BasicTextureLitMaterial({texture: abstractTexture4, tiling: 2.0, offset: 0.0, useMips: true}),
    });
    quat.rotateX(torus.transform.rotation, torus.transform.rotation, - Math.PI / 7);
    quat.rotateZ(torus.transform.rotation, torus.transform.rotation,  Math.PI / 15);
    quat.rotateY(torus.transform.rotation, torus.transform.rotation,  - Math.PI / 4);
    torus.transform.position = [60, 60, 200];
    torus.transform.scale = [45, 2, 45];
    scene.add(torus);

    const sphere4 = new PW.Renderable({
        mesh: new PW.SphereMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: abstractTexture5, tiling: 1.0, offset: 0.0, color: [1, 1, 1, 1]}),
    });
    sphere4.transform.position = [100, 30, 180];
    sphere4.transform.scale = [15, 15, 15];
    scene.add(sphere4);

    const sphere5 = new PW.Renderable({
        mesh: new PW.SphereMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: abstractTexture6, tiling: 3.0, offset: 0.0, color: [1, 1, 1, 1]}),
    });
    sphere5.transform.position = [-190, 90, 240];
    sphere5.transform.scale = [45, 45, 45];
    scene.add(sphere5);

    const plane = new PW.Renderable({
        mesh: new PW.PlaneMesh({resolution: 32}),
        material: new PW.BasicTextureLitMaterial({texture: checkerTexture, tiling: 10, useMips: true}),
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
        quat.rotateY(cube.transform.rotation, cube.transform.rotation, 0.75 * PW.Time.deltaTime);
        cube.material.offset -= PW.Time.deltaTime * 0.3;
        cube.material.tiling = 3.0 + Math.sin(PW.Time.elapsedTime) * 1.0;
        cube.material.updateMaterialBuffers();
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


}