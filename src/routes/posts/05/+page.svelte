<script context="module">
    export const metadata = {
        title : "placeholder",
        date : "01/01/0001",
        image_static: 'images/thumbnails/placeholder/placeholder.jpg',
		image: 'images/thumbnails/placeholder/placeholder.jpg',
        logo: 'images/logos/threeJSLogo.png',
    }
</script>

<script>
	import { onMount } from 'svelte';
    import '../../style.css'

    let el;
    import { sceneLoaded } from '../../stores.js';
    onMount(async () =>{
        const {createScene} = await import('./helloGraphics')
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
        </div>
        <div class="page__text__container">
            <h3 class="page__subtitle">Title</h3>
        </div>
    </div>
</div>
