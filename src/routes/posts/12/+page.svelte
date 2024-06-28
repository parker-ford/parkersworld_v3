<script context="module">
    export const metadata = {
        title : "placeholder title",
        date : "01/01/0001",
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
            <video id="fallback-video" width="640" height="360" controls style="display: none;">
                <source src="../videos/rayTracingBeginning.mp4" type="video/mp4">
                <track kind="captions">
                Your browser does not support the video tag.
            </video>
        </div>
        <div class ="page__title__container">
            <h1 class="page__title">{metadata.title}</h1>
            <h5>{metadata.date}</h5>
        </div>
        <div class="page__text__container">
            <h4 class="page__sub-subtitle">Controls</h4>
            <img class="controls__image" src="../images/icons/controls.png" alt="Transformations" />

            <h4 class="page__sub-subtitle">Overview</h4>
            <p class="page__body">
                This is the first post in a series I am making on my process of creating a ray tracer using the WebGPU API. The demo above is interactive, so try messing around with it. I still plan on continuing to work on my other rendering engine, but working on a ray tracer was calling my name so I will probably be bouncing between both projects. This post follows the book <a href="https://www.realtimerendering.com/">Ray Tracing in One Weekend</a> by Peter Shirley, Trevor David Black, and Steve Hollasch. It is a really good introduction to ray tracing, so make sure to check that out. There are a couple of sequel books as well, and I will be looking to those as I continue to work on this project.
                <br><br>
                If you want to check out the code, you can find it <a href ="https://github.com/parker-ford/Preemo-Ray">here</a>.
            </p>

            <h4 class="page__sub-subtitle">TITLE</h4>
            <p class="page__body">
                <img class="page__img" src="../images/posts/rayTracingBeginning/raytraced.jpg" alt="raytraced iamge" width="50%"/>
                <span class="page__img__sub-text">EXAMPLE TEXT</span>


            </p>

            <h4 class="page__sub-subtitle">Resources</h4>

            <p class="page__body">
            </p>  
        </div>
    </div>
</div>
