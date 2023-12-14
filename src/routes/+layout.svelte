<script>
	import { onMount } from 'svelte';
	import './style.css';
	import { fade } from 'svelte/transition';
	import { bannerLoaded } from './stores.js';
	import { sceneLoaded } from './stores.js';

	let el;
	let allLoaded = false;
	bannerLoaded.set(false);

	onMount(async () => {
		try {
			const { createScene } = await import('./banner.js');
			createScene(el, () => bannerLoaded.set(true));
		} catch (e) {
			console.log('Error creating banner scene', e);
		}
	});

	$: if ($bannerLoaded && $sceneLoaded) {
    console.log('all loaded');
		allLoaded = true;
	}

</script>

<nav class="navbar">
	<div class="navbar__container">
		<canvas class="webgl" bind:this={el} />
	</div>
</nav>

{#if !allLoaded}
	<div class="loading-screen" transition:fade={{ duration: 500 }}>
		<p>Loading...</p>
	</div>
{/if}

<slot />
