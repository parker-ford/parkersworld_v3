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

<dialog id="webgpu__modal">
	<h2 class="modal__title">WebGPU Not Enabled</h2>
    <p class="modal__text">It looks like WebGPU is not currently enabled in your browser. As a result, you will see a video recording of the demo instead of the interactive demo.</p>
    <p class="modal__text">As of writing this, WebGPU is only enabled on Chrome, Edge, and Opera on desktop.</p>
    <p class="modal__text">If you are using Firefox or Safari on desktop, you can enable WebGPU through:</p>
    <ul class="modal__list">
        <li><a href="https://www.mozilla.org/en-US/firefox/128.0a1/releasenotes/" target="_blank">The Nightly Firefox build</a></li>
        <li><a href="https://www.webkit.org/blog/14879/webgpu-now-available-for-testing-in-safari-technology-preview/" target="_blank">The Safari technology preview</a></li>
    </ul>
    <button class="modal__button" onclick="document.getElementById('webgpu__modal').close();">Okay</button>
	<div class="modal__checkbox">
		<input  type="checkbox" id="dontShowAgain" onclick="localStorage.setItem('hideWebGPUModal', this.checked ? 'true' : 'false')"> 
		<span>Don't show again</span>
	</div>
</dialog>

{#if !allLoaded}
	<div class="loading-screen" transition:fade={{ duration: 500 }}>
		<p>Loading...</p>
	</div>
{/if}

<slot />
