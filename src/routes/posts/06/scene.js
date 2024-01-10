import * as PW from '$lib/ParkersRenderer'

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

    function frame() {
        renderer.render(scene);
        requestAnimationFrame(frame);
    }
    frame();


}