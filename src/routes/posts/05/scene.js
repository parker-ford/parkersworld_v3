import * as PW from '$lib/ParkersRenderer'
import basicTriangleShader from './shaders/basicTriangleShader.wgsl?raw';

export const createScene = async (el, onLoaded) => {
    onLoaded();

    el.width = 512;
    el.height = 512;

    const renderer = new PW.Renderer(el);
    if(! await renderer.init()){
        console.log("renderer initialization failed");
    }

    const scene = new PW.Scene();

    const radius = 0.5;
    const angles = [0,120,240]
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


    function frame(){
        
        renderer.render(scene);
        requestAnimationFrame(frame);
    }
    frame();

}