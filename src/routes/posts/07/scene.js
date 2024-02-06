import * as PW from '$lib/ParkersRenderer'
import { vec4, vec3, quat } from 'gl-matrix';
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

    camera.transform.position[2] = -3;

    scene.add(camera);

    const numObjects = 6;

    const planes = [];
    for(let i = 0; i < numObjects; i++){
        const plane = new PW.Renderable(
            {
                mesh: new PW.PlaneMesh({width: 1, height: 1, wireframe: true}),
                material: new PW.BasicMaterial({color: [0.5, 0.5, 0.5, 1]}),
            }
        )
        plane.transform.position[0] = -1 + (i / numObjects) * 2;
        planes.push(plane);
        scene.add(plane);
    }



    let rotate = true;
    function frame() {

        // if(rotate){
        //     quat.rotateY(cube.transform.rotation, cube.transform.rotation,1 * PW.Time.deltaTime);
        //     quat.rotateY(plane2.transform.rotation, plane2.transform.rotation,1 * PW.Time.deltaTime);
        // }

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}