<script>
	import { sceneLoaded } from '../stores.js';
	import { onMount } from 'svelte';
	import '../style.css';

	let el;
	sceneLoaded.set(false);

	onMount(async () => {
		sceneLoaded.set(true)
	});
</script>
<div class="main">
	<h1 class="portfolio__title">Publication</h1>	
	<div class="project__container">
		<h1 class="project__title">Real-Time Rendering of Atmospheric Clouds</h1>
		<h2 class="project__subtitle">University of Washington Master of Science Thesis, June 2024</h2>
		<h2 class="project__subtitle">Parker Ford</h2>
		<h3 class="project__links">[ <a href="/files/Ford_RealTimeRenderingOfAtmosphericClouds.pdf">Thesis</a>, <a href="/files/ThesisPresentation.pdf">Presentation</a> ]</h3>

		<div class="project__media__group">
			<video autoplay muted loop width="40%">
				<source src="/videos/cloudLighting.mp4" type="video/mp4" >
				Your browser does not support the video tag.
			</video>
	
			<video autoplay muted loop width="40%">
				<source src="/videos/cloudCoverage.mp4" type="video/mp4">
				Your browser does not support the video tag.
			</video>
		</div>
		<hr class = "portfolio__spacer">
		
		<h2 class="project__subtitle"><strong>Abstract</strong></h2>

		<p class="project__description">
			Rendering realistic clouds is an important aspect of creating believable virtual worlds. The detailed shapes and complex light interactions present in clouds make this a daunting task to complete in a real-time application. Our solution, based on Schneider’s cloud modeling and Fong’s volumetric rendering frameworks for low-altitude cloudscapes, supports realism and real-time performance. For efficient approximations of radiance measurements, we adopt Hillaire’s energy-conserving integration method for light scattering.
			<!-- <img class="project__image" src="/images/thesis/cloud03.png" alt="cloud" width="25%"> -->
			To simulate the effect of multiple light scattering, we followed Wrenninge's approach for computing the multi-bounce diffusion of light within a volume. To capture the details of light interreflection off microscopic water droplets, the complex behavior of Mie scattering is approximated with Jenderise and d’Eon’s phase function modeling technique. To capture the details with nominal computational cost, we introduce a
			temporal anti-aliasing strategy that unifies the sampling strategy for the area over a pixel and interval of volumetric participating media.
			<br><br>
			The resulting system is capable of rendering scenes consisting of expansive cloudscapes well within real-time requirements, achieving frame rates between 2 and 3 milliseconds on a typical machine. Users can adjust parameters to control various types of low-altitude cloud formations and weather conditions, with presets available for easily transitioning between settings. Our unique combination of techniques adopted in the volumetric rendering process enhances both efficiency and visual fidelity where the novel approach to volumetric temporal anti-aliasing efficiently and effectively unifies the sampling of pixel areas and volumetric intervals. Looking forward, this technique could be adapted for real-time applications such as video games or flight simulations. Further improvements could refine the cloud modeling system, incorporating procedural generation for high-altitude clouds, thus broadening the range of cloudscapes that can be represented. Additionally, our volumetric rendering framework could be paired with recent investigations into voxel-based cloud rendering.
		</p>

		<hr class = "portfolio__spacer">

		<h2 class="project__subtitle"><strong>Gallery</strong></h2>

		<div class="project__media__group"> <img class="project__image" src="/images/thesis/cloud03.png" alt="cloud" width="50%"> </div>
		<div class="project__media__group"> <img class="project__image" src="/images/thesis/cloud04.png" alt="cloud" width="50%"> </div>
		<div class="project__media__group"> <img class="project__image" src="/images/thesis/cloud05.png" alt="cloud" width="50%"> </div>
		
		<div class="project__media__group">
			<img class="project__image" src="/images/thesis/cloud00.png" alt="cloud" width="25%">
			<img class="project__image" src="/images/thesis/cloud01.png" alt="cloud" width="25%">
			<img class="project__image" src="/images/thesis/cloud02.png" alt="cloud" width="25%">
		</div>
		
	</div>
</div>