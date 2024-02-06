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

    camera.transform.position[2] = -15;

    scene.add(camera);

    const numObjects = 6;
    const widthSpacing = 10;
    const heightSpacing = 5;
    let resolution = 0;

    const planes = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 1;
        const plane = new PW.Renderable(
            {
                mesh: new PW.PlaneMesh({width: resolution, height: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: [0.5, 0.5, 0.5, 1]}),
            }
        )
        plane.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        plane.transform.position[1] = (-1 + (5 / (numObjects - 1)) * 2) * heightSpacing;
        planes.push(plane);
        scene.add(plane);
    }

    const cubes = [];
    for(let i = 0; i < numObjects; i++){
        resolution = resolution = i * 2 + 1;
        const cube = new PW.Renderable(
            {
                mesh: new PW.CubeMesh({width: resolution, depth: resolution, height: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: [0.5, 0.5, 0.5, 1]}),
            }
        )
        cube.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        cube.transform.position[1] = (-1 + (4 / (numObjects - 1)) * 2) * heightSpacing;
        cubes.push(cube);
        scene.add(cube);
    }

    const spheres = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 3;
        const sphere = new PW.Renderable(
            {
                mesh: new PW.SphereMesh({resolution: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: [0.5, 0.5, 0.5, 1]}),
            }
        )
        sphere.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        sphere.transform.position[1] = (-1 + (3 / (numObjects - 1)) * 2) * heightSpacing;
        spheres.push(sphere);
        scene.add(sphere);
    }

    const cylinders = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 3;
        const cylinder = new PW.Renderable(
            {
                mesh: new PW.CylinderMesh({width: resolution, height: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: [0.5, 0.5, 0.5, 1]}),
            }
        )
        cylinder.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        cylinder.transform.position[1] = (-1 + (2 / (numObjects - 1)) * 2) * heightSpacing;
        cylinder.transform.scale = vec3.fromValues(0.5, 0.5, 0.5);
        cylinders.push(cylinder);
        scene.add(cylinder);
    }

    const cones = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 3;
        const cone = new PW.Renderable(
            {
                mesh: new PW.ConeMesh({width: resolution, height: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: [0.5, 0.5, 0.5, 1]}),
            }
        )
        cone.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        cone.transform.position[1] = (-1 + (1 / (numObjects - 1)) * 2) * heightSpacing;
        cones.push(cone);
        scene.add(cone);
    }

    const toruses = [];
    for(let i = 0; i < numObjects; i++){
        resolution = i * 2 + 4;
        const torus = new PW.Renderable(
            {
                mesh: new PW.TorusMesh({tubeSubdivisions: resolution, ringSubdivisions: resolution, wireframe: true}),
                material: new PW.BasicMaterial({color: [0.5, 0.5, 0.5, 1]}),
            }
        )
        torus.transform.position[0] = (-1 + (i / (numObjects - 1)) * 2) * widthSpacing;
        torus.transform.position[1] = (-1 + (0 / (numObjects - 1)) * 2) * heightSpacing;
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