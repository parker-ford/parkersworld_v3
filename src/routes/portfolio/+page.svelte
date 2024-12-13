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
	<h1 class="portfolio__title">Portfolio</h1>
	<div class="portfolio__container">
		<h1 class="portfolio__section__title">Publications</h1>
		<div class="portfolio__item">
			<img
				class="portfolio__item__image"
				src="images/portfolio/SIBGRAPIPortfolioThumbnail.png"
				alt="cloud"
			/>
			<div class="portfolio__item__content">
				<h1 class="portfolio__item__title">Real-Time Atmospheric Cloud Rendering System</h1>
				<h2 class="portfolio__item__subtitle">SIBGRAPI 2024</h2>
				<p class="portfolio__item__description">
					<!-- This paper presents a real-time cloud rendering solution that combines advanced techniques
					for realistic and efficient cloudscapes. It allows user-adjustable parameters and
					introduces a novel temporal anti-aliasing strategy, making it suitable for applications
					like video games and flight simulations. -->

					An atmospheric cloud simulation capable of modeling and rendering photorealistic clouds in
					real-time.
				</p>
				<a class="portfolio__item__button" href="\cloudRendering">Learn More</a>
			</div>
		</div>
		<hr class="portfolio__spacer" />
		<h1 class="portfolio__section__title">Projects</h1>
		<div class="portfolio__item">
			<img
				class="portfolio__item__image"
				src="images/portfolio/PBRPortfolioThumbnail.png"
				alt="renderer"
			/>
			<div class="portfolio__item__content">
				<h1 class="portfolio__item__title">PBR Material Editor</h1>
				<p class="portfolio__item__description">
					A real-time physically based material editor complete with implementations of several
					popular BRDFs.
				</p>
				<a class="portfolio__item__button" href="\pbrEditor">Learn More</a>
			</div>
		</div>
		<hr class="portfolio__spacer" />
		<div class="portfolio__item">
			<img
				class="portfolio__item__image"
				src="images/portfolio/PREEMOPortfolioThumbnail.png"
				alt="renderer"
			/>
			<div class="portfolio__item__content">
				<h1 class="portfolio__item__title">PREEMO Rendering Engine</h1>
				<p class="portfolio__item__description">
					An open-source WebGPU-based rendering engine created to explore modern rendering
					techniques and experiment with cutting-edge graphics technology.
				</p>
				<a class="portfolio__item__button" href="\preemoRender">Learn More</a>
			</div>
		</div>
		<hr class="portfolio__spacer" />
		<div class="portfolio__item">
			<img
				class="portfolio__item__image"
				src="images/portfolio/DragzinaPortfolioThumbnail.png"
				alt="renderer"
			/>
			<div class="portfolio__item__content">
				<h1 class="portfolio__item__title">Dragzina</h1>
				<p class="portfolio__item__description">
					An immersive AR experience for iPhone that transforms everyday spaces into a virtual
					celebration of queer identity.
				</p>
				<a class="portfolio__item__button" href="https://www.nikitashokhov.art/works/dragzina"
					>Learn More</a
				>
			</div>
		</div>
		<hr class="portfolio__spacer" />
		<div class="portfolio__item">
			<img
				class="portfolio__item__image"
				src="images/portfolio/FishingPortfolioThumbnail.png"
				alt="renderer"
			/>
			<div class="portfolio__item__content">
				<h1 class="portfolio__item__title">Grand Deluxe Universal Fishing Tournament</h1>
				<p class="portfolio__item__description">
					An action RPG where you must take control of a fisherman's hook in order to net enough
					catches to be declared champion of the universe's largest fishing tournament.
				</p>
				<a class="portfolio__item__button" href="\fishing">Learn More</a>
			</div>
		</div>
	</div>
</div>
