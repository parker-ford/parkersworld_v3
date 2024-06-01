import * as PW from '$lib/ParkersRenderer'
import { vec4, vec3, quat } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {

    const fallbackVideo = document.getElementById('fallback-video');


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
        fallbackVideo.style.display = 'block';
        fallbackVideo.width = el.width;
        fallbackVideo.height = el.height;
        el.style.display = 'none';
        gui.domElement.style.display = 'none';

        onLoaded();
        return;
    }

    const scene = new PW.Scene();
    onLoaded();

    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });

    camera.transform.position[2] = -15;

    scene.add(camera);

    const numObjects = 6;
    const widthSpacing = 10;
    const heightSpacing = 5;
    let resolution = 0;

    const planes = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 1;
        const r = i / (numObjects - 1);
        const g = 5 / (numObjects - 1);
        const b = 0.0;
        const meshColor = [r,g,b,1];
        const plane = new PW.Renderable(
            {
                mesh: new PW.PlaneMesh({width: resolution, height: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: meshColor}),
            }
        )
        plane.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        plane.transform.position[1] = (-1 + (5 / (numObjects - 1)) * 2) * heightSpacing;
        plane.meshColor = meshColor;
        planes.push(plane);
        scene.add(plane);
    }

    const cubes = [];
    for(let i = 0; i < numObjects; i++){
        resolution = resolution = i * 2 + 1;
        const r = i / (numObjects - 1);
        const g = 4 / (numObjects - 1);
        const b = 0.1;
        const meshColor = [r,g,b,1];
        const cube = new PW.Renderable(
            {
                mesh: new PW.CubeMesh({width: resolution, depth: resolution, height: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color:meshColor}),
            }
        )
        cube.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        cube.transform.position[1] = (-1 + (4 / (numObjects - 1)) * 2) * heightSpacing;
        cube.meshColor = meshColor;
        cubes.push(cube);
        scene.add(cube);
    }

    const spheres = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 3;
        const r = i / (numObjects - 1);
        const g = 3 / (numObjects - 1);
        // const b = (numObjects - 3) / numObjects;
        const b = 0.2;
        const meshColor = [r,g,b,1];
        const sphere = new PW.Renderable(
            {
                mesh: new PW.SphereMesh({resolution: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: meshColor}),
            }
        )
        sphere.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        sphere.transform.position[1] = (-1 + (3 / (numObjects - 1)) * 2) * heightSpacing;
        sphere.meshColor = meshColor;
        spheres.push(sphere);
        scene.add(sphere);
    }

    const cylinders = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 3;
        const r = i / (numObjects - 1);
        const g = 2 / (numObjects - 1);
        const b = 0.3;
        const meshColor = [r,g,b,1];
        const cylinder = new PW.Renderable(
            {
                mesh: new PW.CylinderMesh({width: resolution, height: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: meshColor}),
            }
        )
        cylinder.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        cylinder.transform.position[1] = (-1 + (2 / (numObjects - 1)) * 2) * heightSpacing;
        cylinder.meshColor = meshColor;
        cylinder.transform.scale = vec3.fromValues(0.5, 0.5, 0.5);
        cylinders.push(cylinder);
        scene.add(cylinder);
    }

    const cones = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 3;
        const r = i / (numObjects - 1);
        const g = 1 / (numObjects - 1);
        const b = 0.4;
        const meshColor = [r,g,b,1];
        const cone = new PW.Renderable(
            {
                mesh: new PW.ConeMesh({width: resolution, height: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color:meshColor}),
            }
        )
        cone.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        cone.transform.position[1] = (-1 + (1 / (numObjects - 1)) * 2) * heightSpacing;
        cone.meshColor = meshColor;
        cones.push(cone);
        scene.add(cone);
    }

    const toruses = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 4;
        const r = i / (numObjects - 1);
        const g = 0 / (numObjects - 1);
        const b = 0.5;
        const meshColor = [r,g,b,1];
        const torus = new PW.Renderable(
            {
                mesh: new PW.TorusMesh({tubeSubdivisions: resolution, ringSubdivisions: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color:meshColor}),
            }
        )
        torus.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        torus.transform.position[1] = (-1 + (0 / (numObjects - 1)) * 2) * heightSpacing;
        torus.meshColor = meshColor;
        toruses.push(torus);
        scene.add(torus);
    }

    planes.forEach((plane) => {
        quat.rotateZ(plane.transform.rotation, plane.transform.rotation, - Math.PI / 6);
    });

    cubes.forEach((cube) => {
        quat.rotateZ(cube.transform.rotation, cube.transform.rotation, - Math.PI / 6);
    });

    spheres.forEach((sphere) => {
        quat.rotateZ(sphere.transform.rotation, sphere.transform.rotation, - Math.PI / 6);
    });

    cylinders.forEach((cylinder) => {
        quat.rotateZ(cylinder.transform.rotation, cylinder.transform.rotation, - Math.PI / 6);
    });

    cones.forEach((cone) => {
        quat.rotateZ(cone.transform.rotation, cone.transform.rotation, - Math.PI / 6);
    });

    toruses.forEach((torus) => {
        quat.rotateZ(torus.transform.rotation, torus.transform.rotation, - Math.PI / 6);
    });


    const updateWireframe = (meshes, value) => {
        meshes.forEach(element => {
            element.changeWireframe(value);
        })
    }

    const updateMaterials = (meshes, value) => {
        meshes.forEach(element => {
            switch (value){
                case 'basic':
                    element.changeMaterial(new PW.BasicMaterial({color: element.meshColor}));
                    break;
                case 'uv':
                    element.changeMaterial( new PW.UVMaterial({}));
                    break;
                case 'normal':
                    element.changeMaterial(new PW.NormalMaterial({}));
                    break;
                default:
                    break;
            }

        });
    }

    gui.add(parameters, 'material', ['basic', 'uv', 'normal']).onChange((value) => {
        updateMaterials(planes, value);
        updateMaterials(cubes, value);
        updateMaterials(spheres, value);
        updateMaterials(cylinders, value);
        updateMaterials(cones, value);
        updateMaterials(toruses, value);
    });

    gui.add(parameters, 'wireframe').onChange((value) => {
        updateWireframe(planes, value);
        updateWireframe(cubes, value);
        updateWireframe(spheres, value);
        updateWireframe(cylinders, value);
        updateWireframe(cones, value);
        updateWireframe(toruses, value);
    })


    let rotate = true;
    function frame() {

        planes.forEach((plane) => {
            quat.rotateY(plane.transform.rotation, plane.transform.rotation, - 1 * PW.Time.deltaTime);
        });

        cubes.forEach((cube) => {
            quat.rotateY(cube.transform.rotation, cube.transform.rotation, - 1 * PW.Time.deltaTime);
        });

        spheres.forEach((sphere) => {
            quat.rotateY(sphere.transform.rotation, sphere.transform.rotation, - 1 * PW.Time.deltaTime);
        });

        cylinders.forEach((cylinder) => {
            quat.rotateY(cylinder.transform.rotation, cylinder.transform.rotation, - 1 * PW.Time.deltaTime);
        });

        cones.forEach((cone) => {
            quat.rotateY(cone.transform.rotation, cone.transform.rotation, - 1 * PW.Time.deltaTime);
        });

        toruses.forEach((torus) => {
            quat.rotateY(torus.transform.rotation, torus.transform.rotation, - 1 * PW.Time.deltaTime);
        });

        

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}