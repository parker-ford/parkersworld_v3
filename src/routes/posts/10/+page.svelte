<script context="module">
    export const metadata = {
        title : "WebGPU Renderer: Textures",
        date : "03/27/2024",
        image_static: 'images/thumbnails/textures/textures.jpg',
		image: 'images/thumbnails/textures/textures.gif',
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
                <source src="../videos/textures_noAudio.mp4" type="video/mp4">
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
                This is the sixth post in a series I am doing on creating my own renering engine using the WebGPU API. In this post I'll talk about my Texturing system. You can see this in action in the interactive demo above.
            </p>
    
            <p class="page__body">
                In the process of working on this feature of my renderer, I ran into one of those really evil bugs. One of those bugs where the only word you can really use to describe it is "Sinister". The issue was that, no matter what I tried, my textures would not seem to load. There were no errors in the console. No indication of why the textures weren't loading. Nothing. At this point, I spent hours scrutinizing every line of code even somewhat related to textures. Hours wasted... no progress was made. Eventually, I had to commit the cardinal sin of programming... I had to start to believe that the bug was not actually caused by my code. (Now you can see the sinister nature of this situation). To make a long story short, the problem had to do with my laptop's integrated graphics processor. By default, Chrome renders using the weaker, less power-hungry, Intel integrated graphics, rather than the much more powerful NVIDIA RTX GPU (which I had assumed it was using in the first place). For whatever reason (again, the WebGPU API gave no indication of this), the integrated graphics was not actually storing any image data after I had attempted to write it to the GPU.
                <br>
                <br>
                So hey... if you are not seeing any textures, try switching which GPU chrome uses.
                <br>
                <br>
                You know a bug is bad when you feel sick to your stomach even after you fix it. Sometimes I like to think bugs are evil creature-like beings and I am destroying and eradicating and smiting them for the good of humanity... Just another one of my many coping mechanisms that I have developed as a programmer.
            </p>

            <h4 class="page__sub-subtitle">Texturing</h4>
            <p class="page__body">
                Texturing is the process of modifying the surface of an object at a given position using some source of data, such as an image or a procedural function. This opens the door wide open to a bunch of cool techniques we can use to modify our object's surfaces, but for now, we will start with a very simple use case: modifying color.

                <br>
                <br>

                Texturing is typically a per-pixel operation, so the first step of the texturing process is to map a pixel to a position within the image we want to sample from. There are a bunch of ways to do this, such as utilizing the world space position of the pixel. However, one of the most common ways is to use a coordinate system that is model space, so that no matter where the model moves in the scene, a pixel on its surface will always sample from the same position in the texture. This is referred to as the object's "UVs" (in reference to the 2D axes of a texture being labeled 'u' and 'v'). Lucky for us, we already did the hard work of assigning UVs to our object's vertices back when we implemented our procedural meshes.

                
                <img class="page__img" src="../images/posts/textures/uvs.webp" alt="UVs" width="50%"/>
                <span class="page__img__sub-text">Here is a visualization of the uv coordinates of a texture</span>

                Once we have our UV coordinates, we can determine where from the texture we want to sample. The simplest way to do this is a 1:1 correspondence from texture coordinate to location within the texture. However, you can add some additional flexibility to this process by scaling the coordinates to make the texture appear bigger or smaller, or offsetting the texture coordinate to shift features of the texture to different locations. One must then consider, what happens if my scaled and offset texture coordinates go outside of the bounds of the texture locations? There are many ways to handle this, such as just clamping the extending coordinates to the edge. In this scene, for the checkerboard texture, if the texture coordinates exceed the bounds of the texture, they just wrap back around to the other side.

                <br>
                <br>


                The process of implementing this into my renderer was actually not too bad (bugs aside). It involves:
                <br>
                - First loading in the image you want to use as a texture as a bitmap.
                <br> 
                - Creating a texture on the GPU and writing the image bitmap to said texture, so the necessary data is accessible on the GPU. 
                <br>
                - Creating a Texture View, which gives us a reference to that data and how to interpret the data in our shader code. 
                <br>
                - Creating a Texture Sampler, which allows us to specify how to map texture coordinates to texture locations. Like I said before, we have already implemented support for UVs, so in the shader, it is as simple as calling a texture sample function using our sampling to retrieve a color value.

            </p>

            <h4 class="page__sub-subtitle">Mipmapping</h4>
            <p class="page__body">

                One thing that is very noticiable once you start using textures are the aliasing artifacts that begin to appear on objects that are far away. This is due to the sampling frequency of distance objects not being high enough to capture high frequency details.

                <img class="page__img" src="../images/posts/textures/artifacts.png" alt="Aliasing" width="40%"/>
                <span class="page__img__sub-text">Zooming into the edge of checkered floor, we can see the aliasing artifacts begin to appear</span>

                A common technique for mitigating these artifacts is to use a technique called mipmapping. In this technique, you recursivley store downsampled versions of the original texture. As objects get farther away from the camera, you use a lower and lower resoltion mip map. This adds a "blurring" effect to textured objects that are far away, however the result is much more appealing than the aliasing artifacts that were there before.
                
                <img class="page__img" src="../images/posts/textures/aliased.png" alt="Mipmaps" width="40%"/>
                <span class="page__img__sub-text">Here is that same portion of the checkered floor after we apply mipmapping. You can see aliasing is replaced by a smoother blur.</span>

                Side note: The mip in mipmaps stands for "multum in parvo" which means "many things in a small place" in latin. Dude. We gotta get whoever came up with this name, man. Its too good. I am already insecure enough about my naming abilities.

                <h4 class="page__sub-subtitle">Resources</h4>

                <p class="page__body">
                    <a href="https://www.realtimerendering.com/">Real-Time Rendering 4th Edition - Tomas Akenine-Moller et al.</a>
                    <br>
                    <a href="https://webgpufundamentals.org/webgpu/lessons/webgpu-importing-textures.html">Loading Images - WebGPU Fundamentals</a>
                    <br>
                    <a href="https://screamingbrainstudios.itch.io/seamless-abstract-pack">Seamless Abstract Texture Pack - Screaming Brain Studios</a>
                    <br>
                    <a href="https://learn.jettelly.com/course/unity-shader-bible/usb-chapter-1/uv-coordinates/">UV coordinate image - Jettelly</a>
                </p>            
        </div>
    </div>
</div>
