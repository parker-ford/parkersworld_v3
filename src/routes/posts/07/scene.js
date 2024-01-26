import * as PW from '$lib/ParkersRenderer'
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

    camera.transform.position[2] = -1;

    scene.add(camera);

    const plane = new PW.Plane({});
    scene.add(plane);


    function frame() {

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}