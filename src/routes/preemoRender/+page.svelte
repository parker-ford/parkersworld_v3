<script>
	import { sceneLoaded } from '../stores.js';
	import { onMount } from 'svelte';
	import '../style.css';

	let el;
	sceneLoaded.set(false);

	onMount(async () => {
		sceneLoaded.set(true);
	});
</script>

<div class="main">
	<h1 class="portfolio__title">Project</h1>
	<div class="project__container">
		<h1 class="project__title">PREEMO</h1>
		<h2 class="project__subtitle__it">Parker Ford, 2024</h2>
		<p>
			An open-source WebGPU-based rendering engine created to explore modern rendering techniques
			and experiment with cutting-edge graphics technology.
		</p>
		<h3 class="project__links">
			[ <a href="https://github.com/parker-ford/PREEMO">GitHub</a>]
		</h3>
		<div class="project__media__group">
			<video autoplay muted loop width="40%">
				<source src="/videos/lights.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			<video autoplay muted loop width="40%">
				<source src="/videos/textures_noAudio.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
		<hr class="portfolio__spacer" />
		<div class="project__description">
			<!-- <p class="project__description">
				<br /><br />

				Feel free to try Preemo-Render out for yourself at the GitHub link above, or you can try out
				some of the demos I have posted on my blog below.

				<br /><br />
				Features currently implemented: <br />
				- Transforms [<span class="project__links"><a href="/posts/06">demo</a></span>] <br />
				- Procedural Meshes [<span class="project__links"><a href="/posts/07">demo</a></span>]
				<br />
				- Material System [<span class="project__links"><a href="/posts/07">demo</a></span>] <br />
				- OBJ Model Loading [<span class="project__links"><a href="/posts/08">demo</a></span>]
				<br />
				- Lighting [<span class="project__links"><a href="/posts/09">demo</a></span>] <br />
				- 2D Texutres [<span class="project__links"><a href="/posts/10">demo</a></span>] <br />
				- CubeMap Textures [<span class="project__links"><span>demo under construction</span></span
				>]
				<br />
				- Skyboxes [<span class="project__links"><span>demo under construction</span></span>] <br />
				- Procedural Noise [<span class="project__links"><span>demo under construction</span></span
				>]
				<br />

				<br /><br />
				Features in progress: <br />
				- Shadows <br />
				- Physically Based Rendering and Materials
			</p> -->
			<h1>Description</h1>
			<p>
				Preemo-Render is a WebGPU rendering engine that I have been developing in my spare time
				since January 2024. I created this engine to familiarize myself with modern graphics APIs
				and to experiment with implementing various graphics papers and techniques. I chose the
				WebGPU API because I wanted to allow people to interact with my graphics projects directly
				on my website in real-time and not have to download any executable files. WebGPU, unlike its
				contemporary API WebGL, supports the dispatchment of compute shaders, which I intend to use
				in future experiments. Additionally, it shares similarities with modern graphics APIs such
				as Vulkan and is poised to become the standard web graphics API (eventually). The downside
				of using WebGPU is, due to its newness, it isn't fully integrated into all browsers yet
				(Hopefully this will be less of a problem as time goes on).
			</p>
			<h3>Features currently implemented:</h3>
			<ul>
				<li>Transforms [<span class="project__links"><a href="/posts/06">demo</a></span>]</li>
				<li>
					Procedural Meshes [<span class="project__links"><a href="/posts/07">demo</a></span>]
				</li>
				<li>Material System [<span class="project__links"><a href="/posts/07">demo</a></span>]</li>
				<li>
					OBJ Model Loading [<span class="project__links"><a href="/posts/08">demo</a></span>]
				</li>
				<li>Lighting [<span class="project__links"><a href="/posts/09">demo</a></span>]</li>
				<li>2D Texutres [<span class="project__links"><a href="/posts/10">demo</a></span>]</li>
				<li>
					CubeMap Textures [<span class="project__links"><span>demo under construction</span></span
					>]
				</li>
				<li>Skyboxes [<span class="project__links"><span>demo under construction</span></span>]</li>
				<li>
					Procedural Noise [<span class="project__links"><span>demo under construction</span>]</span
					>
				</li>
			</ul>

			<h3>Features in progress:</h3>
			<ul>
				<li>Shadows</li>
				<li>PBR Materials</li>
			</ul>

			<hr class="portfolio__spacer" />

			<h1>Gallery</h1>

			<div class="project__media__group">
				<img class="project__image" src="/images/preemo/preemo1.png" alt="preemo" width="50%" />
			</div>
			<div class="project__media__group">
				<img class="project__image" src="/images/preemo/raytracer.png" alt="preemo" width="50%" />
			</div>
			<div class="project__media__group">
				<img class="project__image" src="/images/preemo/preemo2.png" alt="preemo" width="50%" />
			</div>
			<div class="project__media__group">
				<img class="project__image" src="/images/preemo/preemo3.png" alt="preemo" width="50%" />
			</div>
		</div>
	</div>
</div>
