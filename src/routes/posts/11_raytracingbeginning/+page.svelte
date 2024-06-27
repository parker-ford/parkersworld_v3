<script context="module">
    export const metadata = {
        title : "WebGPU Ray Tracer: The Beginning",
        date : "06/27/2024",
        image_static: 'images/thumbnails/rayTracingBeginning/rayTracingBeginning.jpg',
		image: 'images/thumbnails/rayTracingBeginning/rayTracingBeginning.gif',
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
                This is the first post in a series I am making on my process of creating a ray tracer using the WebGPU API. The demo above is interactive, so try messing around with it. I still plan on continuing to work on my other rendering engine, but working on a ray tracer was calling my name so I will probably be bouncing between both projects. This post follows the book <a href="https://www.realtimerendering.com/">Ray Tracing in One Weekend</a> by Peter Shirley, Trevor David Black, and Steve Hollasch. It is a really good introduction to ray tracing, so make sure to check that out. There are a couple of sequel books as well, and I will be looking to those as I continue to work on this project.
                <br><br>
                If you want to check out the code, you can find it <a href ="https://github.com/parker-ford/Preemo-Ray">here</a>.
            </p>

            <h4 class="page__sub-subtitle">Ray Tracing</h4>
            <p class="page__body">
                Ray tracing is another school of rendering separate from rasterization-based rendering methods. The goal of ray tracing is often photorealism (or extremely high fidelity stylized renders), without as much concern for runtime performance as traditional rasterization rendering has. Big-budget 3D animated movies, like those made by Pixar, use ray tracing to create each frame of their film, with each frame potentially taking many hours to render.
                <br><br>
                Ray tracing works by sending out rays originating from the camera, tracing the path the ray takes through the scene as it bounces off objects, and using the data from each bounce the ray makes to determine a final color for a pixel. These rays can be thought of as light rays, and when they collide with an object, we can attempt to recreate the real-world physical light interactions that happen when a light ray scatters off an object. I will get into more detail on simulating realistic light interaction later on down the line. For now, we will keep it simple and focus on the basics.
            </p>

            <h4 class="page__sub-subtitle">Generating Rays</h4>
            <p class="page__body">
                Before we can start tracing our ray's path through our scene, we first need to generate our rays in the first place. In this first simple example, we have all of our rays originate from the camera's center, or [0, 0, 0] in camera space. The ray's direction is that from the camera origin, through the pixel we wish to determine the color for. A naive approach would be to base the ray's direction on the normalized coordinate of the pixel you are solving for; however, there are two problems with this. First, this does not account for the camera's aspect ratio and field of view. Second, the position in which this ray will intersect with this pixel is limited to a single position, which is a problem once we want to start generating multiple rays per pixel. To account for the camera's FOV and aspect ratio, the normalized coordinates of the pixel can be multiplied by the tangent of the half angle of the FOV, and divided by the aspect ratio of the camera. Additionally, the sub-pixel coordinate can be offset by some random value based on the current render iteration, allowing for different ray directions within the same single pixel range.
                <br><br>
                The last thing we need to address is the coordinate space our rays are in. Currently, we have just described them in camera space; however, the coordinates of the objects in our scene are nearly always in world space, so we want our rays to be in world space as well. We can transform our rays' coordinate space by performing a matrix multiplication on them with the Camera to World transformation matrix. In my case, I just ported over my camera code from my rendering engine and passed in the inverse of the view matrix to the shader as my Camera to World matrix.
            </p>

            <h4 class="page__sub-subtitle">Intersecting Rays with Spheres</h4>
            <p class="page__body">
                Okay, so now that we can generate rays, we need to know which objects in the scene they will intersect with. Here we can begin to see why ray tracing is typically much slower than rasterization-based rendering. For each ray we generate, we have to check each object in the scene to see if this ray intersects, and if it does, which intersection is the closest. As we continue to add objects to our scene, we will have to do more and more intersection tests for each ray (there are methods to reduce the number of unnecessary intersection tests that will be explored in a later post). In this first scene, we will only be intersecting with spheres, as they are super simple to perform intersection tests on. I won't go into detail on the mathematics behind how to perform this intersection (check out the link to Ray Tracing in One Weekend for info on this), but based on our intersection equation, for a given ray and a given sphere we can know:
                <br><br>
                - whether or not the ray intersected with the sphere
                <br>
                - the distance along the ray in which the intersection happens (if it happened at all)
                <br>
                - the position in world space in which the intersection happens
                <br>
                - the normal vector of the object at the intersection
                <br>
                - the material type of the object intersected with

                <br><br>

                In our current simple ray tracer, we need to perform this process on every single sphere in the scene to determine which intersection is the closest to the origin of the ray (if any intersection happens at all).
            </p>

            <h4 class="page__sub-subtitle">Scattering</h4>
            <p class="page__body">
                When a light intersects with a solid object, it bounces off that object and begins traveling in a new direction. This process is known as scattering. Depending on the material of the object intersected with, the directional probability of the light scattering will be different. Additionally, when the light ray collides with the object, some portion of the light will be absorbed by the surface of the object. Depending on the type of material, different amounts of different frequencies of light will be absorbed. We model this as the attenuation factor of the material, denoting what percentage of red, green, and blue frequencies are absorbed when a collision happens. The percentage of light frequencies that remain after the collision is the light we perceive as the object's color. Currently, I have modeled three different types of materials: Lambertian, Metal, and Dielectrics
            </p>

            <h4 class="page__sub-subtitle">Lambertian Material</h4>
            <p class="page__body">
                Our Lambertian material is known as a diffuse material, or in other words, when light collides, it is either absorbed or reflected in a random direction. Our material is Lambertian because it scatters light randomly in all directions. This direction is calculated by summing a random direction vector to the normal vector of the collision position.
            </p>

            <h4 class="page__sub-subtitle">Metal Material</h4>
            <p class="page__body">
                Metal materials are reflective, like a mirror. Rather than scattering in a random direction when a collision happens, a metal's scattering direction will be the reflection of the incoming ray across the collision's normal vector. In practice, this will produce a perfect mirror reflection. Metals, however, are often not perfect reflections, but rather blurry reflections due to microscopic imperfections on their surface. We can modulate how blurry the reflection will be by adding a random vector multiplied by some fuzz factor to the reflected ray. When the fuzz factor is zero, the reflection will be a perfect mirror. As the fuzz factor approaches 1, the reflection will become more and more blurry.
            </p>

            <h4 class="page__sub-subtitle">Dielectric Material</h4>
            <p class="page__body">
                A dielectric is a material that is clear, such as glass. When a light ray collides with a dielectric material, it is actually split into two new light rays: a reflected ray, and a refracted ray. Depending on the material properties, different amounts of light will be contained within each of these rays. In our case, we will not model both of these rays simultaneously, but rather randomly choose between one of them based on the properties of the material and the angle of intersection.
                <br><br>
                We model the refracted ray using Snell's Law, which states that a given material has a refractive index that determines the angle at which the refracted light ray will travel through the dielectric material based on the angle of intersection. This model, however, does not work for all refractive indices at all angles, as at a certain point, 100% of the light will be reflected, meaning no light is refracted by the material. In our case, we check to see if this angle has been reached. If it has, we only perform a reflection. If it has not, we can potentially refract the ray. The problem is, even if the angle of total reflection has not been reached, a portion of the light will still be reflected, and we need to know how to determine that. We approximate the amount using the Schlick Approximation. To be completely transparent, I do not yet fully understand how the approximation actually works, but the idea is pretty simple. Given an angle of intersection and a refractive index, the Schlick approximation will give an approximate probability that the light will be reflected rather than refracted. In our case, if this probability is met, we reflect the ray; if not, then we refract the ray.
            </p>

            <h4 class="page__sub-subtitle">Calculating Ray Color</h4>
            <p class="page__body">
                We now have all the pieces in place to create a ray-traced image. We begin by assigning a ray a color of pure white. It is fired out into the scene and checked for collision. If it does not intersect with anything, we multiply its color by a sky color. If it does intersect, we multiply the color by the attenuation factor of the material. We then set the ray origin to the point of intersection, and the direction to the calculated scattered direction. We repeat this process until the ray does not intersect with anything or some bounce limit is reached. The final ray color is assigned to its corresponding pixel.
            </p>

            <h4 class="page__sub-subtitle">WebGPU Implementation</h4>
            <p class="page__body">
                I want this ray tracer to run in "real-time," or in other words, I want it to be GPU accelerated. To do this, I used WebGPU's compute shader functionality to parallelize ray calculation on the GPU. This works really well when we are creating a single ray per pixel; however, a single ray per pixel produces images that are not very impressive. To get around this, I use a progressive refinement strategy. You will notice the quality of the image gets better and better over time (unless you move the camera). This is because the displayed image is the average of all previously rendered frames. This allows you to easily reposition the camera and tweak material parameters on the fly.
                <br><br>
                In the beginning, I did this by passing a storage texture into the compute shader and writing the calculated color directly into that texture each frame. I quickly ran into some problems with this approach. Firstly, as my progressive refinement approach requires knowing the color value of the previously rendered frame, I would need to read the storage texture at each pixel's location. The problem is that, as of now, WebGPU does not provide a storage texture that allows for both reading and writing. Because of this, I needed two storage textures, one for reading and one for writing. After each frame, I would need to copy the contents of the write texture into the read texture, which was inefficient, annoying, and just straight-up ugly. Also, the format of the storage texture was rgba-unorm8, or 8 bits for each RGBA value normalized to 0-1. This worked okay at first, but I soon found that after some time, the image quality just stopped improving, and I could never get a fully clear image. I came to the conclusion that this had to do with precision errors associated with this data type. I needed more bits.
                <br><br>
                The solution was to switch from using a storage texture to using a storage array of vec3s. This ended up being a much cleaner solution, as a storage array can be read-write, eliminating the need for two storage buffers, and it allows for more precision, leading to much higher quality renders.
            </p>

            <h4 class="page__sub-subtitle">Resources</h4>

            <p class="page__body">
                <a href="https://www.realtimerendering.com/">Ray Tracing in One Weekend - Peter Shirley, Trevor David Black, Steve Hollasch.</a>
                <br>
            </p>  
        </div>
    </div>
</div>
