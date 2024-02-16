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
	<div class="portfolio__container">
			<h1 class="resume__title">Portfolio</h1>
            <img class="portfolio__placeholder" src="images/misc/under_construction.webp" alt="under construction">
    </div>
	<div class="portfolio__spacer"></div>
</div>