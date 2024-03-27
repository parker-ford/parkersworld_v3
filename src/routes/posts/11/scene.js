import * as PW from '$lib/ParkersRenderer'
import GUI from 'lil-gui'; 
import waterColorAShader from './waterColorA.wgsl?raw';
import oldSchoolPlasmaShader from './oldSchoolPlasma.wgsl?raw';
import waves from './waves.wgsl?raw';
import swirl from './swirl.wgsl?raw';

export const createScene = async (el, onLoaded) => {

    //Initial setup
    el.width = Math.min(document.body.clientWidth, 1400);
    el.height = Math.min(document.body.clientWidth, 1400) * .5;

    const renderer = new PW.Renderer(el);
    if (! await renderer.init()) {
        console.log("renderer initialization failed");
    }

    const scene = new PW.Scene();


    //Camera
    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });
    camera.transform.position = [0, 0, -3];
    scene.add(camera);

    //GUI
    const gui = new GUI()
    gui.domElement.id = 'gui';
    const parameters= {
        shader: 'waterColorA',
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

    onLoaded();

    const uniforms = {
        color: [1, 1, 1, 1],
        ambient: 0.5,
        time: 0,
    }

    const cube = new PW.Renderable({
        mesh: new PW.CubeMesh({}),
        material: new PW.ShaderMaterial({shader: waves, uniforms: uniforms})
    });
    cube.transform.position = [-1, 1, 0];
    scene.add(cube);

    const cube2 = new PW.Renderable({
        mesh: new PW.CubeMesh({}),
        material: new PW.ShaderMaterial({shader: oldSchoolPlasmaShader, uniforms: uniforms})
    });
    cube2.transform.position = [1, 1, 0];
    scene.add(cube2);

    const cube3 = new PW.Renderable({
        mesh: new PW.CubeMesh({}),
        material: new PW.ShaderMaterial({shader: waterColorAShader, uniforms: uniforms})
    });
    cube3.transform.position = [-1, -1, 0];
    scene.add(cube3);

    const cube4 = new PW.Renderable({
        mesh: new PW.CubeMesh({}),
        material: new PW.ShaderMaterial({shader: swirl, uniforms: uniforms})
    });
    cube4.transform.position = [1, -1, 0];
    scene.add(cube4);

    const directionalLight = new PW.DirectionalLight({color: [1,1,1,1]});
    directionalLight.transform.position = [0, 1, -1];
    scene.add(directionalLight);

    gui.add(parameters, 'shader', ['waterColorA', 'oldSchoolPlasma', 'waves']).onChange((value) => {
        if (value === 'waterColorA') {
            cube.material.shader = waterColorAShader;
        } else if (value === 'oldSchoolPlasma') {
            cube.material.shader = oldSchoolPlasmaShader;
        } else if (value === 'waves') {
            cube.material.shader = waves;
        }
        // cube.material.
    });

    //Frame loop
    function frame() {
        cube.material.uniforms.time += PW.Time.deltaTime;
        cube.material.updateUniformBuffer();
        //cube2.material.uniforms.time += PW.Time.deltaTime;
        cube2.material.updateUniformBuffer();
        //cube3.material.uniforms.time += PW.Time.deltaTime;
        cube3.material.updateUniformBuffer();
        //cube4.material.uniforms.time += PW.Time.deltaTime;
        cube4.material.updateUniformBuffer();

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


}