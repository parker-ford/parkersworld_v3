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
		<h1 class="project__title">Grand Deluxe Universal Fishing Tournament</h1>
		<h2 class="project__subtitle">A fishing RPG made in Unity</h2>
		<h3 class="project__links">
			[ <a href="https://www.youtube.com/watch?v=4klJdiya3c4">Trailer</a>]
		</h3>
		<div class="project__media__group">
			<video autoplay muted loop width="60%">
				<source src="/videos/fishing.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
		<hr class="portfolio__spacer" />
		<p class="project__description">
			This game is an underwater fishing adventure where players take on the role of a fisherman's
			hook navigating the vast ocean depths in search of strange and powerful sea creatures. Each
			dive begins with players casting their hook into the water, controlling its movement in a 3D
			environment, similar to a flight simulator. As they descend, they encounter different marine
			life, each with their own behaviors, strengths, and weaknesses. Players earn points by
			catching creatures and can spend these points to upgrade their hook's stats. The game builds
			to a final battle with a colossal boss creature, the Leviathan.
		</p>
	</div>
</div>
