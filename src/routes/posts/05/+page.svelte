<script context="module">
    export const metadata = {
        title : "WebGPU Renderer: The Graphics Pipeline",
        date : "12/21/2023",
        image_static: 'images/thumbnails/renderPipeline/renderPipeline.jpg',
		image: 'images/thumbnails/renderPipeline/renderPipeline.gif',
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
        </div>
        <div class ="page__title__container">
            <h1 class="page__title">{metadata.title}</h1>
            <h5>{metadata.date}</h5>
        </div>
        <div class="page__text__container">

            <h4 class="page__sub-subtitle">Overview</h4>

            <p class="page__body">
                This is the first post in a series I am doing on creating my own renering engine using the WebGPU API. The goal of this project is to learn as much as I can about how a real-time rendering system works. I hope to use this series as a way to explore as many topics as I can relating to rendering. 
            </p>

            <h3 class="page__subtitle">What is the Graphics Pipeline?</h3>

            <p class = "page__body">

                The graphics pipeline is how graphics programmers describe the process of turning pieces of data (such as 3D objects, cameras, light sources) into a 2D image that can be viewed on a screen.
                If you think about a video game, the data it contains could be the player character, the map you are in, the position of the character on the map, etc. All of that data somehow needs to be turned into a visual image on your screen so you can understand what is happening in the game.
                Not only that, but these images need to be created at an extremely high rate for the player to feel like they can interact with it in real-time.
                The graphics pipeline is designed in such a way to facilitate the need for rendering all these images at such a high rate.
                <br>
                <br>
                A pipeline in this context can be thought of as a series of stages, each given a specific input. They perform some operation on that input and then pass it on to the next stage, with each stage operating simultaneously with the others.
                The concept of a pipeline structure is not unique to the world of graphics; in fact, it's quite common in any area where efficiency in product creation is crucial.
                For example, in a factory that produces cars, there might be a pipeline that starts with a frame, then adds the engine, the wheels, the seats, and so on. Each stage has a specific worker performing their task, focusing on it while others concentrate on their respective tasks.
                When executed correctly, the advantage of a pipeline structure is that it allows for the rapid completion of a product from input to output.
                If, instead of using a pipeline system, car manufacturers relied on a single worker to create every part of the car, the same number of cars might be produced by the end of the day. However, it would take that worker all day to assemble one car. With a pipeline, a car can be assembled in about an hour.
                <br>
                <br>
                This all still applies to the graphics pipeline. The difference is that instead of the input being raw materials and the output being a car, the input is data, and the output is an image.
                In general, the stages of the graphics pipeline are: the application stage, the geometry processing stage, the rasterization stage, and the pixel processing stage. In the following sections, I will go over each individually.

            </p>


            <img class = "page__img" src="../images/posts/05/graphics_pipeline.png" alt="Graphics pipeline" width="75%">


            <h3 class="page__subtitle">Application Stage</h3>

            <p class = "page__body">
                The application stage is the first stage in the graphics pipeline. This stage is unique from the other stages in the pipeline as it is completely developer-controlled and runs on the CPU, as opposed to the other stages, which run on the GPU.
                The goal of this stage is to collect the data that represents your eventual 2D image and send it to the next stage on the GPU so the rendering process can begin.
                In the context of the scene you are seeing on this page, the data I am collecting includes the positions of the three points of the triangles and the color of each of those points. This data is all compacted into a buffer, and that buffer is what is sent to the next stage: the geometry processing stage.
            </p>

            <h3 class="page__subtitle">Geometry Processing Stage</h3>

            <p class = "page__body">
                The next stage of the pipeline is the geometry processing stage. The goal of this stage is to determine where a given vertex should be placed on the screen.
                This stage can be divided into multiple sub-stages. The first sub-stage is the vertex shading stage, which is fully programmable, meaning that it can be completely controlled by the developer.
                The way you control this stage is with a program known as a vertex shader. A vertex shader allows you to write code that can be run by the GPU. The goal of this vertex shader is to perform positional operations on vertices to change where they appear on the screen.
                Another goal of the vertex shader is to assign per-vertex data that will be used in later portions of the pipeline. In this example, no changes to the vertex data are made in the vertex shader. The position and color of each vertex are set in the application stage
                However, I could extend this vertex shader to move each vertex of the triangle in a certain way, for example, each vertex could be moved gradually up and down in a wave pattern. Or perhaps another example could be having each vertex of a sphere be displaced by some ammount giving it a 'bumpy' appearance.

                <img class = "page__img" src="../images/posts/05/Noisy_sphere.gif" alt="Bumpy sphere" width="35%">

                After the vertex shahding stage, there are a few optional sub stages that can take place: the tesselation stage and the geometry stage. I will not be going over these stages here because they have more niche use cases and also at the time of writing this, they are not available for use in the WebGPU API.
                <br>
                <br>
                After the optional stages, the next stage is the clipping stage. The purpose of this stage is to remove any pieces of data that will not be viewable in the final image. For example, if the triangle we are viewing were behind the camera, there would be no point in processing the vertices because we can't see them, and they would not affect the final image.
                This stage is not programmable by the developer; it is entirely up to the hardware manufacturer how this stage is implemented. However, the final result will always be the same: only the vertices viewable by the camera are retained.
                <br>
                <br>
                The last stage is another non-programmable stage: the screen mapping stage. Because each screen on which we view our final image may be of a potentially different size, it's necessary for our vertices to appear in the correct position regardless of the screen's dimensions. This is exactly what the screen mapping stage does.
                It takes the dimensions of the screen into account and maps the vertices to their correct positions based on this information.
                This is the last step in the geometry processing stage, and the processed data is then sent on to the rasterization stage.
            </p>

            <h3 class="page__subtitle">Rasterization Stage</h3>
            
            <p class = "page__body">
                So far in the pipeline, you may have noticed that we have only been mentioning vertices and how each individual vertex is processed. It is the job of this stage, the rasterization stage, to take the three vertices that represent the triangle and determine which pixels should be used to represent it.
                In other words, this stage's job is to identify which pixels lie within our three vertices.
                This stage is non-programmable, so you don't have to worry about doing this yourself; it is handled by the GPU. The output of this stage is data tied to each pixel that has been found to be within the triangle.
                
                <img class = "page__img" src="../images/posts/05/rasterization.png" alt="Rasterization" width="60%">

                What's cool about this stage is that it doesn't just determine which pixels are within the triangle; it also interpolates the data that the pixel should have between the vertices. For example, in the application stage, I specified only three total colors, one for each vertex. However, you can see in the render that the colors are blended throughout the triangle. This blending occurs because the rasterizer interpolates color values based on the pixel's position within the triangle.
                Once all this data has been processed, it is passed on to the next stage: the pixel processing stage.
            </p>

            <h3 class="page__subtitle">Pixel Processing Stage</h3>

            <p class="page__body">
                The final stage of the rendering pipeline is the pixel processing stage, which can also be divided into sub-stages. The first of these is the pixel shading sub-stage, similar to the geometry shading stage in that it is fully programmable. This stage is controlled by a program called a pixel (or fragment) shader.
                While in the geometry shading stage we were writing a program to control the position of a vertex, in this stage, our shader is controlling the color of a pixel. There are many techniques that can be implemented to achieve really cool effects in the pixel shader, which I will explore in future posts.
                For this example, the fragment shader is very simple; it just outputs the color it received from the rasterization stage. If I wanted, I could manipulate the color value in this shader, such as dimming or brightening the colors, or even adding a cool rainbow effect. We'll delve into more complex uses of the fragment shader soon.

                <img class = "page__img" src="../images/posts/05/rainbow_triangle.gif" alt="Rainbow Triangle" width="20%">

                Once we have determined a pixel color through the fragment shader, the last step is to pass it to the final sub-stage: the merging stage. The merging stage controls how a given pixel's color is displayed in the final image. In this stage, we work with what is called a screen buffer, which can be thought of as a large 2D array that stores a color value for each pixel on the screen.
                However, after the pixel-shader outputs a color for that pixel position, we can't simply add that color to the color buffer.
                For instance, if the triangle we are rendering is behind another triangle already rendered into the screen buffer, the pixel color we just calculated can be disregarded because it won't be seen in the final image.
                This stage isn't fully programmable, but it is highly configurable. There are many different ways to manage how values in the screen buffer are set. For example, instead of just setting the color value at a given pixel, you could blend that color with the value already stored there.
                This is all handled by the merging configuration.In the end, you should have a screen buffer with a color value at each index. This buffer is then displayed on the screen as a 2D image. And with that, we have reached the end of the graphics pipeline!
            </p>

            <h4 class="page__sub-subtitle">Resources</h4>
            <p class="page__body">
                <a href="https://www.realtimerendering.com/">Real-Time Rendering 4th Edition - Tomas Akenine-Moller et al.</a>
                <br>
                <a href="https://en.wikipedia.org/wiki/Geometry_processing">Geometry Processing - Wikipedia</a>
                <br>
                <a href="https://jtsorlinis.github.io/rendering-tutorial/">Rasterising a triangle - Jason Tsorlinis</a>
                <br>
                <a href="https://www.deviantart.com/10binary/art/rainbow-triangle-tunnel-286748152">rainbow triangle tunnel - 10binary</a>
            </p>

        </div>
    </div>
</div>
