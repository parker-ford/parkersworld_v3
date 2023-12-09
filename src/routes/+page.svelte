<script>
  export let data;
  import { bannerLoaded } from './stores.js'
	import { onMount } from 'svelte';
  import { fade } from 'svelte/transition'
  import './style.css'
  let el;
  let isSceneLoaded = false;
  let allLoaded = false;
  onMount(async () =>{
      const {createScene} = await import('../lib/scene')
      createScene(el, () => isSceneLoaded = true)
  });

  $: if (isSceneLoaded) {
    console.log("scene is loaded");
    checkAllLoaded()
  }

  let isBannerLoaded = false;
  bannerLoaded.subscribe(value => {
    isBannerLoaded = value;
  });

  $: if (isBannerLoaded) {
    console.log("banner loaded in page");
    checkAllLoaded()
  }

  const checkAllLoaded = () => {
    if(isBannerLoaded && isSceneLoaded){
      console.log("all loaded")
      allLoaded = true;
    }
  }

</script>

{#if !allLoaded}
<div class="loading-screen" transition:fade={{duration: 500}}>
    <p>Loading...</p>
</div>
{/if}

<div class="main">
    <div class="main__container">
      <div class="main__content">
        <h1>Hi, I'm Parker</h1>
        <p>Welcome to my site. I'm just a guy messing around with graphics programming. This place is basically my digital sketchbook—a spot where I get to share the projects I've been working on. I'm not out to change the world or anything; I'm just into creating stuff that I personally find cool. So go ahead, take your time, and browse around. Maybe you'll find something cool or even pick up a new trick or two. Enjoy your stay, and thanks for dropping by. </p>
      </div>
      <div class="main__img--container" >
        <canvas class="webgl" id="three__continer" bind:this={el}></canvas>
      </div>
    </div>
    <div class="posts__selector">
      <h1>Blog Posts</h1>
      <!-- <h1>Projects</h1> -->
    </div>
    <div class="main__posts" id="main__posts">
        {#each data.summaries as {name, description, date, image, image_static, page, hovered}}
            <div class="post" on:click={()=>window.location.href = page} on:keydown={() => console.log('test')} on:mouseover = {() => hovered = true} on:focus = {() => hovered = true} on:mouseout = {() => hovered = false} on:blur={() => hovered = false}>
                <div class="post__text">
                  <p class="post__date">{date}</p>
                  <h1 class="post__title">{name}</h1>
                  <div class="post__tech-icons">
                    <img src="./images/logos/webgpu-horizontal.svg" alt="Tech 1">
                </div>
                </div>
                <div class="post__img__container">
                    <img class="post__img" src={hovered ? image : image_static} alt="dog">
                </div>
            </div>
        {/each}
        <!-- {#each summaries as summary}
            <div>
              <h1>{summary.name}</h1>
            </div>
        {/each} -->
    </div>
  </div>
