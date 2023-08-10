<script>
	import { onMount } from 'svelte';
    import '../style.css'
    let el;
    onMount(async () =>{
        const {createScene} = await import('./scene')
        createScene(el)
    })

    const title = "Geometries"
    const date = "1/16/2023"
    const text_content = `
        There are many different kinds of geometries built into threejs
        Geometries can be created using buffer geometries.
        In order to do this you must first created a Float32Array. This will store the xyz coordinates for each of our geometries vertices
        This array can then be converted into a BufferAttribute. This attribute can be added as the position attribute for a buffergeometry object
    `

</script>

<div class="page__main">
    <div class = "page__content">
        <div class ="page__title__container">
            <h1 class="page__title">{title}</h1>
        </div>
        <div class="page__canvas__container">
            <canvas bind:this={el}></canvas>
        </div>
        <div class="page__text_container">
            <p>
                {text_content}
            </p>
        </div>
    </div>
</div>
