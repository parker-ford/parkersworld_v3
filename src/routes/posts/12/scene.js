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
    onLoaded();

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
    });
    camera.transform.position = [0, 0, -3];
    scene.add(camera);

    //Materials
    const default_material = new PRAY.Material({
        attenuation: vec3.fromValues(0.8, 0.5, 0.5),
        material_flag: PRAY.Material.TYPES.LAMBERTIAN,
    });
    scene.add(default_material);


    //Spheres
    const default_sphere = new PRAY.Sphere({
        position: [0.0, 0.0, 0.0],
        radius: 1,
        material_id: default_material.id,
    });
    // scene.add(default_sphere);

    //Meshes
    const plane = new PRAY.PlaneMesh({
        width: 1,
        height: 1,
        material_id: default_material.id,
    });
    scene.add(plane);


    //Frame
    function frame() {
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();

    const parameters= {
        lens_focal_length: camera.lens_focal_length,
        image_plane_distance: camera.image_plane_distance,
        fstop: camera.fstop,
        focal_length: camera.focal_length,
    }

    const alignGUIWithCanvas = () => {
        const canvasRect = el.getBoundingClientRect();
        const guiRect = gui.domElement.getBoundingClientRect();
        gui.domElement.style.position = 'absolute';
        gui.domElement.style.top = `222px`;
        gui.domElement.style.left = `${canvasRect.right - guiRect.width - 2}px`;
        camera.setGui(gui);
    };
    alignGUIWithCanvas();




}