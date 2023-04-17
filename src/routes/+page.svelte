<script>
  import { onMount } from 'svelte';

  onMount(() => {
    import('../lib/styles/main.css')
  import('../lib/styles/controls.css')
  import('../lib/styles/crt.css')
  import('../lib/src/aws.js')
  import('../lib/src/audio.js')
  import('../lib/src/controls.js')
  import('../lib/src/initialize.js')
  // import('../lib/styles/main.css').then(() => {
  //   import('../lib/styles/controls.css')
  // }).then(() => {
  //   import('../lib/styles/crt.css')
  // }).then(() => {
  //   import('../lib/src/aws.js')
  // }).then(() => {
  //   import('../lib/src/audio.js')
  // }).then(() => {
  //   import('../lib/src/controls.js')
  // }).then(() => {
  //   import('../lib/src/initialize.js')
  // })
});
</script>

<div class="crt">
  <section class="header">
    <div class="playlist-subtitle blink">Music Log</div>
    <div class="playlist-title">Selah <span id="playlist-title-numeral"></span></div>
    <div class="controls-row">
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
          <span id="locator-text" class="locator-text">asddsgwefwfsdf</span>
        </div>
      </div>
      <span id="shuffle-button" class="control-button material-symbols-outlined">
        scatter_plot
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
  <div class="playlist-container">
    <ul id="playlist"></ul>
  </div>
</div>
