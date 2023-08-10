import * as THREE from 'three';

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(geometry, material);

//position
mesh.position.x = 0;
mesh.position.y = 0;
mesh.position.z = 1;

//scale
mesh.scale.x = 1;
mesh.scale.y = 1;
mesh.scale.z = 1;

//Rotation
mesh.rotation.y = Math.PI * 0
mesh.rotation.x = Math.PI * 0

scene.add(mesh);

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper)

const sizes = {
    width: 800,
    height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3;
scene.add(camera)

let renderer;


const animate = () => {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

export const createScene = (el) => {

    renderer = new THREE.WebGLRenderer({
        canvas: el
    })

    renderer.setSize(sizes.width, sizes.height)
    //renderer.render(scene,camera)
    animate();
}


export const updateTransform = (transform) => {
    mesh.position.set(transform.pos_x, transform.pos_y, transform.pos_z);
    mesh.scale.set(transform.scale_x, transform.scale_y, transform.scale_z)
    mesh.rotation.set(transform.rot_x * Math.PI * 2, transform.rot_y * Math.PI * 2, transform.rot_z * Math.PI * 2)
    //renderer.render(scene,camera)
}
