<script>
	export let data;
	import { sceneLoaded } from './stores.js';
	import { onMount } from 'svelte';
	import './style.css';

	let el;
	let visiblePosts = [];
	let currentIndex = 0;
	const POSTS_PER_LOAD = 3; // Adjust this number as needed
	let loadingMore = false;
	let observerTarget;

	sceneLoaded.set(false);

	function loadMorePosts() {
		const nextPosts = data.summaries.slice(currentIndex, currentIndex + POSTS_PER_LOAD);
		if (nextPosts.length > 0) {
			visiblePosts = [...visiblePosts, ...nextPosts];
			currentIndex += POSTS_PER_LOAD;
			loadingMore = false;
		}
	}

	onMount(async () => {
		const { createScene } = await import('../lib/mainScene/scene');
		console.log('creating scene');
		createScene(el, () => sceneLoaded.set(true));

		data.summaries.forEach(element => {
			const img = new Image();
			img.src = element.image;
		});

		// Initial load of posts
		loadMorePosts();

		// Set up intersection observer for infinite scroll
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !loadingMore && currentIndex < data.summaries.length) {
					loadingMore = true;
					loadMorePosts();
				}
			});
		}, {
			rootMargin: '100px' // Start loading slightly before reaching the bottom
		});

		if (observerTarget) {
			observer.observe(observerTarget);
		}

		return () => {
			if (observerTarget) {
				observer.unobserve(observerTarget);
			}
		};
	});
</script>

<div class="main">
	<div class="main__container">
		<div class="main__content">
			<h1 class = "biography__title">Hey, I'm Parker</h1>
			<h2 class = "biography_subtitle">and I'm addicted to programming</h2>
			<p class = "biography__body">
				<!-- Welcome to my website. This is where I document my learning process and get to show off whatever
				I am currently working on, most of which will be graphics programming related. All my stuff is
				interactive so scroll down to whatever seems interesting to you and mess around with it.
				Who knows, maybe you'll learn something new. Enjoy your stay, and thanks for dropping by. -->
				Welcome to my website. I like to make cool stuff.
				This is where I share it with the world.
				Scroll down to see what I've been working on.
				Thanks for stopping by.
				<br>
				<br>
			</p>
			<h2>My info:</h2>
			<ul class="main__content__links">
					
					<li><span role="button" tabindex="0" on:click={() => (window.location.href = "/resume")} on:keydown={() => {}} style="text-decoration: underline;">Resume</span></li>
					<li><span role="button" tabindex="0" on:click={() => (window.location.href = "/portfolio")} on:keydown={() => {}} style="text-decoration: underline;">Portfolio </span></li>
					<li><span role="button" tabindex="0" on:click={() => (window.location.href = "https://github.com/parker-ford")} on:keydown={() => {}} style="text-decoration: underline;">Github</span></li>
			</ul>

		</div>
		<div class="main__img--container">
			<canvas class="webgl" id="three__continer" bind:this={el} />
		</div>
	</div>
	<div class="posts__selector">
		<h1>Blog Posts</h1>
	</div>
	<div class="main__posts" id="main__posts">
		{#each visiblePosts as { name, description, date, image, image_static, logo, page, hovered }}
			<div
				role="button"
				tabindex="0"
				class="post"
				on:click={() => (window.location.href = page)}
				on:keydown={() => console.log('test')}
				on:mouseover={() => (hovered = true)}
				on:focus={() => (hovered = true)}
				on:mouseout={() => (hovered = false)}
				on:blur={() => (hovered = false)}
			>
				<div class="post__text">
					<p class="post__date">{date}</p>
					<h1 class="post__title">{name}</h1>
					<div class="post__tech-icons">
						<img src={logo} alt="Tech 1" />
					</div>
				</div>
				<div class="post__img__container">
					<img class="post__img" src={hovered ? image : image_static} alt="dog" />
				</div>
			</div>
		{/each}
		
		<!-- Observer target element -->
		<div bind:this={observerTarget} class="observer-target">
			{#if loadingMore}
				<p>Loading more posts...</p>
			{/if}
		</div>
	</div>
</div>
