<script context="module">
    export const metadata = {
        title : "WebGPU Renderer: Textures",
        date : "03/27/2024",
        image_static: 'images/thumbnails/textures/textures.jpg',
		image: 'images/thumbnails/textures/textures.gif',
        logo: 'images/logos/webGPULogo.png',
    }
</script>

<script>
	import { onMount } from 'svelte';
    import '../../style.css'

    let el;
    import { sceneLoaded } from '../../stores.js';
    onMount(async () =>{
        const {createScene} = await import('./scene')
        createScene(el, () => sceneLoaded.set(true))
    })

</script>

<div class="page__main">
    <div class = "page__content">
        <div class="page__canvas__container">
            <canvas class="page__canvas" bind:this={el}></canvas>
            <video id="fallback-video" width="640" height="360" controls style="display: none;">
                <source src="../videos/textures_noAudio.mp4" type="video/mp4">
                <track kind="captions">
                Your browser does not support the video tag.
            </video>
        </div>
        <div class ="page__title__container">
            <h1 class="page__title">{metadata.title}</h1>
            <h5>{metadata.date}</h5>
        </div>
        <div class="page__text__container">
            <h3 class="page__subtitle">Title</h3>
        </div>
    </div>
</div>
