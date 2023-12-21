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

    const triangle = new PW.BasicTriangle({
        points: [[-1.0, -1.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [1.0, -1.0, 0.0, 1.0]],
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