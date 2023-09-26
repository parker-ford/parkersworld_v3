
<script>
	import { onMount } from 'svelte';
  import './style.css'
  import {bannerLoaded} from './stores.js'
  let el;
  let sceneLoaded = false;
  bannerLoaded.set(false);
  onMount(async () =>{
      const {createScene} = await import('./banner.js')
      createScene(el, () => sceneLoaded = true)
  });

  $: if (sceneLoaded) {
    console.log("banner is loaded");
    bannerLoaded.set(true);
  }
</script>

<nav class="navbar">
    <div class="navbar__container">
      <canvas class="webgl"  bind:this={el}></canvas> 
    </div>
</nav>

<slot />