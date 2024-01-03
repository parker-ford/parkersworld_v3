<script>
	export let data;
	import { sceneLoaded } from './stores.js';
	import { onMount } from 'svelte';
	import './style.css';

	let el;
	sceneLoaded.set(false);

	onMount(async () => {
		const { createScene } = await import('../lib/scene');
		console.log('creating scene');
		createScene(el, () => sceneLoaded.set(true));

		data.summaries.forEach(element => {
			const img = new Image();
			img.src = element.image;
		});
	});
</script>

<div class="main">
	<div class="main__container">
		<div class="main__content">
			<h1>Hi, I'm Parker</h1>
			<p>
				Welcome to my site. I'm just a guy messing around with graphics programming. This place is
				basically my digital sketchbook—a spot where I get to share the projects I've been working
				on. I'm not out to change the world or anything; I'm just into creating stuff that I
				personally find cool. So go ahead, take your time, and browse around. Maybe you'll find
				something cool or even pick up a new trick or two. Enjoy your stay, and thanks for dropping
				by.
			</p>
		</div>
		<div class="main__img--container">
			<canvas class="webgl" id="three__continer" bind:this={el} />
		</div>
	</div>
	<div class="posts__selector">
		<h1>Blog Posts</h1>
	</div>
	<div class="main__posts" id="main__posts">
		{#each data.summaries as { name, description, date, image, image_static, logo, page, hovered }}
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
	</div>
</div>
