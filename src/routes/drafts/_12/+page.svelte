

<script>
	import { onMount } from 'svelte';
    import '../../style.css'

    import hljs from 'highlight.js/lib/core'
    import javascript from 'highlight.js/lib/languages/javascript';
    import 'highlight.js/styles/default.css';
    import { sceneLoaded } from '../../stores.js';
    hljs.registerLanguage('javascript', javascript);


    let el;
    onMount(async () =>{
        const {createScene} = await import('./scene')
        createScene(el, () => sceneLoaded.set(true))
        hljs.highlightAll()
    })

    const title = "Learning ThreeJS Part2: 3D Text, Matcaps"
    const date = "1/16/2023"
    const text_content = `
                
    `

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
            <h3 class="page__subtitle">3D Text</h3>
            <p class="page__body">
                In order to create 3d text in threejs, you need to use the font loader. The font loader can load fonts that are in a typeface format. From there you can create a new textGeometry and specify its font and several other parameters. Then you can use this new geometry to create a mesh like you normally would. One thing to note is that this will place the text geometry with its bottom left point at the world origin. In order to center it on the screen, you must do a calculation based on its bounding box.
            </p>

            <p class="page__body">
                In order to create 3d text in threejs, you need to use the font loader. The font loader can load fonts that are in a typeface format. From there you can create a new textGeometry and specify its font and several other parameters.
            </p>
           <pre><code class='javascript'>
            `
                const add = (a,b) => a + b;
            `
           </code></pre>

            <h3 class="page__subtitle">Matcap Material</h3>
            <p class="page__body">
                Matcaps are a special kind of material that can be used in 3D rendering to create a unique look for objects. Instead of using traditional lighting and shading techniques, matcaps use a pre-rendered texture that is wrapped around the object's surface to create the appearance of depth and detail. These textures are designed to look like different materials, such as plastic, metal, or skin, and can be applied to a variety of objects to give them a specific look and feel. Matcaps are often used in video games and other interactive media to create a more stylized look, and they can be a great way to add personality and flair to your 3D models.
            </p>
        </div>
    </div>
</div>
