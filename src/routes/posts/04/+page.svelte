

<script>
	import { onMount } from 'svelte';
    import '../../style.css'

    import hljs from 'highlight.js/lib/core'
    import javascript from 'highlight.js/lib/languages/javascript';
    import 'highlight.js/styles/default.css';
	import CodeSnippet from '../../CodeSnippet.svelte';
    hljs.registerLanguage('javascript', javascript);


    let el;
    onMount(async () =>{
        const {createScene} = await import('./scene')
        createScene(el)
        hljs.highlightAll()
    })

    const title = "Learning ThreeJS Part 4: Particles"
    const date = "1/16/2023"
    const text_content = `
                
    `

    let code01 = 
`   
    //Create particle geometry
    const pointGeometry = new THREE.BufferGeometry();

    //Initialize attribute buffers
    const count = 10000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for(let i = 0; i < count * 3; i++){
        positions[i] = (Math.random() - 0.5) * 10;;
        colors[i] = Math.random();
    }

    //Set attributes
    pointGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );
    pointGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    );

    //Create particle material
    const pointMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        color: '#ffffff',
    });
    pointMaterial.depthWrite = false;
    pointMaterial.blending = THREE.AdditiveBlending;
    pointMaterial.vertexColors = true;

    //Create particles and add to scene
    const points = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(points);
    `;

</script>
<script context="module">
    export const metadata = {
        title : "Learning ThreeJS Part 4: Particles",
        description : "test description",
        image : "images/bricks/color.jpg"
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
            <h3 class="page__subtitle">Particles</h3>
            <p class="page__body">
                Particles are objects in ThreeJS that are extremley lightweight. This means you can have many of them in a single scene without it
                effecting the performance too much. In this scene, for example, there are tens of thousands of particles. Creating particles in ThreeJS
                is similar to creating any other object, you need a geometry and material. When creating the geometry for you particles, it is best to use
                a BufferGeometry as this gives you the most control for each individual particle's attributes. For example, you can create a float32 array
                that represents the x, y, and z coordinates of each particle, and set that as the position attribute in your buffer geometry. For the material,
                you want to use PointMaterial. Here you also have the option to set paramaters such as the particle size, size attenuation, and color. Once you 
                have you geometry and material created, you can use them to create a new Points object. Additionally, there are some extra settings such as
                blending options to alter the look of your particles. In this scene I use additive blending to make clusters of stars appear brighter.
                <br>
                <br>
                Here is an example of creating particles at random positions with random colors:
                <CodeSnippet bind:code="{code01}" language="javascript"/>
            </p>
            <h3 class="page__subtitle">Resources</h3>
            <p class="page__body">
                Based on: <a href="https://threejs-journey.com/">https://threejs-journey.com/</a>
                <br>
                Particle Textures: <a href="https://www.kenney.nl/assets/particle-pack">https://www.kenney.nl/assets/particle-pack</a>
            </p>
        </div>
    </div>
</div>
