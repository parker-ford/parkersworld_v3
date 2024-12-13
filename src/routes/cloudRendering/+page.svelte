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
	<h1 class="portfolio__title">Publication</h1>
	<div class="project__container">
		<h1 class="project__title">Real-Time Atmospheric Cloud Rendering System</h1>
		<h2 class="project__subtitle__it">Parker Ford, Kelvin Sung</h2>
		<h2 class="project__subtitle">SIBGRAPI 2024</h2>
		<!-- <h2 class="project__subtitle">DOI: 10.1109/SIBGRAPI62404.2024.10716322</h2> -->
		<p>DOI: 10.1109/SIBGRAPI62404.2024.10716322</p>
		<h3 class="project__links">
			[
			<a href="/files/Paper_CameraReady_Final.pdf">Paper</a>,
			<a href="/files/ConferencePresentation.pdf">Conference Presentation</a>,
			<a href="/files/Ford_RealTimeRenderingOfAtmosphericClouds.pdf">Thesis</a>,
			<a href="/files/ThesisPresentation.pdf">Thesis Presentation</a>
			]
		</h3>

		<div class="project__media__group">
			<video autoplay muted loop width="40%">
				<source src="/videos/cloudLighting.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			<video autoplay muted loop width="40%">
				<source src="/videos/cloudCoverage.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
		<hr class="portfolio__spacer" />

		<div class="project__description">
			<h1>Abstract</h1>

			<p>
				High-quality cloud rendering is important when creating believable virtual outdoor
				environments. However, because of the complex physical processes involved in cloud formation
				and illumination, rendering realistic clouds in real-time is challenging. Research in the
				area has targeted limited-scope issues in relative isolation and presented impressive but
				focused results. For example, solutions for cloud modeling without details on rendering, or
				approximations of specific inter-scattering illumination without details on the rendering
				framework. These isolated solutions, combined with the required advanced system knowledge
				for efficient implementation, present a high barrier for holistic exploration and
				experimentation. This paper presents a real-time cloud rendering system that integrates an
				effective cloud modeling solution [1] with an efficient implementation [2] of a volumetric
				rendering framework [3] and incorporates recent findings in inter-droplet scattering [4]
				[5]. Additionally, a novel Temporal Anti-Aliasing solution is introduced to unify and
				support independent control over the sampling of both pixel areas and volumetric intervals.
				The resulting real-time cloud rendering system exemplifies recent advancements in the field
				and can serve as a convenient starting point for further investigations into cloud formation
				and illumination.
			</p>
			<hr class="portfolio__spacer" />

			<h1>Gallery</h1>

			<div class="project__media__group">
				<img class="project__image" src="/images/thesis/cloud03.png" alt="cloud" width="50%" />
			</div>
			<div class="project__media__group">
				<img class="project__image" src="/images/thesis/cloud04.png" alt="cloud" width="50%" />
			</div>
			<div class="project__media__group">
				<img class="project__image" src="/images/thesis/cloud05.png" alt="cloud" width="50%" />
			</div>

			<div class="project__media__group">
				<img class="project__image" src="/images/thesis/cloud00.png" alt="cloud" width="25%" />
				<img class="project__image" src="/images/thesis/cloud01.png" alt="cloud" width="25%" />
				<img class="project__image" src="/images/thesis/cloud02.png" alt="cloud" width="25%" />
			</div>
		</div>
	</div>
</div>
