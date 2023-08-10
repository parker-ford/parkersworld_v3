<script>
  import { onMount, afterUpdate } from 'svelte';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/tokyo-night-dark.css'; // Import the theme

  export let code = '';
  export let language = 'javascript';

  let codeElement;

  const highlightCode = () => {
    hljs.highlightBlock(codeElement);
  };

  onMount(highlightCode);
  afterUpdate(highlightCode);
</script>

<div class="code-snippet">
  <pre>
    <code
      class="language-{language}"
      contenteditable="true"
      spellcheck="false"
      bind:textContent="{code}"
      bind:this="{codeElement}"
      on:blur="{highlightCode}"
    />
  </pre>
</div>

<style>

  .code-snippet{
    padding: 0;
    margin: 0;
  }

  .code-snippet pre {
    color: white;
    padding-bottom: 0px;
  }

  /* .code-snippet :global(pre), */
  .code-snippet :global(code){
    font-family: 'Fira Code', monospace; /* Replace with your desired font-family */
    background-color: #1a1b26; /* Replace with your desired background color */
    border: none;
    outline: none;
    text-shadow: none;
    color: #969ec0;
    border-radius: 5px;
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
</style>