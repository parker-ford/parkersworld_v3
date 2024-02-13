import * as PW from '$lib/ParkersRenderer'
import { vec4, vec3, quat } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {
    onLoaded();


    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

    const gui = new GUI()
    gui.domElement.id = 'gui';

    const parameters= {
        wireframe: true,
        material: 'basic'
    }

    const alignGUIWithCanvas = () => {
        const canvasRect = el.getBoundingClientRect();
        const guiRect = gui.domElement.getBoundingClientRect();
        gui.domElement.style.position = 'absolute';
        gui.domElement.style.top = `222px`;
        gui.domElement.style.left = `${canvasRect.right - guiRect.width - 2}px`;
        console.log("testing gui align");
        console.log(guiRect)
    };
    alignGUIWithCanvas();
    
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

    camera.transform.position[2] = -3;

    scene.add(camera);

    
    // const obj1 = new PW.Renderable({
    //     mesh: new PW.SphereMesh({resolution: 12, wireframe: true,}),
    //     material: new PW.BasicMaterial({color: [1, 0, 0, 1]})
    // });
    // scene.add(obj1);
    // obj1.transform.position[0] = -1.5;

    // const obj2 = new PW.Renderable({
    //     mesh: new PW.SphereMesh({resolution: 12, wireframe: false,}),
    //     material: new PW.BasicMaterial({color: [1, 0, 0, 1]})
    // });
    // scene.add(obj2);

    // const obj3 = new PW.Renderable({
    //     mesh: new PW.SphereMesh({resolution: 12, wireframe: true,}),
    //     material: new PW.NormalMaterial({color: [1, 0, 0, 1]})
    // });
    // obj3.transform.position[0] = 1.5;
    // scene.add(obj3);


    const plane = new PW.Renderable(
        {
            mesh: new PW.PlaneMesh({width: 3, height: 3, wireframe: true}),
            material: new PW.BasicMaterial({color: [1, 1, 1, 1]}),
        }
    );
    scene.add(plane);


    let rotate = true;
    function frame() {

    
        

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}