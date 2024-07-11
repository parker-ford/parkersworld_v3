<script context="module">
    export const metadata = {
        title : "WebGL Ray Tracer: Simple Meshes And Lights",
        date : "07/10/2024",
        image_static: 'images/thumbnails/rayTracingLights/rayTracingLights.jpg',
		image: 'images/thumbnails/rayTracingLights/rayTracingLights.gif',
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
            <pre id="info"></pre>
            <video id="fallback-video" width="640" height="360" controls style="display: none;">
                <source src="../videos/rayTracingBeginning.mp4" type="video/mp4">
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
                This is the second post in a series I am making on my process of creating a ray tracer using the WebGPU API. The demo above is interactive, so try messing around with it. In this post, I am continuing where I left off on the <a class="project__links" href="https://raytracing.github.io/">Ray Tracing in One Weekend</a> series, although I did have to diverge a little bit to add support for OBJ models. Really, this did not end up being too much work. I was able to utilize a lot of my code from Preemo Render for models, transforms, and whatnot.
                <br><br>
                If you want to check out the code, you can find it <a href ="https://github.com/parker-ford/Preemo-Ray">here</a>.
            </p>

            <h4 class="page__sub-subtitle">LIGHTS</h4>
            <p class="page__body">
                The light itself is just a new material called an emissive. This type of light is different from the lights used in my previous post on real-time rendering. In that post, we talked about directional, point, and spot lights, in which light emanates from a single point or single direction. The problem with those lights is that they technically don't exist in the real world. In this post, we are using an area light, where light is emitted from every point on the surface of the object (in this case, a plane). This is closer to the lights we see in real life.
                <br><br>
                To apply the emission from the plane, all that is required is a slight modification to the ray tracing function. If the ray collides with an object with an emissive material, we multiply the ray color by the emissive color and the emissive strength of the object. We then conclude the ray tracing function at this point to prevent further reflection. That's it. Pretty simple, but the results are actually pretty cool!
                <br><br>
                I suspect that there is a bug somewhere in my code, however. I am thinking this because of the strange illumination pattern that is appearing on the walls of the box. It gives off a faint "M" shape, which seems pretty unusual. I will have to do further investigation on this.
                <img class="page__img" src="../images/posts/rayTracingLights/Mshape.png" alt="M Shape" width="50%"/>
                <span class="page__img__sub-text">The strange M shaped illumination pattern</span>
            </p>

            <h4 class="page__sub-subtitle">MESHES</h4>
            <p class="page__body">
                Adding support for meshes was not too difficult because I had already written most of the necessary code in my WebGPU renderer project. With a few tweaks, I was able to send the mesh data, as well as all the triangles that compose the mesh, to the GPU. A design decision I made at this point was to apply the mesh's transform on the CPU to avoid doing this in the ray tracer or having to set up a new compute pipeline. This is obviously not optimal, but it only needs to be done once at the beginning of the scene's lifetime, so I think it is fine for now. It prevents me from animating the position of objects in real time, but that was not something I had planned for this project. I may go back on this decision later, but it is not currently a high priority for me.
                <br><br>
                To actually use the mesh data in our ray tracer, we need a way to intersect a ray with a triangle, as each mesh is composed of a group of triangles. To do this, I followed the <a href="https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm" >Möller–Trumbore intersection algorithm</a>. In short, this algorithm uses barycentric coordinates to determine if the point along the ray is within the given triangle. An added benefit is that we can use the calculated barycentric coordinates to interpolate per-vertex data at the point we are calculating. This allows us to find things such as the interpolated normal or UV at any point inside the triangle. As of now, I have limited this intersection test to only pass on the front-facing sides of a triangle. This is what allows us to see through the walls of the Cornell box. I plan on making this an optional feature in the future.
                <img class="page__img" src="../images/posts/rayTracingLights/barycentric.png" alt="barycentric coordinates" width="50%"/>
                <span class="page__img__sub-text">An example of a coordinte within barycentric space. Each point is represented by 3 points denoting their proximity to each corner of the triangle</span>
            </p>

            <h4 class="page__sub-subtitle">BOUNDING BOXES</h4>
            <p class="page__body">
                I quickly found out how much the inclusion of meshes into my scenes tanked the performance. This is because, in general, a mesh will contain many triangles, and in our current implementation, each ray needs to check every triangle in the scene for intersection. If a mesh contains thousands of triangles, and we set a bounce limit of 10, each pixel ray of our image will potentially have to do tens of thousands of intersection tests every frame. That is not good. I found that even a mesh with a few hundred triangles will absolutely melt my computer. To combat this, I decided to implement mesh bounding boxes.
                <br><br>
                The idea is to define a box that encapsulates all vertices of a mesh. Then, when doing ray intersection tests, rather than immediately checking every triangle present within the scene, we first check to see if the ray intersects the mesh's bounding box. If it does not, we can skip checking all of its triangles. To do this, we need to be able to intersect a ray with an Axis Aligned Bounding Box (AABB). I follow the technique described in Chapter 1.2 of <a href="https://developer.nvidia.com/ray-tracing-gems-ii" >Ray Tracing Gems II</a>.
                <img class="page__img" src="../images/posts/rayTracingLights/boundingbox.png" alt="bounding box" width="50%"/>
                <span class="page__img__sub-text">A debug view of a model overlayed with its bounding box</span>
                This change did end up having a large boost on performance. In this Cornell Box scene, it nearly doubled the FPS. This makes sense because a large number of rays are not intersecting with anything; however, they still had to do many triangle intersection tests regardless. This doesn't help much with complicated meshes (you will notice that all the meshes in this scene are extremely simple boxes or planes) as we still would have to check each triangle within the bounding box at each intersection. This can be further optimized by implementing a Bounding Volume Hierarchy (BVH), which extends the bounding box method by having each bounding box contain two child bounding boxes. I will talk more about this in my next post as I plan to implement it soon.
            </p>

            <h4 class="page__sub-subtitle">Resources</h4>

            <p class="page__body">
                <a href="https://www.realtimerendering.com/">Ray Tracing in One Weekend - Peter Shirley, Trevor David Black, Steve Hollasch.</a>
                <br>
                <a href="https://developer.nvidia.com/ray-tracing-gems-ii">Ray Tracing Gems II - NVIDIA</a>
                <br>
                <a href="https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm">Möller–Trumbore intersection algorithm - Wikipedia</a>
                <br>
                <a href="https://mtrebi.github.io/2017/02/15/barycentric-space-i.html">Barycentric space - Mariano Trebino</a>
            </p>  
        </div>
    </div>
</div>
