<script>
	import { onMount } from "svelte";
	import Typed from "typed.js";
	import { alien_text_v2 } from "../helper";
	import { playlistStore } from "../stores/playlistStore";

  export let track_id;
  export let title;

  const alien_text = alien_text_v2(title)

  onMount(() => {animateAlienText()})

  function animateAlienText() {
    new Typed(`#${track_id}`, {
      strings: [alien_text, title],
      typeSpeed: Math.random() * 20,
      startDelay: Math.random() * 500,
      smartBackspace: true,
      backSpeed: 20,
      showCursor: false,
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li id={track_id} on:click="{() => playlistStore.setTrack(track_id)}"/>
