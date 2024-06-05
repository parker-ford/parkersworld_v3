import * as PW from '$lib/ParkersRenderer'
import GUI from 'lil-gui'; 


export const createScene = async (el, onLoaded) => {
    onLoaded();

    //Initial setup
    el.width = Math.min(document.body.clientWidth * .95, 1400);
    el.height = Math.min(document.body.clientWidth * .95, 1400) * .5;

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

    
    function generateFace(size, {faceColor, textColor, text}) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = faceColor;
        ctx.fillRect(0, 0, size, size);
        ctx.font = `${size * 0.7}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.fillText(text, size / 2, size / 2);
        return canvas;
      }

    const faceSize = 128;
    const faceCanvases = [
    { faceColor: '#F00', textColor: '#0FF', text: '+X' },
    { faceColor: '#FF0', textColor: '#00F', text: '-X' },
    { faceColor: '#0F0', textColor: '#F0F', text: '+Y' },
    { faceColor: '#0FF', textColor: '#F00', text: '-Y' },
    { faceColor: '#00F', textColor: '#FF0', text: '+Z' },
    { faceColor: '#F0F', textColor: '#0F0', text: '-Z' },
    ].map(faceInfo => generateFace(faceSize, faceInfo));
 
    // show the results
    for (const canvas of faceCanvases) {
    document.body.appendChild(canvas);
    }

    const cube = new PW.Renderable({
        mesh: new PW.CubeMesh({}),
        material: new PW.CubeMapMaterial({color: [1,0, 0,1]})
    });
    scene.add(cube);

    const directionalLight = new PW.DirectionalLight({});
    directionalLight.transform.position = [0, 2, -1];
    scene.add(directionalLight);

    //Frame loop
    function frame() {
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
        alignGUIWithCanvas();
    }
    frame();


}