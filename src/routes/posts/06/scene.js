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

    scene.add(camera);

    function frame() {
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();


}