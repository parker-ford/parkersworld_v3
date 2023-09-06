
<script>
  export let data;
  console.log(data)
  //export let summaries = [];
  //$: console.log(summaries)

	import { onMount } from 'svelte';
    import './style.css'
    let el;
    onMount(async () =>{
        const {createScene} = await import('./banner.js')
        createScene(el)
    })
</script>

<nav class="navbar">
    <div class="navbar__container">
      <!-- <a href="/" class="navbar__logo">PARKERS WORLD</a> -->
      <canvas class="webgl"  bind:this={el}></canvas> 
    </div>
</nav>

<slot />