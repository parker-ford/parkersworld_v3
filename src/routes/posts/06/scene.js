import * as PW from '$lib/ParkersRenderer'
import { quat, vec3, mat4 } from 'gl-matrix';

export const createScene = async (el, onLoaded) => {
    onLoaded();

    el.width = Math.min(document.body.clientWidth, 1400) * .5
    el.height = Math.min(document.body.clientWidth, 1400) * .5

    const renderer = new PW.BasicTransformRenderer(el);
    if (! await renderer.init()) {
        console.log("renderer initialization failed");
    }

    const scene = new PW.Scene();

    const sideLength = 0.5;
    const height = sideLength * Math.sqrt(3) / 2;

    const triangle = new PW.BasicTriangleTransform({
        points: [
            [-sideLength / 2, -height / 2, 0.0, 1.0],
            [0, height / 2, 0.0, 1.0],
            [sideLength / 2, -height / 2, 0.0, 1.0]
        ],
        colors: [
            [1.0, 0.0, 0.0, 1.0], 
            [0.0, 1.0, 0.0, 1.0], 
            [0.0, 0.0, 1.0, 1.0]
        ],
    });

    scene.add(triangle);

    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 10,
    });

    camera.transform.position[2] = -2;
    // console.log(camera.viewMatrix);
    // console.log(mat4.fromScaling(mat4.create(), vec3.fromValues(1, 1, -1)))
    console.log(camera.projectionMatrix);

    scene.add(camera);

    function frame() {
        // let rot = quat.create();
        // quat.setAxisAngle(rot, vec3.fromValues(0, 1, 0), .01);
        // quat.multiply(camera.transform.rotation, rot, camera.transform.rotation);
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();


}