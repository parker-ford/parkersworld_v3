<script>
	import { sceneLoaded } from '../stores.js';
	import { onMount } from 'svelte';
	import '../style.css';

	let el;
	sceneLoaded.set(false);

	onMount(async () => {
		sceneLoaded.set(true);
	});
</script>

<div class="main">
	<h1 class="portfolio__title">Project</h1>
	<div class="project__container">
		<h1 class="project__title">PBR Material Editor</h1>
		<h2 class="project__subtitle__it">Parker Ford, 2024</h2>
		<p>
			A real-time rendering application showcasing several physically based BRDF implementations,
			complete with flexible lighting and material configuration options.
		</p>
		<h3 class="project__links">
			[
			<a href="https://github.com/parker-ford/PBR-Material-Editor">GitHub</a>,
			<a href="https://www.youtube.com/watch?v=z6hTcYY6oB0">Video Demo</a>,
			<a href="https://drive.google.com/file/d/1hVonq3XQPNJjInFDGg9NX7X75FO9qYM2/view?usp=sharing"
				>Download(1.52GB)</a
			> ]
		</h3>
		<div class="project__media__group">
			<video autoplay muted loop width="60%">
				<source src="/videos/PBRShowcase_lowres.mov" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
		<hr class="portfolio__spacer" />
		<div class="project__description">
			<h1>Features:</h1>

			<h3>Physically Based BRDFs:</h3>
			<p>
				Includes implementations of several widely used physically based bidirectional reflectance
				distribution functions (BRDFs).
			</p>

			<h3>Lighting Support:</h3>
			<ul>
				<li>
					Direct Lighting: Directional lights with color, intensity, and directional controls.
				</li>
				<li>
					Image Based Lighting: Prefiltered environment maps are used for computing both diffuse and
					specular lobes. Specular lobe is approximated using Brian Karis' Split Sum technique (see
					references).
				</li>
			</ul>

			<h3>User Interface:</h3>
			<ul>
				<li>Tweak understandable material properties.</li>
				<li>Change lighting settings in real-time.</li>
				<li>Switch between different BRDF models, meshes, textures, and environments.</li>
			</ul>

			<h3>Currenly Implemented Material properties:</h3>
			<ul>
				<li>Roughness</li>
				<li>Reflectance</li>
				<li>Diffuse Color</li>
				<li>Metallic</li>
				<li>Clearcoat</li>
				<li>Clearcoat Gloss</li>
				<li>Sheen</li>
				<li>Sheen Tint</li>
				<li>Subsurface</li>
			</ul>

			<p class="image__description">Roughness value increasing from 0-1:</p>
			<img src="/images/pbr/Roughness.png" alt="pbr" />

			<p class="image__description">Reflectance value increasing from 0-1:</p>
			<img src="/images/pbr/Reflectance.png" alt="pbr" />

			<p class="image__description">Clearcoat value increasing from 0-1:</p>
			<img src="/images/pbr/Clearcoat.png" alt="pbr" />

			<p class="image__description">Metallic value increasing from 0-1:</p>
			<img src="/images/pbr/Metallic.png" alt="pbr" />

			<h3>Currenly Implemented Diffuse Models:</h3>
			<ul>
				<li>Lambertian</li>
				<li>Hammon</li>
				<li>Disney</li>
			</ul>

			<p class="image__description">Diffuse models (left to right) Lambertian, Hammon, Diney:</p>
			<img src="/images/pbr/Diffuse.png" alt="pbr" />

			<h3>Currenly Implemented Normal Distriubtion Functions:</h3>
			<ul>
				<li>GGX</li>
				<li>Beckman</li>
				<li>Blinn Phong</li>
			</ul>

			<p class="image__description">NDFs (left to right) Blinn Phong, Beckman, GGX:</p>
			<img src="/images/pbr/NDF.png" alt="pbr" />

			<h3>Currenly Implemented Geometry Attenuation Functions:</h3>
			<ul>
				<li>Beckman</li>
				<li>GGX</li>
				<li>Schlick GGX</li>
			</ul>

			<h3>Texture Support For:</h3>
			<ul>
				<li>Diffuse Mapping</li>
				<li>Normal Mapping</li>
				<li>Parallax Displacement Mapping</li>
				<li>Roughness Mapping</li>
				<li>Metallic Mapping</li>
			</ul>

			<h3>Resources:</h3>
			<ul>
				<li>Real-Time Rendering 4th Edition - Tomas Akenine-Moller et al.</li>
				<li>Real Shading in Unreal Engine 4 - Brian Karis</li>
				<li>Image-based Lighting (IBL) of PBR Materials - Thorsten Thormählen</li>
				<li>Textures, Environments, and Mehses sources from polyhaven.com</li>
			</ul>
		</div>
	</div>
</div>
