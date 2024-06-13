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
			<h1 class="portfolio__section__title">Projects</h1>
			<div class="portfolio__item">
				<img class="portfolio__item__image" src="images/renderer/renderer.png" alt="renderer">
				<div class="portfolio__item__content">
					<h1 class="portfolio__item__title">Preemo-Render</h1>
					<p class="portfolio__item__description">An open-source WebGPU rendering engine designed for exploring modern rendering techniques and experimenting with cutting-edge graphics technology. It is currently a work in progress.</p>
					<a class="portfolio__item__button" href=".">Learn More</a>
				</div>
			</div>
    </div>
	
</div>