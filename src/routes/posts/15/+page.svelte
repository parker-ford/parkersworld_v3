<script context="module">
	export const metadata = {
		title: 'Physically Based Rendering',
		date: '03/19/2025',
		image_static: 'images/thumbnails/pbr/pbr.jpg',
		image: 'images/thumbnails/pbr/pbr.gif',
		logo: 'images/logos/unityLogo.png'
	};
</script>

<script>
	import { onMount } from 'svelte';
	import '../../style.css';

	let el;
	let videoEl;
	import { sceneLoaded } from '../../stores.js';
	
	function updateVideoDimensions() {
		if (videoEl) {
			videoEl.width = Math.min(document.body.clientWidth, 1400);
			videoEl.height = Math.min(document.body.clientWidth, 1400) * 0.5;
		}
	}

	onMount(async () => {
		const { createScene } = await import('./scene');
		createScene(el, () => sceneLoaded.set(true));

		// Set initial dimensions
		updateVideoDimensions();

		// Update dimensions when window resizes
		window.addEventListener('resize', updateVideoDimensions);

		return () => {
			window.removeEventListener('resize', updateVideoDimensions);
		};
	});
</script>

<div class="page__main">
	<div class="page__content">
		<div class="page__canvas__container">
			<video 
				bind:this={videoEl} 
				id="fallback-video" 
				controls
			>
                <source src="../videos/PBRShowcase_lowres.mov" type="video/mp4">
                <track kind="captions">
                Your browser does not support the video tag.
            </video>
		</div>
		<div class="page__title__container">
			<h1 class="page__title">{metadata.title}</h1>
			<h5>{metadata.date}</h5>
		</div>
		<div class="page__text__container">
			<h4 class="page__sub-subtitle">Overview</h4>
			<p class="page__body">
				
				Dang, its been a minute. Since my last post on PREEMO's raytracing I've been busy finishing up my thesis, traveling, grinding the job market, and presently starting a new job as a software engineer. I've had to take a step back from PREEMO for the moment, but I still have big plans for it and I hope to get back to it soon.
				<br><br>
				Until then, I've been working on a few smaller scale projects to keep my graphics skills sharp. This is my first look into physically based rendering techniques. I will do a more in depth write up on this topic whenever I get around to adding this into my engine, but for now I just wanted to get a something posted on here.
				<br><br>
				You can see the source code the material editor application <a href="https://github.com/parker-ford/PBR-Material-Editor">here.</a>
				<br><br>
				You can also find a Unity package version <a href="https://github.com/parker-ford/ParkersPBRMaterials">here.</a>

            </p>
		</div>
	</div>
</div>
