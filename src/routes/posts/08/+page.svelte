<script context="module">
    export const metadata = {
        title : "WebGPU Renderer: Models",
        date : "02/20/2024",
        image_static: 'images/thumbnails/models/models.jpg',
		image: 'images/thumbnails/models/models.gif',
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
            <h4 class="page__sub-subtitle">Controls</h4>

            <img class="controls__image" src="../images/icons/controls.png" alt="Transformations" />

            <h4 class="page__sub-subtitle">Overview</h4>

            <p class="page__body">
                This is the fourth post in a series I am doing on creating my own rendering engine using the WebGPU API. In this post, I document my process of adding support of .obj files into the engine. You can see this in action in the interactive demo above.
            </p>

            <h3 class="page__subtitle">OBJ Files</h3>

            <p class="page__body">
                In the last post, we saw that we were able to represent 3D geometric shapes as meshes by procedurally generating vertices to be used to create the triangles of the final mesh.
                My goal for this post is to extend that beyond just geometric shapes.I want to be able to load in 3D models.
                The way I set up my Mesh class from the last post actually lets me do this relatively easily.
                As long as I am able to get a model's vertex positions (and preferably normals and UVs), I can create a mesh from it. With this being the case, the only challenge in loading models into my engine is being able to parse the vertex data from a 3D model's file.
                <br>
                <br>
                For now, the only file type I will be supporting is the .obj file type as I found it to be very simple to parse and it is able to store all the necessary data for my mesh class. The way an .obj file is structured is very easy to understand.
                Each line begins with begins with a charcter representing the type of data that line holds. For example:
                <br>
                <br>
                - A line starting with 'v' holds the positional data of a vertex in the model. v 1.0 2.0 3.0 would represent a vertex at the position (1.0, 2.0, 3.0).
                <br>
                <br>
                - A line starting with 'vn' holds the normal data of a vertex in the model. vn 1.0 0.0 0.0 would represent a normal that points in the direction (1.0, 0.0, 0.0).
                <br>
                <br>
                - A line starting with 'vt' holds the UV data of a vertex in the model. vt 0.0 1.0 would represent a UV coordinate at the position (0.0, 1.0).
                <br>
                <br>
                There are other possible types of data that can be stored in an .obj file, but for now, I will only need these three. The last line type that is important are the lines that start with 'f'.
                These lines describe polygonal face data, or in other words, all the data that will make up a triangle in the final mesh. An example of how one of these lines looks is:                <br>
                <br>
                - f 1/1/1 2/2/2 3/3/3
                <br>
                <br>
                This line describes a triangle that is made up of 3 vertices. The first number in each set of three numbers is the index of the vertex position, the second number is the index of the UV coordinate, and the third number is the index of the normal.
                So in order to set up the vertex buffer for this triangle, all I would need to do is look up the vertex position, UV coordinate, and normal at the index of each number in the line and add it into the buffer.
                And that's really all it takes! It really is pretty amazing how fast things have progressed from simple triangles to complex meshes in such a short amount of time. This method of loading in models
                can easily be extended to other file types beyond .obj files. All it would take is for me to feel motivated enough to write a parser for that specific file type (which probably won't happen).
            </p>

            
            <h4 class="page__sub-subtitle">Resources</h4>

            <p class="page__body">
                <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file#References/">Wavefront .obj file - Wikipedia</a>
            </p>
        </div>
    </div>
</div>
