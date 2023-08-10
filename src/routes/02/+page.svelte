

<script>
    import { onMount } from 'svelte';
    import '../style.css'
	// import javascript from 'highlight.js/lib/languages/javascript';
    import CodeSnippet from '../CodeSnippet.svelte';
    let el;
    onMount(async () =>{
        const {createScene} = await import('./scene')
        createScene(el)
    })

    const title = "Learning ThreeJS Part2: 3D Text, Matcaps"
    const date = "1/16/2023"
    const text_content = `
                
    `

    let code01 = 
`    const fontLoader = new FontLoader();
    fontLoader.load(
        fonts["path-to-font"],
        (font) => {
            textGeometry = new TextGeometry(
                parameters.text,
                {
                    font: font,
                    size: 0.5,
                    height: 0.2,
                    curveSegments: 6,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelSegments: 3
                }
            );
        }
    )
    `;

    let code02 = 
`    textMesh = new THREE.Mesh(textGeometry, material);
    scene.add(textMesh);
    `;

    let code03 = 
`    textGeometry.computeBoundingBox()
    textGeometry.translate(
        - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        - (textGeometry.boundingBox.max.z - 0.03) * 0.5,

    )
    `;

    

</script>

<svelte:head>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism.min.css" rel="stylesheet" />
</svelte:head>

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
            <CodeSnippet bind:code="{code01}" language="javascript"/>

            <p class="page__body">
                Then you can use this new geometry to create a mesh like you normally would.
            </p>
            <CodeSnippet bind:code="{code02}" language="javascript"/>

            <p class="page__body">
                One thing to note is that this will place the text geometry with its bottom left point at the world origin. In order to center it on the screen, you must do a calculation based on its bounding box.
            </p>
            <CodeSnippet bind:code="{code03}" language="javascript"/>

            <h3 class="page__subtitle">Matcap Material</h3>
            <p class="page__body">
                Matcaps are a special kind of material that can be used in 3D rendering to create a unique look for objects. Instead of using traditional lighting and shading techniques, matcaps use a pre-rendered texture that is wrapped around the object's surface to create the appearance of depth and detail. These textures are designed to look like different materials, such as plastic, metal, or skin, and can be applied to a variety of objects to give them a specific look and feel.
                They allow for a performant lighting simulation without the need of an actual lighting setup.
                <br>
                <br>
                Here is an example of what a Matcap texture looks like:
                <br>
                <br>
                <img src="/images/matcaps/matcap_2.png" alt="Example matcap texture" width="128">
                <br>


            </p>
            <h3 class="page__subtitle">Resources</h3>
            <p class="page__body">
                Based on: <a href="https://threejs-journey.com/">https://threejs-journey.com/</a>
                <br>
                Matcap textures sourced from: <a href="https://github.com/nidorx/matcaps">https://github.com/nidorx/matcaps</a>
            </p>
        </div>
    </div>
</div>
