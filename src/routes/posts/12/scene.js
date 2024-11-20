import * as PRAY from '$lib/Preemo-Ray';
import { quat, vec3 } from 'gl-matrix';
import GUI from 'lil-gui';

export const createScene = async (el, onLoaded) => {
	const fallbackVideo = document.getElementById('fallback-video');

	//Initial setup
	el.width = Math.min(document.body.clientWidth, 1400);
	el.height = Math.min(document.body.clientWidth, 1400) * 0.5;

	// GUI
	const gui = new GUI();
	gui.domElement.id = 'gui';
	// gui.domElement.style.display = 'none'

	//Renderer
	const renderer = new PRAY.Renderer(el);
	if (!(await renderer.init())) {
		console.log('renderer initialization failed');
		fallbackVideo.style.display = 'block';
		fallbackVideo.width = el.width;
		fallbackVideo.height = el.height;
		el.style.display = 'none';
		gui.domElement.style.display = 'none';

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
		fov: 90,
		aspect: el.width / el.height,
		near: 0.0001,
		far: 10000,
		image_size: [el.width, el.height],
		lens_focal_length: 0.035,
		image_plane_distance: 0.05,
		fstop: 2.8,
		focal_length: 0.035
		// background_color: vec3.fromValues(0.5, 0.7, 1.0),
	});
	camera.transform.position = [0, 2.5, -8];
	scene.add(camera);

	console.log(PRAY.Material);

	//Materials
	const white_material = new PRAY.Material({
		attenuation: vec3.fromValues(180.0 / 255.0, 180.0 / 255.0, 180.0 / 255.0),
		material_flag: PRAY.Material.TYPES.LAMBERTIAN
	});
	scene.add(white_material);

	const red_material = new PRAY.Material({
		attenuation: vec3.fromValues(180.0 / 255.0, 0.0, 0.0),
		material_flag: PRAY.Material.TYPES.LAMBERTIAN
	});
	scene.add(red_material);

	const green_material = new PRAY.Material({
		attenuation: vec3.fromValues(0.0, 180.0 / 255.0, 0.0),
		material_flag: PRAY.Material.TYPES.LAMBERTIAN
	});
	scene.add(green_material);

	const emissive_material = new PRAY.Material({
		emissive_color: vec3.fromValues(180.0 / 255.0, 180.0 / 255.0, 180.0 / 255.0),
		emissive_strength: 10.0,
		material_flag: PRAY.Material.TYPES.EMISSIVE
	});
	console.log(emissive_material);
	scene.add(emissive_material);

	const dielectric_material = new PRAY.Material({
		attenuation: vec3.fromValues(1.0, 1.0, 1.0),
		refractive_index: 1.5168,
		material_flag: PRAY.Material.TYPES.DIELECTRIC
	});
	scene.add(dielectric_material);

	const metal_material = new PRAY.Material({
		attenuation: vec3.fromValues(180.0 / 255.0, 180.0 / 255.0, 180.0 / 255.0),
		metalic_fuzz: 0.1,
		material_flag: PRAY.Material.TYPES.METAL
	});
	scene.add(metal_material);

	//Meshes
	const floor_plane = new PRAY.PlaneMesh({
		width: 1,
		height: 1,
		material_id: white_material.id
	});
	floor_plane.transform.position = [0, 0, 0];
	floor_plane.transform.scale = [5, 5, 5];
	quat.rotateX(floor_plane.transform.rotation, floor_plane.transform.rotation, Math.PI / 2);
	scene.add(floor_plane);

	const back_plane = new PRAY.PlaneMesh({
		width: 1,
		height: 1,
		material_id: white_material.id
	});
	back_plane.transform.position = [0, 2.5, 2.5];
	back_plane.transform.scale = [5, 5, 5];
	scene.add(back_plane);

	const right_plane = new PRAY.PlaneMesh({
		width: 1,
		height: 1,
		material_id: green_material.id
	});
	right_plane.transform.position = [2.5, 2.5, 0];
	right_plane.transform.scale = [5, 5, 5];
	quat.rotateY(right_plane.transform.rotation, right_plane.transform.rotation, Math.PI / 2);
	scene.add(right_plane);

	const left_plane = new PRAY.PlaneMesh({
		width: 1,
		height: 1,
		material_id: red_material.id
	});
	left_plane.transform.position = [-2.5, 2.5, 0];
	left_plane.transform.scale = [5, 5, 5];
	quat.rotateY(left_plane.transform.rotation, left_plane.transform.rotation, -Math.PI / 2);
	scene.add(left_plane);

	const top_plane = new PRAY.PlaneMesh({
		width: 1,
		height: 1,
		material_id: white_material.id
	});
	top_plane.transform.position = [0, 5, 0];
	top_plane.transform.scale = [5, 5, 5];
	quat.rotateX(top_plane.transform.rotation, top_plane.transform.rotation, -Math.PI / 2);
	scene.add(top_plane);

	const front_plane = new PRAY.PlaneMesh({
		width: 1,
		height: 1,
		material_id: white_material.id
	});
	front_plane.transform.position = [0, 2.5, -2.5];
	front_plane.transform.scale = [5, 5, 5];
	quat.rotateY(front_plane.transform.rotation, front_plane.transform.rotation, Math.PI);
	scene.add(front_plane);

	const light_plane = new PRAY.PlaneMesh({
		width: 1,
		height: 1,
		material_id: emissive_material.id
	});
	light_plane.transform.position = [0, 4.9999, 0];
	light_plane.transform.scale = [1.5, 1.0, 1.5];
	quat.rotateX(light_plane.transform.rotation, light_plane.transform.rotation, -Math.PI / 2);
	scene.add(light_plane);

	const sphere = new PRAY.Sphere({
		position: [1, 1.5, -1],
		radius: 0.75,
		material_id: dielectric_material.id
	});
	scene.add(sphere);

	const cube = new PRAY.CubeMesh({
		width: 1,
		height: 1,
		material_id: white_material.id
	});
	cube.transform.position = vec3.fromValues(-1.0, 1.5, 0.75);
	cube.transform.scale = vec3.fromValues(1.5, 3.0, 1.5);
	quat.rotateY(cube.transform.rotation, cube.transform.rotation, Math.PI / 2.4);
	scene.add(cube);

	//FPS
	const infoElem = document.querySelector('#info');
	// infoElem.style.display = 'none';

	//Frame
	function frame() {
		const startTime = performance.now();
		renderer.render(scene, camera);
		requestAnimationFrame(frame);
		const jsTime = performance.now() - startTime;

		infoElem.textContent = `\
fps: ${(1 / PRAY.Time.deltaTime).toFixed(1)}
js: ${jsTime.toFixed(1)}ms
        `;
	}
	frame();

	const parameters = {
		emissive_light_color: [180.0 / 255.0, 180.0 / 255.0, 180.0 / 255.0],
		emissive_light_strength: 10.0
	};

	gui
		.addColor(parameters, 'emissive_light_color')
		.name('Emissive Light Color')
		.onChange((value) => {
			emissive_material.emissive_color = value;
			scene.has_setup_buffers = false;
			scene.parameters_updated = true;
		});
	gui
		.add(parameters, 'emissive_light_strength')
		.name('Emissive Light Strength')
		.onChange((value) => {
			emissive_material.emissive_strength = value;
			scene.has_setup_buffers = false;
			scene.parameters_updated = true;
		});

	const alignGUIWithCanvas = () => {
		const canvasRect = el.getBoundingClientRect();
		const guiRect = gui.domElement.getBoundingClientRect();
		gui.domElement.style.position = 'absolute';
		gui.domElement.style.top = `222px`;
		gui.domElement.style.left = `${canvasRect.right - guiRect.width - 2}px`;
		camera.setGui(gui);

		const infoRect = infoElem.getBoundingClientRect();
		infoElem.style.position = 'absolute';
		infoElem.style.top = '222px';
		infoElem.style.left = `${canvasRect.left}px`;
	};
	alignGUIWithCanvas();
};
