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

    const triangle = new PW.BasicTriangleTransform({});
    triangle.transform.position = vec3.fromValues(0.5, 0, 0);
    scene.add(triangle);

    const triangle2 = new PW.BasicTriangleTransform({});
    triangle2.transform.position = vec3.fromValues(-0.5, 0, 0);
    scene.add(triangle2);
  

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