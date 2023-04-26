import ProgressBar from 'progressbar.js'

export function initializePlayButton(getPlayer) {
  const button = document.querySelector("#play-button");
  button.addEventListener("click", function(evt) {
    evt.preventDefault()
    getPlayer().toggle()
  });
  button.addEventListener("touch", function(evt) {
    evt.preventDefault()
    getPlayer().toggle()
  });
}

export function initializeShuffleButton(getPlayer) {
  const button = document.querySelector("#shuffle-button");
  button.addEventListener("click", function(evt) {
    evt.preventDefault()
    getPlayer().playRandom()
  });
  button.addEventListener("touch", function(evt) {
    evt.preventDefault()
    getPlayer().playRandom()
  });
}

export function initializePreviousButton(getPlayer) {
  const button = document.querySelector("#previous-button");
  button.addEventListener("click", function(evt) {
    evt.preventDefault()
    getPlayer().playPrevious()
  });
  button.addEventListener("touch", function(evt) {
    evt.preventDefault()
    getPlayer().playPrevious()
  });
}

export function initializeNextButton(getPlayer) {
  const button = document.querySelector("#next-button");
  button.addEventListener("click", function(evt) {
    evt.preventDefault()
    getPlayer().playNext()
  });
  button.addEventListener("touch", function(evt) {
    evt.preventDefault()
    getPlayer().playNext()
  });
}

export function animatePlayButton() {
  const button = document.querySelector("#play-button");
  button.innerHTML = 'pause_circle'
}

export function animatePauseButton() {
  const button = document.querySelector("#play-button");
  button.innerHTML = 'play_circle'
}

export function initializeVolumeControl(getPlayer) {
  const player_element = getPlayer().element
  const input = document.querySelector('#volume-slider')
  input.addEventListener('input', (event) => {
    const new_volume = parseFloat(event.target.value)
    player_element.volume = new_volume
  })

  player_element.addEventListener('volumechange', (event) => {
    const new_volume = event.target.volume
    input.value = `${new_volume}`
  })
}

export function initializePlaytimeProgress(getPlayer) {
  const circle = new ProgressBar.Circle('#planet', {
    easing: 'easeInOut',
    color: '#b84b2d',
    svgStyle: {
      display: 'block',
      width: '220px',
      bottom: '227px',
      position: 'relative',
      left: '-10px',
    }
  });

  // const semi = new ProgressBar.SemiCircle('#planet', {
  //   easing: 'easeInOut',
  //   color: '#e5ca9f',
  //   svgStyle: {
  //     display: 'block',
  //     width: '220px',
  //     position: 'relative',
  //     left: '-10px',
  //     bottom: '118px',
  //     transform: 'scaleY(-1)',
  //   }
  // });

  const player_element = getPlayer().element
  player_element.addEventListener('timeupdate', () => {
    const percent = player_element.currentTime / player_element.duration
    circle.animate(percent, {duration: 200});  // Value from 0.0 to 1.0
  })
}
