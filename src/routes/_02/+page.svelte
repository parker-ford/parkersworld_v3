<script>
	import { onMount } from 'svelte';
    import '../style.css'
	import { updateTransform } from './scene';
    let el;
    onMount(async () =>{
        const {createScene} = await import('./scene')
        const {updateTransform} = await import('./scene')
        createScene(el)
    })

    const title = "Transformations"
    const date = "1/16/2023"
    const text_content = `
        4 properties to transform an object:
            -position
            -scale
            -rotation
            -quaternion
        Each of these components in stored in matrices

        position of objects can be changed my modifieng the position property on the xyz axes.
        position can be modified anywhere(before or after the mesh has been added to the scene). If the move is done after the last render call, you will not see the change
        position is a vector3. vector3 has a lot of built in methods.

        rotation is decided by a Euler object. One full rotation on an axis is equal to 2 pi.
        rotating with this method can lead to gimbel lock. This can be fixed by using the reorder method.

        Quaternion is more complex and harder to imagine but it prevents gimbel lock.     
    `

    let transform = {
        pos_x: 0,
        pos_y: 0,
        pos_z: 1,
        scale_x: 1,
        scale_y: 1,
        scale_z: 1,
        rot_x: 0,
        rot_y: 0,
        rot_z: 0
    }

    $: {updateTransform(transform)}


</script>

<div class="page__main">
    <div class = "page__content">
        <div class ="page__title__container">
            <h1 class="page__title">{title}</h1>
        </div>
        <div class="page__canvas__container">
            <canvas bind:this={el}></canvas>
        </div>
        <div class="controls__container">
            <label class="controls__slider">
                <p>X position:</p>
                <input
                    type="number"
                    bind:value={transform.pos_x}
                    min="0"
                    max="10"
                />

                <input
                    type="range"
                    bind:value={transform.pos_x}
                    min="0"
                    max="10"
                    step="0.01"
                />

            </label>
            <label class="controls__slider">
                <p>Y position:</p>
                <input
                    type="number"
                    bind:value={transform.pos_y}
                    min="0"
                    max="10"
                />

                <input
                    type="range"
                    bind:value={transform.pos_y}
                    min="0"
                    max="10"
                    step="0.01"
                />

            </label>
            <label class="controls__slider">
                <p>Z position:</p>
                <input
                    type="number"
                    bind:value={transform.pos_z}
                    min="0"
                    max="10"
                />

                <input
                    type="range"
                    bind:value={transform.pos_z}
                    min="0"
                    max="10"
                    step="0.01"
                />

            </label>
            <label class="controls__slider">
                <p>X Scale:</p>
                <input
                    type="number"
                    bind:value={transform.scale_x}
                    min="0"
                    max="3"
                />

                <input
                    type="range"
                    bind:value={transform.scale_x}
                    min="0"
                    max="3"
                    step="0.01"
                />

            </label>
            <label class="controls__slider">
                <p>Y Scale:</p>
                <input
                    type="number"
                    bind:value={transform.scale_y}
                    min="0"
                    max="3"
                />

                <input
                    type="range"
                    bind:value={transform.scale_y}
                    min="0"
                    max="3"
                    step="0.01"
                />

            </label>
            <label class="controls__slider">
                <p>Z Scale:</p>
                <input
                    type="number"
                    bind:value={transform.scale_z}
                    min="0"
                    max="3"
                />

                <input
                    type="range"
                    bind:value={transform.scale_z}
                    min="0"
                    max="3"
                    step="0.01"
                />

            </label>
            <label class="controls__slider">
                <p>X Rotation:</p>
                <input
                    type="number"
                    bind:value={transform.rot_x}
                    min="0"
                    max="1"
                />

                <input
                    type="range"
                    bind:value={transform.rot_x}
                    min="0"
                    max="1"
                    step="0.01"
                />

            </label>
            <label class="controls__slider">
                <p>Y Rotation:</p>
                <input
                    type="number"
                    bind:value={transform.rot_y}
                    min="0"
                    max="1"
                />

                <input
                    type="range"
                    bind:value={transform.rot_y}
                    min="0"
                    max="1"
                    step="0.01"
                />

            </label>
            <label class="controls__slider">
                <p>Z Rotation:</p>
                <input
                    type="number"
                    bind:value={transform.rot_z}
                    min="0"
                    max="1"
                />

                <input
                    type="range"
                    bind:value={transform.rot_z}
                    min="0"
                    max="1"
                    step="0.01"
                />

            </label>
        </div>
        <div class="page__text_container">
            <p>
                {text_content}
            </p>
        </div>
    </div>
</div>
