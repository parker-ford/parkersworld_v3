import * as PRAY from '$lib/Preemo-Ray';
import { quat, vec3 } from 'gl-matrix';
import GUI from 'lil-gui';

export const createScene = async (el, onLoaded) => {
	const fallbackVideo = document.getElementById('fallback-video');

	//Initial setup
	el.width = Math.min(document.body.clientWidth, 1400);
	el.height = Math.min(document.body.clientWidth, 1400) * 0.5;

	const renderer = new PRAY.Renderer(el);
	if (!(await renderer.init())) {
		console.log('renderer initialization failed');
		fallbackVideo.style.display = 'block';
		fallbackVideo.width = el.width;
		fallbackVideo.height = el.height;
		el.style.display = 'none';
		// gui.domElement.style.display = 'none';

		onLoaded();
		const modal = document.getElementById('webgpu__modal');
		if (localStorage.getItem('hideWebGPUModal') !== 'true') {
			modal.showModal();
		}

		return;
	}

	const scene = new PRAY.Scene();
	onLoaded();

	//Camera
	const camera = new PRAY.PerspectiveCamera({
		fov: 45,
		aspect: el.width / el.height,
		near: 0.01,
		far: 10000,
		image_size: [el.width, el.height],
		lens_focal_length: 0.035,
		image_plane_distance: 0.05,
		fstop: 2.8,
		focal_length: 0.035,
		background_color: vec3.fromValues(0.5, 0.7, 1.0)
	});
	camera.transform.position = [13, 2.0, -3];
	// camera.transform.setForwardVector(vec3.subtract(vec3.create(), [0,0,0], camera.transform.position));
	quat.rotateY(camera.transform.rotation, camera.transform.rotation, -Math.PI / 2.5);
	quat.rotateX(camera.transform.rotation, camera.transform.rotation, Math.PI / 25);
	// camera.transform.lookAt([0, 0, 0]);
	scene.add(camera);

	//Materials
	const ground_material = new PRAY.Material({
		attenuation: vec3.fromValues(0.5, 0.5, 0.5),
		// attenuation: vec3.fromValues(0.8, 0.8, 0.8),
		material_flag: PRAY.Material.TYPES.LAMBERTIAN
	});
	scene.add(ground_material);

	const center_material = new PRAY.Material({
		attenuation: vec3.fromValues(0.1, 0.2, 0.5),
		material_flag: PRAY.Material.TYPES.LAMBERTIAN
	});
	scene.add(center_material);

	const right_material = new PRAY.Material({
		attenuation: vec3.fromValues(0.8, 0.8, 0.8),
		material_flag: PRAY.Material.TYPES.DIELECTRIC,
		refractive_index: 1.5
	});
	scene.add(right_material);

	const bubble_material = new PRAY.Material({
		// attenuation: vec3.fromValues(0.8, 0.8, 0.8),
		attenuation: vec3.fromValues(1.0, 1.0, 1.0),
		material_flag: PRAY.Material.TYPES.DIELECTRIC,
		refractive_index: 1.0 / 1.33
	});
	scene.add(bubble_material);

	const left_material = new PRAY.Material({
		attenuation: vec3.fromValues(0.8, 0.6, 0.8),
		material_flag: PRAY.Material.TYPES.METAL,
		metalic_fuzz: 0.0
	});
	scene.add(left_material);

	//Spheres

	const ground_sphere = new PRAY.Sphere({
		position: [0, -1000, 0.0],
		radius: 1000,
		material_id: ground_material.id
	});
	scene.add(ground_sphere);

	for (let a = -3; a < 3; a++) {
		for (let b = -3; b < 3; b++) {
			const choose_mat = Math.random();
			const center = vec3.fromValues(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());
			vec3.multiply(center, center, vec3.fromValues(3, 1, 2));
			if (vec3.length(vec3.sub(vec3.create(), center, vec3.fromValues(4, 0.2, 0))) > 0.9) {
				if (choose_mat < 1.0) {
					const mat = new PRAY.Material({
						attenuation: vec3.fromValues(
							Math.random() * Math.random(),
							Math.random() * Math.random(),
							Math.random() * Math.random()
						),
						material_flag: PRAY.Material.TYPES.LAMBERTIAN
					});
					scene.add(mat);
					const new_sphere = new PRAY.Sphere({
						position: center,
						radius: 0.2,
						material_id: mat.id
					});
					scene.add(new_sphere);
				} else if (choose_mat < 0.8) {
					const mat = new PRAY.Material({
						attenuation: vec3.fromValues(
							0.5 * (1 + Math.random()),
							0.5 * (1 + Math.random()),
							0.5 * (1 + Math.random())
						),
						material_flag: PRAY.Material.TYPES.METAL,
						metalic_fuzz: 0.5 * Math.random()
					});
					scene.add(mat);
					const new_sphere = new PRAY.Sphere({
						position: center,
						radius: 0.2,
						material_id: mat.id
					});
					scene.add(new_sphere);
				} else {
					const new_sphere = new PRAY.Sphere({
						position: center,
						radius: 0.2,
						material_id: right_material.id
					});
					scene.add(new_sphere);
				}
			}
		}
	}

	const center_sphere = new PRAY.Sphere({
		position: [0, 1.0, 0.0],
		radius: 1.0,
		material_id: right_material.id
	});
	scene.add(center_sphere);

	const right_sphere = new PRAY.Sphere({
		position: [-4.0, 1.0, 0.0],
		radius: 1.0,
		material_id: center_material.id
	});
	scene.add(right_sphere);

	const bubble_sphere = new PRAY.Sphere({
		position: [-4.0, 1.0, 0.0],
		radius: 0.8,
		material_id: bubble_material.id
	});
	// scene.add(bubble_sphere);

	const left_sphere = new PRAY.Sphere({
		position: [4.0, 1.0, 0.0],
		radius: 1.0,
		material_id: left_material.id
	});
	scene.add(left_sphere);

	//Frame
	function frame() {
		renderer.render(scene, camera);
		requestAnimationFrame(frame);
	}
	frame();

	// GUI
	// const gui = new GUI()
	// gui.domElement.id = 'gui';
	// const parameters= {
	//     lens_focal_length: camera.lens_focal_length,
	//     image_plane_distance: camera.image_plane_distance,
	//     fstop: camera.fstop,
	//     focal_length: camera.focal_length,
	// }

	// gui.add(parameters, 'lens_focal_length').onChange((value) => {
	//     scene.parameters_updated = true;
	//     camera.lens_focal_length = value;
	// });
	// gui.add(parameters, 'image_plane_distance').onChange((value) => {
	//     scene.parameters_updated = true;
	//     camera.image_plane_distance = value;
	// });
	// gui.add(parameters, 'fstop', 1, 10).onChange((value) => {
	//     scene.parameters_updated = true;
	//     camera.fstop = value;
	// });
	// gui.add(parameters, 'focal_length', 0.01, 0.1).onChange((value) => {
	//     scene.parameters_updated = true;
	//     camera.focal_length = value;
	// });

	// const alignGUIWithCanvas = () => {
	//     const canvasRect = el.getBoundingClientRect();
	//     const guiRect = gui.domElement.getBoundingClientRect();
	//     gui.domElement.style.position = 'absolute';
	//     gui.domElement.style.top = `222px`;
	//     gui.domElement.style.left = `${canvasRect.right - guiRect.width - 2}px`;
	//     camera.setGui(gui);
	// };
	// alignGUIWithCanvas();
};
