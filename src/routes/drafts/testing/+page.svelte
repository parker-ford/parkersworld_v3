<script context="module">
    export const metadata = {
        title : "Testing Page",
        date : "02/13/2024",
        image_static: 'images/thumbnails/placeholder/placeholder.jpg',
		image: 'images/thumbnails/placeholder/placeholder.jpg',
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
        </div>
        <div class ="page__title__container">
            <h1 class="page__title">{metadata.title}</h1>
            <h5>{metadata.date}</h5>
        </div>
        <div class="page__text__container">
            <h4 class="page__sub-subtitle">Controls</h4>

            <img class="controls__image" src="../images/icons/controls.png" alt="Transformations" />

        </div>
    </div>
</div>
