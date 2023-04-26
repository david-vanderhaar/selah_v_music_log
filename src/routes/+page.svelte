<script>
  import { onMount } from 'svelte';
  import Typed from 'typed.js'
  import Playlist from '../lib/components/Playlist.svelte'
	import { alien_text_v2 } from '../lib/helper';

  onMount(() => {
    import('../lib/styles/main.css')
    import('../lib/styles/controls.css')
    import('../lib/styles/crt.css')
    import('../lib/utils/audio.js')

    animatePageTitle()
  });

  function animatePageTitle() {
    new Typed('#playlist-title-numeral', {
      strings: [alien_text_v2('123'), alien_text_v2('V'), 'V'],
      typeSpeed: Math.random() * 100,
      startDelay: Math.random() * 500,
      backSpeed: 20,
      showCursor: false,
    });
  }
</script>

<div class="crt">
  <section class="header">
    <div class="playlist-subtitle blink">Music Log</div>
    <div class="playlist-title">Selah <span id="playlist-title-numeral"></span></div>
    <div class="controls-row">
      <span id="previous-button" class="control-button material-symbols-outlined">
        navigate_before
      </span>
      <span id="play-button" class="control-button material-symbols-outlined">
        play_circle
      </span>
      <div style="height: 200px; width: 200px;" id="planet">
        <img
          class="texture"
          src="assets/3D_Mars.png"
          alt="mars"
          height="200px"
          width="200px"
        >
        <div id="locator" class="locator">
          <span class="locator-circle--inner"></span>
          <span class="locator-circle"></span>
          <span id="locator-text" class="locator-text"></span>
        </div>
      </div>
      <span id="shuffle-button" class="control-button material-symbols-outlined">
        scatter_plot
      </span>
      <span id="next-button" class="control-button material-symbols-outlined">
        navigate_next
      </span>
    </div>
    <div class="slidecontainer">
      <input
        type="range"
        min="0"
        max="1"
        value="1"
        step="0.01"
        class="slider"
        id="volume-slider"
      >
    </div>
  </section>
  <div class="controls">
    <audio id="music-player"></audio>
  </div>
  <Playlist />
</div>
