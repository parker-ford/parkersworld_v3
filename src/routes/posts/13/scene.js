import * as PRAY from '$lib/Preemo-Ray'
import { quat, vec3 } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {

    const fallbackVideo = document.getElementById('fallback-video');
    
    //Initial setup
    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

    // GUI
    const gui = new GUI()
    gui.domElement.id = 'gui';


    //Renderer
    const renderer = new PRAY.Renderer(el);
    if (! await renderer.init()) {
        console.log("renderer initialization failed");
        fallbackVideo.style.display = 'block';
        fallbackVideo.width = el.width;
        fallbackVideo.height = el.height;
        el.style.display = 'none';
        gui.domElement.style.display = 'none';
        
        onLoaded();
        const modal = document.getElementById('webgpu__modal');
        if (localStorage.getItem("hideWebGPUModal") !== "true") {
            modal.showModal();
        }

        return;
    }

    const scene = new PRAY.Scene();
    scene.debug_data_views.DEBUG_0[0] = 1;


    //Camera
    const camera = new PRAY.PerspectiveCamera({
        fov: 90,
        aspect: el.width / el.height,
        near: 0.01,
        far: 10000,
        image_size: [el.width, el.height],
        lens_focal_length: 0.035,
        image_plane_distance: 0.05,
        fstop: 2.8,
        focal_length: 0.035,
        background_color: vec3.fromValues(0.5, 0.7, 1.0),
    });
    camera.transform.position = [0, 0, -3];
    scene.add(camera);

    //Materials
    const default_material = new PRAY.Material({
        attenuation: vec3.fromValues(0.8, 0.5, 0.5),
        material_flag: PRAY.Material.TYPES.LAMBERTIAN,
    });


    //Spheres
    const default_sphere = new PRAY.Sphere({
        position: [0.0, 0.0, 0.0],
        radius: 1,
        material_id: default_material.id,
    });
//     // scene.add(default_sphere);
    
    const mesh = new PRAY.OBJMesh({
        filePath: "../models/StanfordBunny/bunny_lowpoly.obj",
        material_id: default_material.id,
    });
    await mesh.loaded();
    onLoaded();

    const renderable = new PRAY.Renderable({
        mesh: mesh,
        material: default_material,
        
    });
    scene.add(renderable);

    //FPS
    const infoElem = document.querySelector('#info');
    infoElem.style.fontFamily = "Consolas, 'Courier New', monospace";

    //Frame
    function frame() {
        const startTime = performance.now();
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        const jsTime = performance.now() - startTime;

        infoElem.textContent = 
        `\
TIME STATS:
fps: ${(1 / PRAY.Time.deltaTime).toFixed(1)}
js: ${jsTime.toFixed(1)}ms

BVH STATS:
triangle count: ${mesh.triangle_count}
node count: ${mesh.bvh.node_count}
leaf count: ${mesh.bvh.leaf_count}
leaf depth:
  -min: ${mesh.bvh.min_leaf_depth}
  -max: ${mesh.bvh.max_leaf_depth}
  -mean: ${parseFloat(mesh.bvh.mean_leaf_depth.toFixed(2))}
leaf triangles:
  -min: ${mesh.bvh.min_leaf_triangles}
  -max: ${mesh.bvh.max_leaf_triangles}
  -mean: ${parseFloat(mesh.bvh.mean_leaf_triangles.toFixed(2))}
`;
    }
    frame();

    const parameters= {
        bvh_debug: true,
        bvh_depth: 0,
    }

    gui.add(parameters, 'bvh_debug').onChange((value) => {
        scene.debug_data_views.DEBUG_0[0] = value;
        scene.parameters_updated = true;
    });
    gui.add(parameters, 'bvh_depth', 0, 16).step(1).onChange((value) => {
        scene.debug_data_views.DEBUG_1[0] = value;
        scene.parameters_updated = true;
    });

    const alignGUIWithCanvas = () => {
        const canvasRect = el.getBoundingClientRect();
        const guiRect = gui.domElement.getBoundingClientRect();
        gui.domElement.style.position = 'absolute';
        gui.domElement.style.top = `222px`;
        gui.domElement.style.left = `${canvasRect.right - guiRect.width - 2}px`;
        camera.setGui(gui);

        const infoRect = infoElem.getBoundingClientRect();
        infoElem.style.position = 'absolute';
        infoElem.style.top = '222px';
        infoElem.style.left = `${canvasRect.left}px`;
    };
    alignGUIWithCanvas();




}