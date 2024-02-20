import * as PW from '$lib/ParkersRenderer'
import { quat } from 'gl-matrix';
export const createScene = async (el, onLoaded) => {

    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

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
    camera.transform.position[2] = -5;

    const objMesh = new PW.OBJMesh({
        filePath: "../models/Dragon/DragonShadeSmooth.obj",
        wireframe: false
    });

    const objMesh2 = new PW.OBJMesh({
        filePath: "../models/Cube/Cube.obj"
    });

    await objMesh2.loaded();
    await objMesh.loaded();
    onLoaded();

    // const objMesh = new PW.CubeMesh({

    // });

    const obj = new PW.Renderable({
        mesh: objMesh,
        material: new PW.NormalMaterial({color: [1, 0, 0, 1]})
    });
    obj.transform.scale = [10,10,10]
    obj.transform.position[1] = -1;
    quat.rotateX(obj.transform.rotation, obj.transform.rotation, Math.PI / 2);
    scene.add(obj)

    const obj2 = new PW.Renderable({
        mesh: objMesh2,
        material: new PW.NormalMaterial({color: [0, 1, 0, 1]})
    });
    //scene.add(obj2);

    let lastFrameTime = performance.now();
    let fps = 0;

    function frame() {

        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        fps = 1 / (deltaTime / 1000);

        //console.log(`FPS: ${fps}`);

        //quat.rotateY(obj.transform.rotation, obj.transform.rotation, PW.Time.deltaTime );

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}