import * as PW from '$lib/ParkersRenderer'
import basicTriangleShader from './shaders/basicTriangleShader.wgsl?raw';

export const createScene = async (el, onLoaded) => {
    
    const fallbackVideo = document.getElementById('fallback-video');
    
    el.width = Math.min(document.body.clientWidth, 1400) * .5
    el.height = Math.min(document.body.clientWidth, 1400) * .5

    const renderer = new PW.BasicTriangleRenderer(el);
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

    const radius = 0.5;
    const angles = [0, 120, 240]
    const triangle = new PW.BasicTriangle({
        points: [
            [Math.sin(angles[0] * PW.Math.Deg2Rad) * radius, Math.cos(angles[0] * PW.Math.Deg2Rad) * radius, 0.0, 1.0],
            [Math.sin(angles[1] * PW.Math.Deg2Rad) * radius, Math.cos(angles[1] * PW.Math.Deg2Rad) * radius, 0.0, 1.0],
            [Math.sin(angles[2] * PW.Math.Deg2Rad) * radius, Math.cos(angles[2] * PW.Math.Deg2Rad) * radius, 0.0, 1.0]
        ],
        colors: [[1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0]],
        shader: basicTriangleShader
    });
    scene.add(triangle);


    function frame() {

        angles[0] += PW.Time.deltaTime * 70;
        angles[1] += PW.Time.deltaTime * 70;
        angles[2] += PW.Time.deltaTime * 70;

        triangle.points = new Float32Array(
            [Math.sin(angles[0] * PW.Math.Deg2Rad) * radius, Math.cos(angles[0] * PW.Math.Deg2Rad) * radius, 0.0, 1.0,
            Math.sin(angles[1] * PW.Math.Deg2Rad) * radius, Math.cos(angles[1] * PW.Math.Deg2Rad) * radius, 0.0, 1.0,
            Math.sin(angles[2] * PW.Math.Deg2Rad) * radius, Math.cos(angles[2] * PW.Math.Deg2Rad) * radius, 0.0, 1.0]
        );
        renderer.render(scene);
        requestAnimationFrame(frame);
    }
    frame();

}