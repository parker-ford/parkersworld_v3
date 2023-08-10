<script>
  export let data;
  console.log(data)
  //export let summaries = [];
  //$: console.log(summaries)

	import { onMount } from 'svelte';
    import './style.css'
    let el;
    onMount(async () =>{
        const {createScene} = await import('../lib/scene')
        createScene(el)
    })
</script>

<div class="main">
    <div class="main__container">
      <div class="main__content">
        <h1>Hi, I'm Parker</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
      <div class="main__img--container" >
        <canvas class="webgl" id="three__continer" bind:this={el}></canvas>
      </div>
    </div>
    <div class="posts__selector">
      <h1>Posts</h1>
      <h1>Projects</h1>
    </div>
    <div class="main__posts" id="main__posts">
        {#each data.summaries as {name, description, image, page}}
            <div id="post" on:click={()=>window.location.href = page} on:keydown={() => console.log('test')}>
                <div id="post__text">
                    <h1 id="post__title">{name}</h1>
                    <p id="post__body">{description}</p>
                </div>
                <div id="post__img__container">
                    <img id="post__img" src={image} alt="dog">
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
