

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

    const title = "Learning ThreeJS Part3: Lights, Shadows, Fog"
    const date = "1/16/2023"
    const text_content = `
                
    `

    let code01 = 
`    const pointLight = new THREE.PointLight('#ff7d46', 1, 7);
    pointLight.position.set(0, 2.2, 2.7);
    scene.add(pointLight);
    `;
    let code02 = 
`    const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
    directionalLight.position.set(4,5,-2);
    scene.add(directionalLight)
    `;
    let code03 = 
`    const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
    scene.add(ambientLight)
    `;
    let code04 = 
`    //Allowing shadows in renderer 
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    //Setting up shadow casters and recievers
    directionalLight.castShadow = true;
    pointLight.castShadow = true;
    object.castShadow = true;
    plane.receiveShadow = true;

    //Optimizing shadow map
    directionalLight.shadow.mapSize.width = 256;
    directionalLight.shadow.mapSize.height = 256;
    directionalLight.shadow.camera.far = 7;
    `;
    let code05 = 
`    const fog = new THREE.Fog('#262837', 1, 15);
    scene.fog = fog;
    `;

</script>
<script context="module">
    export const metadata = {
        title : "Learning ThreeJS Part3: Lights, Shadows, Fog",
        description : "test description",
        image : "images/bricks/color.jpg",
        date : "1/1/2000",
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
            <h3 class="page__subtitle">Lights</h3>
            <p class="page__body">
                ThreeJS provides several different types of lights that can be used in your scenes. The lights in this scene can be better visualized by activating the Light Helpers control.
            </p>

            <h4 class="page__sub-subtitle">Point Light</h4>
            <p class="page__body">
                A point light is a position in 3D space that emits light out in all directions.
                It has a color property that defines the color of the light that is emitted and a falloff property that defines the intensity of the light as it travels.
                You can think of a point light like a light bulb. It will illuminate the space around it, but if you get far enough away, light will no longer have an effect on you.
                In this scene, the light above the door and the three ghosts haunting this scene are all represented by point lights.
                <br>
                <br>
                Heres how creating a point light looks in ThreeJS:
                <CodeSnippet bind:code="{code01}" language="javascript"/>

                The first parameter in the Point light constructor represents the color that the light will emit. The second and third parameters represent the lights falloff.
                In this example, the light will be full intensity within one unit and will gradually falloff to no intensity as it nears 7 units away. Point lights are objects,
                so they have a 3D position in the scene and must be added into the scene.

            </p>
            <h4 class="page__sub-subtitle">Directional Light</h4>
            <p class="page__body">
                A directional light does not have position, but rather an angle. This angle represents a direction that light will travel on.
                You can think of directional lights like the sun. The sun produces light rays that hit all objects on earth at the same angle.
                In this scene, the directional light is subtle because it is representing the moonlight.
                <br>
                <br>
                Heres how creating a directional light looks in ThreeJS:
                <CodeSnippet bind:code="{code02}" language="javascript"/>

                Again, the first parameter is the color of the light. Unlike a point light, a directional light does not have a falloff.
                The intesity of a directional light is always constant. The second parameter represents this intensity. While a directional light does not
                technically have a position, in ThreeJS, you can set the position of a directional light. This position is used to calculate the direction of the light.
                The direction is always from the 3D position specified to the world origin.
            </p>
            
            <h4 class="page__sub-subtitle">Ambient Light</h4>
            <p class="page__body">
                Ambient light is not really a light source such as a point light or a directional light, but rather the light that hits all objects in the scene regardless if
                that object is being directley illuminated by a light source. Without ambient light, if a point of the scene is not hit by a defined light source, it would be completley
                black, which can look pretty unappealing. Ambient light allows to control what color points of an object will be when they are not hit by any light sources.
                This can be visualized by turning on and off the Ambient Light control.
                <br>
                <br>
                Heres how creating an ambient light looks in ThreeJS:
                <CodeSnippet bind:code="{code03}" language="javascript"/>
                Again, the first parameter is the color of the ambient light, and the second parameter is its intensity.
            </p>

            <h3 class="page__subtitle">Shadows</h3>

            <p class="page__body">
                ThreeJS does not have shadows activated by default. You have to go though a few steps in order to get them working in your scene.
                First, the renderer has to be told that shadows should be activated through it's shadowMap property. Then, it needs to be told
                what type of shadow map to use. The different types of shadow maps will effect the quality of shadows and performance of the scene.
                For this scene I am using the PCFSoftShadowMap, which gives nice looking shadows with soft edges, but is a little more expensive to use
                than other shadow maps. Once you have told your renderer that shadows are going to be used, you have to denote which objects are shadow casters,
                and which are shadow recievers. Shadow casters are objects that will generate shadows while shadow recievers will be the objects in which the shadows
                are rendered onto. You will generally want all your lights to be shadow casters, plus any objects in the scene that you want to have shadows, and you will probably always want something like your ground plane to
                be a shadow reciever. With all this setup, you should now see shadows. You can further improve the performance of your scene by limiting the size of your
                light's shadow maps to be smaller.
                <br>
                <br>
                Heres an example of setting up shadows in ThreeJS:
                <CodeSnippet bind:code="{code04}" language="javascript"/>
            </p>

            <h3 class="page__subtitle">Fog</h3>
            <p class="page__body">
                Fog is an element that can be added into your scenes to help blend away harsh edges as objects get further away from the camera.
                It works by setting a fog color, and a falloff distance. As objects reach the edge of the falloff distance, their color begins to
                blend more and more with the fog color. This can be visualized by turning on and off the Show Fog control.
                <br>
                <br>
                Heres an example of enabling fog:
                <CodeSnippet bind:code="{code05}" language="javascript"/>
            </p>
            <h3 class="page__subtitle">Resources</h3>
            <p class="page__body">
                Based on: <a href="https://threejs-journey.com/">https://threejs-journey.com/</a>
                <br>
                Door Texture: <a href="https://3dtextures.me/2019/04/16/door-wood-001/">https://3dtextures.me/2019/04/16/door-wood-001/</a>
            </p>
        </div>
    </div>
</div>
