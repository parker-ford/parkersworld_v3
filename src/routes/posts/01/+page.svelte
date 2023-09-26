<script>
	import { onMount } from 'svelte';
    import '../../style.css'
    import { bannerLoaded } from '../../stores.js'
    import { fade } from 'svelte/transition'
    let el;
    let sceneLoaded = false;
    let allLoaded = false;
    onMount(async () =>{
        const {createScene} = await import('./scene')
        createScene(el, () => sceneLoaded = true)
    });

    let isBannerLoaded = false;
    bannerLoaded.subscribe(value => {
        isBannerLoaded = value;
    });

    const checkAllLoaded = () => {
        if(isBannerLoaded && sceneLoaded){
            allLoaded = true;
        }
    }

    $: if(sceneLoaded){
        checkAllLoaded()
    }

    $: if(isBannerLoaded){
        checkAllLoaded();
    }

</script>

<script context="module">
    export const metadata = {
        title : "Learning ThreeJS Part 1: Scenes, Objects, Materials",
        description : "test description",
        date : "1/1/2000",
        image : "images/misc/bug.jpg"
    }
</script>

{#if !allLoaded}
<div class="loading-screen" transition:fade={{duration: 500}}>
    <p>Loading...</p>
</div>
{/if}

<div class="page__main">
    <div class = "page__content">
        <div class="page__canvas__container">
            <canvas class="page__canvas" bind:this={el}></canvas>
        </div>
        <div class ="page__title__container">
            <h1 class="page__title">{metadata.title}</h1>
        </div>
        <div class="page__text__container">
            <h3 class="page__subtitle">Scene Setup</h3>
            <p class="page__body">
                To create a scene in Three.js, you will need to first create a new instance of the THREE.Scene class. This will be the container for all the 3D objects that you want to render. Next, you will need to create a renderer, which is responsible for rendering the scene onto a 2D canvas. You can create a renderer instance using the THREE.WebGLRenderer class. 
                Once you have created the renderer, you will need to set its size using the setSize method. This method takes two arguments: the width and height of the canvas. In my implementation I set the width to be 1400 pixels, or to the width of the window if the window is less 1400 pixels wide. I set the height to be half of the width. You can also set the pixel ratio of the renderer using the setPixelRatio method, which takes a number that specifies the ratio of device pixels to CSS pixels.
                Finally, you will need to create an animation loop that updates the scene on every frame. You can do this using the requestAnimationFrame method, which takes a callback function that will be called every time the screen is refreshed. In the callback function, you can update the positions and orientations of the 3D objects in the scene, and then render the scene using the renderer's render method.
                In my scene I have also added in orbit controlls as well as a light in order to better visualize some of the material properties.
            </p>

            <h3 class="page__subtitle"> Objects </h3>
            <p class="page__body">
                In Three.js, 3D objects are composed of three main components: geometry, material, and mesh. Geometry defines the shape and structure of the object, while material defines how the object will appear when rendered. Mesh is the combination of the geometry and material, and it is what is added to the scene.
                To create a geometry in Three.js, you can use one of the built-in geometry classes such as THREE.BoxGeometry or THREE.SphereGeometry. These classes provide methods to create different shapes and structures for your 3D objects, such as boxes, spheres, cylinders, and more.
                Once you have created a geometry, you will need to create a material for your object. A material defines how the object's surface will look when rendered, including its color, reflectivity, and transparency. Three.js provides several built-in material classes such as THREE.MeshBasicMaterial and THREE.MeshLambertMaterial, as well as more advanced materials like THREE.MeshPhongMaterial and THREE.MeshStandardMaterial.
                Finally, to create a mesh, you need to combine the geometry and material. You can do this using the THREE.Mesh class, which takes a geometry and a material as arguments. Once you have created the mesh, you can add it to the scene using the add method on the scene object.
            </p>

            <h3 class="page__subtitle"> Materials </h3>
            <p class="page__body">
                A material defines the visual appearance of an object. It determines how the surface of the object will interact with light and how it will be shaded, textured, and colored. ThreeJS has many different pre defined materials that can be used.
            </p>
            <h4 class="page__sub-subtitle">Basic Material</h4>
            <p class="page__body">
                The THREE.MeshBasicMaterial is the most basic and simplest material available in Three.js. It is a non-reflective material that applies a solid color or texture to an object, without any lighting effects or shading. The material does not react to light sources or shadows, making it ideal for creating flat, unlit surfaces or wireframe models.
            </p>
            <h4 class="page__sub-subtitle">Lambert Material</h4>
            <p class="page__body">The THREE.MeshLambertMaterial is a material in Three.js that simulates a matte surface, which is a surface that scatters light evenly in all directions. This material reacts to light sources in the scene and creates diffuse shading, which means that it appears differently depending on the position and intensity of the light sources.</p>
            <h4 class="page__sub-subtitle">Phong Material</h4>
            <p class="page__body">The THREE.MeshPhongMaterial is a material in Three.js that simulates a shiny or glossy surface, such as metal or plastic. This material reacts to light sources in the scene and creates specular highlights, which are bright spots on the surface of the object where light is reflected directly.</p>
            <h4 class="page__sub-subtitle">Standard Material</h4>
            <p class="page__body">The THREE.MeshStandardMaterial is a material in Three.js that provides a physically-based rendering (PBR) approach to create realistic surface materials. This material aims to simulate the way light interacts with real-world materials and how it reflects, refracts, and scatters based on the material properties.</p>
            <h4 class="page__sub-subtitle">Toon Material</h4>
            <p class="page__body">The THREE.MeshToonMaterial is a material in Three.js that allows for the creation of cartoon-style shading on 3D objects. This material is designed to provide a simplified shading model that mimics the look of traditional cartoon animations.</p>
            <h4 class="page__sub-subtitle">Depth Material</h4>
            <p class="page__body">The THREE.MeshDepthMaterial is a material in Three.js that is used to render the depth buffer of a 3D scene. This material does not display any colors or textures, but instead renders the distance from the camera to each pixel of the object's surface as a grayscale value.</p>
            <h4 class="page__sub-subtitle">Normal Material</h4>
            <p class="page__body">The THREE.MeshNormalMaterial is a material in Three.js that is used to render the surface normals of a 3D object. This material displays a color-coded representation of the normals, where each color corresponds to a particular direction in 3D space.</p>

            <h3 class="page__subtitle"> Resources </h3>
            <p class="page__body">
                Based on: <a href="https://threejs-journey.com/">https://threejs-journey.com/</a>
            </p>
        </div>
    </div>
</div>
