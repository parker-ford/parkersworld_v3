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

    const cube  = new PW.Renderable({
        mesh: new PW.CubeMesh(
            {
                wireframe: false,
                height: 10,
                width: 10,
                depth: 10,
            }
            ),
        material: new PW.NormalMaterial({color: vec4.fromValues(1, 1, 0, 1)}),
    })
    cube.transform.position[0] = -1




    const plane2 = new PW.Renderable({
        mesh: new PW.CylinderMesh(
            {
                wireframe: false,
                width: 12,
                height: 6,
            }
        ),
        material: new PW.NormalMaterial({}),
    });
    plane2.transform.position[0] = 1;
    quat.rotateY(plane2.transform.rotation, plane2.transform.rotation, -90 * Math.PI / 180);


    scene.add(cube);
    scene.add(plane2);

    // const plane = new PW.Renderable({
    //     mesh: new PW.PlaneMesh({
    //         wireframe: false,
    //         height: 5,
    //         width: 5,
    //     }),
    //     material: new PW.NormalMaterial({color: vec4.fromValues(1, 1, 0, 1)}),
    // });
    // scene.add(plane);
    // plane.transform.scale = vec3.fromValues(1, 0.5, 1);
    // plane.transform.position[0] = -1;
    



    // const sphere = new PW.Renderable({
    //     mesh: new PW.SphereMesh(
    //         {
    //             wireframe: true,
    //             resolution: 24
    //         }
    //     ),
    //     material: new PW.BasicMaterial({color: vec4.fromValues(0, 1, 0, 1)}),
    // });
    
    //     scene.add(sphere);
    //     sphere.transform.position[0] = 1;

    // const cylinder = new PW.Renderable({
    //     mesh: new PW.CylinderMesh(
    //         {
    //             wireframe: true,
    //             height: 8,
    //             width: 32,
    //         }
    //     ),
    //     material: new PW.BasicMaterial({color: vec4.fromValues(0, 1, 0, 1)}),
    // });
    // scene.add(cylinder);
    // cylinder.transform.position[0] = 1;

    // const torus = new PW.Renderable({
    //     mesh: new PW.TorusMesh(
    //         {
    //             wireframe: true,
    //             // innerRadius: 0.5,
    //             // outerRadius: 1,
    //         }
    //     ),
    //     material: new PW.BasicMaterial({color: vec4.fromValues(0, 1, 0, 1)}),
    // });
    // scene.add(torus);
    // torus.transform.position[0] = 1;

    // const cone = new PW.Renderable({
    //     mesh: new PW.ConeMesh(
    //         {
    //             wireframe: false,
    //             // height: 20,
    //             // ringSegments: 32,
    //         }
    //     ),
    //     material: new PW.BasicMaterial({color: vec4.fromValues(0, 1, 0, 1)}),
    // });
    // scene.add(cone);
    // cone.transform.position[0] = 1;

    // for(let i = 0; i < sphere.mesh.vertexCoordinates.length; i++){
    //     const sphereCube = new PW.Renderable({
    //         mesh: new PW.CubeMesh(
    //             {
    //                 wireframe: true,
    //             }
    //         ),
    //         material: new PW.BasicMaterial({color: vec4.fromValues(1, 1, 0, 1)}),
    //     });
    //     sphereCube.transform.position = sphere.mesh.vertexCoordinates[i];
    //     sphereCube.transform.scale = vec3.fromValues(0.01, 0.01, 0.01);
    //     scene.add(sphereCube);
    // }

    let rotate = true;
    function frame() {

        if(rotate){
            quat.rotateY(cube.transform.rotation, cube.transform.rotation,1 * PW.Time.deltaTime);
            quat.rotateY(plane2.transform.rotation, plane2.transform.rotation,1 * PW.Time.deltaTime);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}