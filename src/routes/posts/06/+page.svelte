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
        </div>
        <div class="page__text__container">
            <p>
                List of topics to cover:
                Transforms - translation, rotation, and scale
                Projections - view & perspective
                Buffers - object, uniform buffers
                Depth testing

            </p>


            <h3 class="page__subtitle">Transforms</h3>

            <p class="page__body">
                Previously, I had been altering the data in the vertex buffer in order to get my triangle to move.
                While this worke for a simple 2D triangle rotation, this is not a good idea for more complex object. It would get way too complicated.
                In computer graphics, typically the way you move objects around on the screen are with this thing called Transforms.
                Simply put, a transform lets us modify the positions of poitns or vectors in space.
                If you think about an image editing software you've used, such as photoshop. You've most likely dealt with transforms before.
                Imagine you've just put an image on the canvas. What are the 3 ways you can transform that image?
                You can click and drage it to a different part of the screen (translate), you can click and drag the sides of the image to change its width and height(scale), and you can click that little circle thingy and change its orientation (rotation).
                Those 3 different transforms extend from the 2D plane of your photoshop canvas, to a 3D space as well.
                In order to get around haveing to move each vertex indiviudally, we will use matrix to calculate the new postions of each vertex.
                Each different type of transform (translate, scale, rotate) can be reprsented by its own matrix.
                Scaling and Rotation are linear transforms, and for any given 3D point, we can apply these transforms with a 3x3 matrix.
                Translations are not a linear transform.
                TODO: Explain linear transform and why they matter.
                TODO: Explain affine transform and why they are stored as a 4x4 matrix
                Any sequence of affine transformations can be represented by a single affine transformation.
                


            </p>

            <h3 class="page__subtitle">Projections</h3>
        </div>
    </div>
</div>
