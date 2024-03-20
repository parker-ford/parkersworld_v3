import * as PW from '$lib/ParkersRenderer'
import { quat, vec3 } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {
    

    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

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

    scene.add(camera);
    camera.transform.position[2] = -4;
    camera.transform.position[1] = 0.5;
   //camera.transform.setForwardVector(vec3.subtract(vec3.create(), [0,0,0], camera.transform.position));

    // const bunnyMesh = new PW.OBJMesh({
    //     filePath: "../models/StanfordBunny/StanfordBunnyShadeSmooth.obj",
    //     wireframe: false
    // });
    // const bunnyTransform = new PW.Transform();
    // bunnyTransform.position = [0,-1,0];
    // bunnyTransform.scale = [8,8,8];
    // quat.rotateY(bunnyTransform.rotation, bunnyTransform.rotation, Math.PI );
    // await bunnyMesh.loaded();

    const ratBodyMesh = new PW.OBJMesh({
        filePath: "../models/Rat/rat_body.obj",
        wireframe: false
    });
    await ratBodyMesh.loaded();

    const ratTailMesh = new PW.OBJMesh({
        filePath: "../models/Rat/rat_tail.obj",
        wireframe: false
    });

    const ratEyelidMesh = new PW.OBJMesh({
        filePath: "../models/Rat/rat_eyelids.obj",
        wireframe: false
    });
    await ratEyelidMesh.loaded();

    const ratEyeMesh = new PW.OBJMesh({
        filePath: "../models/Rat/rat_eyes.obj",
        wireframe: false
    });
    await ratEyeMesh.loaded();

    const ratNoseMesh = new PW.OBJMesh({
        filePath: "../models/Rat/rat_nose.obj",
        wireframe: false
    });
    await ratNoseMesh.loaded();

    const ratPupilMesh = new PW.OBJMesh({
        filePath: "../models/Rat/rat_pupils.obj",
        wireframe: false
    });
    await ratPupilMesh.loaded();

    onLoaded();

    const ratTransform = new PW.Transform({});
    quat.rotateY(ratTransform.rotation, ratTransform.rotation, Math.PI);
    ratTransform.position[0] = 0;
    
    const ratBody = new PW.Renderable({
        mesh: ratBodyMesh,
        material: new PW.BasicLitMaterial({color: [0.549, 0.549, 0.549, 1.0]})
    });
    ratBody.transform = ratTransform;
    scene.add(ratBody);

    const ratTail = new PW.Renderable({
        mesh: ratTailMesh,
        material: new PW.BasicLitMaterial({color: [0.8, 0.702, 0.769, 1.0]})
    });
    ratTail.transform = ratTransform;
    scene.add(ratTail);

    const ratEyelids = new PW.Renderable({
        mesh: ratEyelidMesh,
        material: new PW.BasicLitMaterial({color: [0.78, 0.69, 0.859,1]})
    });
    ratEyelids.transform = ratTransform;
    scene.add(ratEyelids);

    const ratEyes = new PW.Renderable({
        mesh: ratEyeMesh,
        material: new PW.BasicMaterial({color: [0.929, 0.91, 0.827,1]})
    });
    ratEyes.transform = ratTransform;
    scene.add(ratEyes);

    const ratPupils = new PW.Renderable({
        mesh: ratPupilMesh,
        material: new PW.BasicMaterial({color: [0,0,0,1]})
    });
    ratPupils.transform = ratTransform;
    scene.add(ratPupils);

    const ratNose = new PW.Renderable({
        mesh: ratNoseMesh,
        material: new PW.BasicLitMaterial({color: [0.1,0.1,0.1,1]})
    });
    ratNose.transform = ratTransform;
    scene.add(ratNose);

    const sphere = new PW.Renderable({
        mesh: new PW.SphereMesh({resolution: 32}),
        material: new PW.BasicLitMaterial({color: [1,0,0,1]})
    });
    sphere.transform.position[1] = 0.5;
    //scene.add(sphere);

    const plane = new PW.Renderable({
        mesh: new PW.PlaneMesh({width: 10, height: 10}),
        material: new PW.BasicLitMaterial({color: [1,1,1,1]})
    });
    plane.transform.position = [0,0,0];
    plane.transform.scale = [50,50,50];
    scene.add(plane);
    quat.rotateX(plane.transform.rotation, plane.transform.rotation, -Math.PI / 2);

    const directionalLight = new PW.DirectionalLight({color: [1, 0, 0, 1]});
    directionalLight.intensity = 1.0;
    directionalLight.transform.position = [-5,5,0];
    scene.add(directionalLight);
    
    const directionalLight2 = new PW.DirectionalLight({color: [0, 1, 0, 1]});
    directionalLight2.intensity = 1.0;
    directionalLight2.transform.position = [5,5,0];
    // scene.add(directionalLight2);

    const directionalLight3 = new PW.DirectionalLight({color: [0, 0, 1, 1]});
    directionalLight3.intensity = 1.0;
    directionalLight3.transform.position = [0,5,5];
    //scene.add(directionalLight3);


    const moonlight = new PW.DirectionalLight({color: [0.5,0.5,0.5,1]});
    moonlight.intensity = 0.5;
    moonlight.transform.position = [-5,5,0];
    //scene.add(moonlight);
    
    const light2 = new PW.DirectionalLight({color: [1,0,0,1]});
    light2.intensity = 1.0;
    light2.transform.position = [-3,0,0];
    // scene.add(light2);

    const light3 = new PW.DirectionalLight({color: [0,1,0,1]});
    light3.intensity = 1.0;
    light3.transform.position = [0,3,0];
    // scene.add(light3);

    const pointLight = new PW.PointLight({color: [0,1,0,1]});
    pointLight.transform.position = [1,1,0];
    pointLight.fallOff = 1;
    // pointLight.maxDistance = 8;
    pointLight.setMaxDistance(5);
    pointLight.intensity = 1;

    //scene.add(pointLight);

    const pointLight2 = new PW.PointLight({color: [0,1,0,1]});
    pointLight2.transform.position = [-2,2,0];
    pointLight2.fallOff = 0.8;
    pointLight2.setMaxDistance(1);
    // // pointLight2.maxDistance = 2;
    //scene.add(pointLight2);

    // const pointLight3 = new PW.PointLight({color: [1,1,1,1]});
    // pointLight3.transform.position = [0,2,0];
    // // pointLight3.fallOff = 5;
    // pointLight3.setMaxDistance(100);
    // pointLight3.intensity = 4;
    // scene.add(pointLight3);


    const spotLight = new PW.SpotLight({color: [1,0,0,1]});
    spotLight.transform.position = [0,5,0];
    quat.rotateX(spotLight.transform.rotation, spotLight.transform.rotation, Math.PI / 4);

    spotLight.fallOff = 0;
    spotLight.setMaxDistance(20);
    spotLight.setAngle(0.5);
    spotLight.penumbra = 0.5;
    spotLight.intensity = 10;
    // scene.add(spotLight);


    // gui.addColor(parameters, 'color').onChange((value) => {
    //     let r = (value & 0xff0000) >> 16;
    //     let g = (value & 0x00ff00) >> 8;
    //     let b = (value & 0x0000ff);
    //     let color = [r/255, g/255, b/255, 1];
    //     obj.material.color = color;
    //     obj.material.updateMaterialBuffers();

    // })

    var t = 0;
    function frame() {

        pointLight.transform.position[0] = 2 * Math.sin(t);
        pointLight.transform.position[2] = 2 * Math.cos(t);

        // quat.rotateX(spotLight.transform.rotation, spotLight.transform.rotation,   PW.Time.deltaTime);
        

        t += PW.Time.deltaTime;
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();


    const gui = new GUI()
    gui.domElement.id = 'gui';

    const parameters= {
        color: 0xff0000,
        penumbra: 0.5,
        spotAngle: 0.5,
        directionalLightActive: true,
        directionalLightColor: [1,1,1,1],
        directionalLightIntensity: 1,
        directionalLightX: 0,
        directionalLightY: 0,
        directionalLightZ: 0,
    }
    parameters.directionalLightX = directionalLight.transform.position[0];
    parameters.directionalLightY = directionalLight.transform.position[1];
    parameters.directionalLightZ = directionalLight.transform.position[2];

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

    // gui.add(parameters, 'penumbra', 0, 1).onChange((value) => {
    //     spotLight.penumbra = value;
    //     spotLight.mesh.updateGizmo();
    // });

    // gui.add(parameters, 'spotAngle', 0, 1).onChange((value) => {
    //     spotLight.setAngle(value * Math.PI / 2);
    // });

    const directionalLightFolder = gui.addFolder('Directional Light');
    directionalLightFolder.add(parameters, 'directionalLightActive').onChange((value) => {
        if(value){
            scene.add(directionalLight);
        } else {
            scene.remove(directionalLight);
        }
    });
    directionalLightFolder.addColor(parameters, 'directionalLightColor').onChange((value) => {
        directionalLight.color = value;
        directionalLight.updateGizmo();
    }).name('Color');
    directionalLightFolder.add(parameters, 'directionalLightIntensity', 0, 10).onChange((value) => {
        directionalLight.intensity = value;
    }).name('Intensity');
    directionalLightFolder.add(parameters, 'directionalLightX', -10, 10).onChange((value) => {
        directionalLight.transform.position[0] = value;
    }).name('X');
    directionalLightFolder.add(parameters, 'directionalLightY', -10, 10).onChange((value) => {
        directionalLight.transform.position[1] = value;
    }).name('Y');
    directionalLightFolder.add(parameters, 'directionalLightZ', -10, 10).onChange((value) => {
        directionalLight.transform.position[2] = value;
    }).name('Z');
}