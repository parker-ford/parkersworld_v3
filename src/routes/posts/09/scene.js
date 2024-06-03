import * as PW from '$lib/ParkersRenderer'
import { quat, vec3 } from 'gl-matrix';
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {

    const fallbackVideo = document.getElementById('fallback-video');
    const infoElement = document.getElementById('info');

    el.width = Math.min(document.body.clientWidth * 0.95, 1400);
    console.log(el.width);
    el.height = Math.min(document.body.clientWidth * 0.95, 1400) * .5;

    const gui = new GUI()
    gui.domElement.id = 'gui';

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

    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });

    scene.add(camera);
    camera.transform.position[2] = -10;
    camera.transform.position[1] = 5;
    camera.transform.setForwardVector(vec3.subtract(vec3.create(), [0,0,0], camera.transform.position));

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
        material: new PW.BasicMaterial({color: [0.941, 0.933, 0.431,1]})
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

    const plane = new PW.Renderable({
        mesh: new PW.PlaneMesh({width: 10, height: 10}),
        material: new PW.BasicLitMaterial({color: [1,1,1,1]})
    });
    plane.transform.position = [0,0,0];
    plane.transform.scale = [50,50,50];
    scene.add(plane);
    quat.rotateX(plane.transform.rotation, plane.transform.rotation, -Math.PI / 2);

    const cube1 = new PW.Renderable({
        mesh: new PW.CubeMesh({}),
        material: new PW.BasicLitMaterial({color: [0.902, 0.427, 0.427,1]})
    });
    cube1.transform.position = [10,1.5,10];
    cube1.transform.scale = [3,3,3];
    scene.add(cube1);

    const torus1 = new PW.Renderable({
        mesh: new PW.TorusMesh({ringSubdivisions: 60, tubeSubdivisions: 60}),
        material: new PW.BasicLitMaterial({color: [0.514, 0.69, 0.91,1]})
    });
    torus1.transform.position = [-12,0.25 * 3.0,12];
    torus1.transform.scale = [3,3,3];
    scene.add(torus1);

    const torus2 = new PW.Renderable({
        mesh: new PW.TorusMesh({ringSubdivisions: 60, tubeSubdivisions: 60}),
        material: new PW.BasicLitMaterial({color: [0.514, 0.69, 0.91,1]})
    });
    torus2.transform.position = [-15, 2.25 ,12];
    torus2.transform.scale = [3,3,3];
    quat.rotateZ(torus2.transform.rotation, torus2.transform.rotation, Math.PI / 2);
    scene.add(torus2);

    const sphere = new PW.Renderable({
        mesh: new PW.SphereMesh({resolution: 60}),
        material: new PW.BasicLitMaterial({color: [1,1,0,1]})
    });
    sphere.transform.position = [-8,0, -14];
    sphere.transform.scale = [5,5,5];
    scene.add(sphere);

    const sphere2 = new PW.Renderable({
        mesh: new PW.SphereMesh({resolution: 60}),
        material: new PW.BasicLitMaterial({color: [1,1,1,1]})
    });
    sphere2.transform.position = [9, 0.5, -8];
    sphere2.transform.scale = [1,1,1];
    scene.add(sphere2);

    const cone = new PW.Renderable({
        mesh: new PW.ConeMesh({width: 60}),
        material: new PW.BasicLitMaterial({color: [0,1,0,1]})
    });
    cone.transform.position = [12,1.5,-7];
    cone.transform.scale = [3,3,3];
    scene.add(cone);


    //Lights

    const directionalLight = new PW.DirectionalLight({color: [0.522, 0.537, 0.659, 1]});
    directionalLight.intensity = 0.2;
    directionalLight.transform.position = [-5,5,0];
    scene.add(directionalLight);

    const pointLight = new PW.PointLight({color: [0.478, 0.851, 0.11,1]});
    pointLight.transform.position = [-12,2,12];
    pointLight.fallOff = 0.65;
    pointLight.setMaxDistance(10);
    pointLight.intensity = 2;
    scene.add(pointLight);

    const pointLight2 = new PW.PointLight({color: [0.478, 0.851, 0.11,1]});
    pointLight2.transform.position = [2 ,2,-2];
    pointLight2.fallOff = 0.65;
    pointLight2.setMaxDistance(10);
    pointLight2.intensity = 2;
    scene.add(pointLight2);

    const pointLight3 = new PW.PointLight({color: [0.478, 0.851, 0.11,1]});
    pointLight3.transform.position = [14,2,12];
    pointLight3.fallOff = 0.65;
    pointLight3.setMaxDistance(10);
    pointLight3.intensity = 2;
    scene.add(pointLight3);



    const spotLight = new PW.SpotLight({color: [0.925, 0.886, 0.635,1]});
    spotLight.transform.position = [-2.38,2.78,-3.36];
    quat.rotateX(spotLight.transform.rotation, spotLight.transform.rotation, 0.565486677646163);
    quat.rotateY(spotLight.transform.rotation, spotLight.transform.rotation, 0.565486677646163);
    quat.rotateZ(spotLight.transform.rotation, spotLight.transform.rotation, 0);

    spotLight.fallOff = 0.4;
    spotLight.setMaxDistance(17);
    spotLight.setAngle(0.7);
    spotLight.penumbra = 0.5;
    spotLight.intensity = 1.8;
    scene.add(spotLight);

    const parameters= {
        viewGizmos: false,

        directionalLightActive: true,
        directionalLightColor: directionalLight.color,
        directionalLightIntensity: directionalLight.intensity,
        directionalLightX: directionalLight.transform.position[0],
        directionalLightY: directionalLight.transform.position[1],
        directionalLightZ: directionalLight.transform.position[2],

        pointLightActive: true,
        pointLightColor: pointLight.color,
        pointLightIntensity: pointLight.intensity,
        pointLightMaxDistance: pointLight.maxDistance,
        pointLightFalloff: pointLight.fallOff,

        spotLightActive: true,
        spotLightColor: spotLight.color,
        spotLightIntensity: spotLight.intensity,
        spotLightMaxDistance: spotLight.maxDistance,
        spotLightUmbra: spotLight.umbra,
        spotLightPenumbra: spotLight.penumbra,
        spotLightX: spotLight.transform.position[0],
        spotLightY: spotLight.transform.position[1],
        spotLightZ: spotLight.transform.position[2],
        spotLightXRot: 0.565486677646163,
        spotLightYRot: 0.565486677646163,
        spotLightZRot: 0,
        spotLightMaxDistance: spotLight.maxDistance,
        spotLightFalloff: spotLight.fallOff,
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
    
    const pointLightInitPos = [pointLight.transform.position[0], pointLight.transform.position[1], pointLight.transform.position[2]];
    const pointLight2InitPos = [pointLight2.transform.position[0], pointLight2.transform.position[1], pointLight2.transform.position[2]];
    const pointLight3InitPos = [pointLight3.transform.position[0], pointLight3.transform.position[1], pointLight3.transform.position[2]];
    var t = 0;
    function frame() {

        // infoElement.textContent = `\
        // fps: ${(1 / PW.Time.deltaTime).toFixed(1)}
        // `;

        pointLight.transform.position[0] = 4 * Math.sin(t) + pointLightInitPos[0];
        pointLight.transform.position[2] = 4 * Math.cos(t) + pointLightInitPos[2];
        pointLight.transform.position[1] = 0 * Math.sin(t * 0.5) + pointLightInitPos[1];

        pointLight2.transform.position[0] = 12 * Math.sin(t + Math.PI) + pointLight2InitPos[0];
        pointLight2.transform.position[2] = 12 * Math.cos(t + Math.PI) + pointLight2InitPos[2];
        pointLight2.transform.position[1] = 0.5 * Math.sin(t * 0.5 + Math.PI) + pointLight2InitPos[1];

        pointLight3.transform.position[0] = 6 * Math.sin(t + Math.PI * 2) + pointLight3InitPos[0];
        pointLight3.transform.position[2] = 6 * Math.cos(t + Math.PI * 2) + pointLight3InitPos[2];
        pointLight3.transform.position[1] = 0.5 * Math.sin(t * 0.5 + Math.PI * 2) + pointLight3InitPos[1];
        
        t += PW.Time.deltaTime;
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


    gui.add(parameters, 'viewGizmos').onChange((value) => {
        renderer.viewLightHelpers = value;
    }).name("View Gizmos");

    const directionalLightFolder = gui.addFolder('Directional Light');
    directionalLightFolder.add(parameters, 'directionalLightActive').onChange((value) => {
        if(value){
            scene.add(directionalLight);
        } else {
            scene.remove(directionalLight);
        }
    }).name("Active");
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

    const pointLightFolder = gui.addFolder('Point Light');
    pointLightFolder.add(parameters, 'pointLightActive').onChange((value) => {
        if(value){
            scene.add(pointLight);
            scene.add(pointLight2);
            scene.add(pointLight3);
        } else {
            scene.remove(pointLight);
            scene.remove(pointLight2);
            scene.remove(pointLight3);
        }
    }).name("Active");
    pointLightFolder.addColor(parameters, 'pointLightColor').onChange((value) => {
        pointLight.color = value;
        pointLight.updateGizmo();
        pointLight2.color = value;
        pointLight2.updateGizmo();
        pointLight3.color = value;
        pointLight3.updateGizmo();
    }).name('Color');
    pointLightFolder.add(parameters, 'pointLightMaxDistance', 0, 10).onChange((value) => {
        pointLight.setMaxDistance(value);
        pointLight2.setMaxDistance(value);
        pointLight3.setMaxDistance(value);
    }).name('Max Distance');
    pointLightFolder.add(parameters, 'pointLightIntensity', 0, 10).onChange((value) => {
        pointLight.intensity = value;
        pointLight2.intensity = value;
        pointLight3.intensity = value;
    }).name('Intensity');
    pointLightFolder.add(parameters, 'pointLightFalloff', 0, 1).onChange((value) => {
        pointLight.fallOff = value;
        pointLight2.fallOff = value;
        pointLight3.fallOff = value;
    }).name('Falloff');

    const spotLightFolder = gui.addFolder('Spot Light');
    spotLightFolder.add(parameters, 'spotLightActive').onChange((value) => {
        if(value){
            scene.add(spotLight);
        } else {
            scene.remove(spotLight);
        }
    }).name("Active");
    spotLightFolder.addColor(parameters, 'spotLightColor').onChange((value) => {
        spotLight.color = value;
        spotLight.updateGizmo();
    }).name('Color');
    spotLightFolder.add(parameters, 'spotLightPenumbra', 0, 1).onChange((value) => {
        spotLight.penumbra = value;
    }).name('Penumbra');
    spotLightFolder.add(parameters, 'spotLightX', -10, 10).onChange((value) => {
        spotLight.transform.position[0] = value;
    }).name('X');
    spotLightFolder.add(parameters, 'spotLightY', -10, 10).onChange((value) => {
        spotLight.transform.position[1] = value;
    }).name('Y');
    spotLightFolder.add(parameters, 'spotLightZ', -10, 10).onChange((value) => {
        spotLight.transform.position[2] = value;
    }).name('Z');
    spotLightFolder.add(parameters, 'spotLightXRot', -Math.PI, Math.PI).onChange((value) => {
        spotLight.transform.rotation = quat.create();
        quat.rotateX(spotLight.transform.rotation, spotLight.transform.rotation, value);
        quat.rotateY(spotLight.transform.rotation, spotLight.transform.rotation, parameters.spotLightYRot);
        quat.rotateZ(spotLight.transform.rotation, spotLight.transform.rotation, parameters.spotLightZRot);
    }).name('X Rotation');
    spotLightFolder.add(parameters, 'spotLightYRot', -Math.PI, Math.PI).onChange((value) => {
        spotLight.transform.rotation = quat.create();
        quat.rotateX(spotLight.transform.rotation, spotLight.transform.rotation, parameters.spotLightXRot);
        quat.rotateY(spotLight.transform.rotation, spotLight.transform.rotation, value);
        quat.rotateZ(spotLight.transform.rotation, spotLight.transform.rotation, parameters.spotLightZRot);
    }).name('Y Rotation');
    spotLightFolder.add(parameters, 'spotLightZRot', -Math.PI, Math.PI).onChange((value) => {
        spotLight.transform.rotation = quat.create();
        quat.rotateX(spotLight.transform.rotation, spotLight.transform.rotation, parameters.spotLightXRot);
        quat.rotateY(spotLight.transform.rotation, spotLight.transform.rotation, parameters.spotLightYRot);
        quat.rotateZ(spotLight.transform.rotation, spotLight.transform.rotation, value);
    }).name('Z Rotation');
    spotLightFolder.add(parameters, 'spotLightMaxDistance', 0, 20).onChange((value) => {
        spotLight.setMaxDistance(value);
    }).name('Max Distance');
    spotLightFolder.add(parameters, 'spotLightIntensity', 0, 20).onChange((value) => {
        spotLight.intensity = value;
    }).name('Intensity');
    spotLightFolder.add(parameters, 'spotLightUmbra', 0, Math.PI).onChange((value) => {
        spotLight.setAngle(value);
    }).name('Umbra');
    spotLightFolder.add(parameters, 'spotLightFalloff', 0, 1).onChange((value) => {
        spotLight.fallOff = value;
    }).name('Falloff');


}