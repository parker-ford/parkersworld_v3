import * as PW from '$lib/ParkersRenderer'
import { vec4 } from 'gl-matrix';
export const createScene = async (el, onLoaded) => {
    onLoaded();


    el.width = Math.min(document.body.clientWidth, 1400)
    el.height = Math.min(document.body.clientWidth, 1400) * .5

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

    camera.transform.position[2] = -2;

    scene.add(camera);


    
    const plane2 = new PW.Renderable({
        mesh: new PW.PlaneMesh({wireframe: true}),
        material: new PW.BasicMaterial({color: vec4.fromValues(0, 1, 0, 1)}),
    });
    scene.add(plane2);
    plane2.transform.position[0] = 1;
    
    const plane1 = new PW.Renderable({
        mesh: new PW.PlaneMesh({wireframe: true}),
        material: new PW.BasicMaterial({color: vec4.fromValues(1, 1, 0, 1)}),
    });
    scene.add(plane1);
    plane1.transform.position[0] = -1;

    function frame() {

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}