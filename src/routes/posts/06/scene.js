import * as PW from '$lib/ParkersRenderer'
import { quat, vec3, mat4 } from 'gl-matrix';

export const createScene = async (el, onLoaded) => {
    const fallbackVideo = document.getElementById('fallback-video');



    el.width = Math.min(document.body.clientWidth * 0.95, 1400) * .5
    el.height = Math.min(document.body.clientWidth * 0.95, 1400) * .5

    const renderer = new PW.BasicTransformRenderer(el);
    if (! await renderer.init()) {
        console.log("renderer initialization failed");
        fallbackVideo.style.display = 'block';
        fallbackVideo.width = el.width;
        fallbackVideo.height = el.height;
        el.style.display = 'none';

        onLoaded();
        const modal = document.getElementById('webgpu__modal');
        if (localStorage.getItem("hideWebGPUModal") !== "true") {
            modal.showModal();
        }
        return;
    }

    const scene = new PW.Scene();
    onLoaded();

    const triangle_rotx = new PW.BasicTriangleTransform({});
    triangle_rotx.transform.position = vec3.fromValues(-1, 1, 0);
    scene.add(triangle_rotx);
  
    const triangle_roty = new PW.BasicTriangleTransform({});
    triangle_roty.transform.position = vec3.fromValues(0, 1, 0);
    scene.add(triangle_roty);

    const triangle_rotz = new PW.BasicTriangleTransform({});
    triangle_rotz.transform.position = vec3.fromValues(1, 1, 0);
    scene.add(triangle_rotz);

    const triangle_translatex = new PW.BasicTriangleTransform({});
    triangle_translatex.transform.position = vec3.fromValues(-1, 0, 0);
    scene.add(triangle_translatex);
  
    const triangle_translatey = new PW.BasicTriangleTransform({});
    triangle_translatey.transform.position = vec3.fromValues(0, 0, 0);
    scene.add(triangle_translatey);

    const triangle_translatez = new PW.BasicTriangleTransform({});
    triangle_translatez.transform.position = vec3.fromValues(1, 0, 0);
    scene.add(triangle_translatez);

    const traingle_scalex = new PW.BasicTriangleTransform({});
    traingle_scalex.transform.position = vec3.fromValues(-1, -1, 0);
    scene.add(traingle_scalex);
  
    const traingle_scaley = new PW.BasicTriangleTransform({});
    traingle_scaley.transform.position = vec3.fromValues(0, -1, 0);
    scene.add(traingle_scaley);

    const traingle_scalez = new PW.BasicTriangleTransform({});
    traingle_scalez.transform.position = vec3.fromValues(1, -1, 0);
    scene.add(traingle_scalez);

    const camera = new PW.PerspectiveCamera({
        fov: 45,
        aspect: el.width / el.height,
        near: 0.1,
        far: 100,
    });

    camera.transform.position[2] = -4;

    scene.add(camera);


    var rotationSpeed = 1.5;
    const triangleInitPosX = triangle_translatex.transform.position;
    const triangleInitPosY = triangle_translatey.transform.position;
    const triangleInitPosZ = triangle_translatez.transform.position;
    function frame() {

        var moveValue = Math.sin(PW.Time.elapsedTime) * 0.3;
        var scaleValue = Math.sin(PW.Time.elapsedTime) * 0.5;

        quat.rotateX(triangle_rotx.transform.rotation, triangle_rotx.transform.rotation, PW.Time.deltaTime * rotationSpeed);
        quat.rotateY(triangle_roty.transform.rotation, triangle_roty.transform.rotation, PW.Time.deltaTime * rotationSpeed);
        quat.rotateZ(triangle_rotz.transform.rotation, triangle_rotz.transform.rotation, PW.Time.deltaTime * rotationSpeed);

        triangle_translatex.transform.position = vec3.fromValues(triangleInitPosX[0] + moveValue, triangleInitPosX[1], triangleInitPosX[2]);
        triangle_translatey.transform.position = vec3.fromValues(triangleInitPosY[0], triangleInitPosY[1] + moveValue, triangleInitPosY[2]);
        triangle_translatez.transform.position = vec3.fromValues(triangleInitPosZ[0], triangleInitPosZ[1], triangleInitPosZ[2] + (moveValue * 3));

        traingle_scalex.transform.scale = vec3.fromValues(1 + scaleValue, 1, 1);
        traingle_scaley.transform.scale = vec3.fromValues(1, 1 + scaleValue, 1);
        traingle_scalez.transform.scale = vec3.fromValues(1 - scaleValue, 1 - scaleValue, 1);


        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();


}