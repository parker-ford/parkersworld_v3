

<script>
	import { onMount } from 'svelte';
    import '../../style.css'

    import hljs from 'highlight.js/lib/core'
    import javascript from 'highlight.js/lib/languages/javascript';
    import 'highlight.js/styles/default.css';
    hljs.registerLanguage('javascript', javascript);


    let el;
    onMount(async () =>{
        const {createScene} = await import('./scene')
        createScene(el)
        hljs.highlightAll()
    })

    const title = "Learning ThreeJS Part2: 3D Text, Matcaps"
    const date = "1/16/2023"
    const text_content = `
                
    `

</script>
<script context="module">
    export const metadata = {
        title : "Cellular Automota: Game of Life Cellular Automota: Game of Life Cellular Automota: Game of Life",
        description : "test description",
        date : "1/1/2000",
        image : "images/misc/bug.jpg"
    }
</script>

<div class="page__main">
    <div class = "page__content">
        <div class="page__canvas__container">
            <canvas class="page__canvas" bind:this={el}></canvas>
        </div>
        <div class ="page__title__container">
            <h1 class="page__title">{title}</h1>
        </div>
        <div class="page__text__container">
        </div>
    </div>
</div>
