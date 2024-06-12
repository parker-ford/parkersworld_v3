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
	<h1 class="portfolio__title">Portfolio</h1>
	<div class="portfolio__container">
			<h1 class="portfolio__section__title">Publications</h1>
			<div class="portfolio__item">
				<img class="portfolio__item__image" src="images/thesis/cloud01.png" alt="cloud">
				<div class="portfolio__item__content">
					<h1 class="portfolio__item__title">Real-Time Rendering of Atmospheric Clouds</h1>
					<h2 class="portfolio__item__subtitle">University of Washington Master's Thesis</h2>
					<p class="portfolio__item__description">This paper presents a real-time cloud rendering solution that combines advanced techniques for realistic and efficient cloudscapes. It allows user-adjustable parameters and introduces a novel temporal anti-aliasing strategy, making it suitable for applications like video games and flight simulations.</p>
					<a class="portfolio__item__button" href=".">Learn More</a>
				</div>
			</div>
			<hr class = "portfolio__spacer">
			<div class="portfolio__item">
				<img class="portfolio__item__image" src="images/misc/under_construction.webp" alt="under construction">
				<div class="portfolio__item__content">
					<h1 class="portfolio__item__title">Real Time Cloud Rendering</h1>
					<p class="portfolio__item__description">This is a project that I am currently working on. It is a real time cloud rendering system that uses a combination of ray marching and ray tracing to render clouds in real time. The system is designed to be used in a game engine and is written in C++ and HLSL.</p>
					<a class="portfolio__item__button" href=".">Learn More</a>
				</div>
			</div>
			<hr class = "portfolio__spacer">
			<h1 class="portfolio__section__title">Projects</h1>
			<div class="portfolio__item">
				<img class="portfolio__item__image" src="images/misc/under_construction.webp" alt="under construction">
				<div class="portfolio__item__content">
					<h1 class="portfolio__item__title">Real Time Cloud Rendering</h1>
					<p class="portfolio__item__description">This is a project that I am currently working on. It is a real time cloud rendering system that uses a combination of ray marching and ray tracing to render clouds in real time. The system is designed to be used in a game engine and is written in C++ and HLSL.</p>
					<a class="portfolio__item__button" href=".">Learn More</a>
				</div>
			</div>
    </div>
	
</div>