<script>
	import { onMount } from 'svelte';
    import '../style.css'
    let el;
    onMount(async () =>{
        const {createScene} = await import('./scene')
        createScene(el)
    })

    const title = "Debug UI"
    const date = "1/16/2023"
    const text_content = `
                
    `
</script>

<div class="page__main">
    <div class = "page__content">
        <div class ="page__title__container">
            <h1 class="page__title">{title}</h1>
        </div>
        <div class="page__canvas__container">
            <canvas bind:this={el}></canvas>
        </div>
        <div class="page__text_container">
            <p>
                {text_content}
            </p>
        </div>
    </div>
</div>
