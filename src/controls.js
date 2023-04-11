initializePlayButton()
initializeShuffleButton()
initializePlaytimeProgress()

function initializePlayButton() {
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

function initializeShuffleButton() {
  const button = document.querySelector("#shuffle-button");
  const playRandom = () => {
    const player = getPlayer()
    const random_song = random(player.getPlaylistUrls())
    PLAYLIST_INDEX = player.getPlaylistUrls().findIndex((url) => url === random_song)
    player.element.src = random_song
    player.play()
  }
  button.addEventListener("click", function(evt) {
    evt.preventDefault()
    playRandom()
  });
  button.addEventListener("touch", function(evt) {
    evt.preventDefault()
    playRandom()
  });
}

function animatePlayButton() {
  const button = document.querySelector("#play-button");
  button.innerHTML = 'pause_circle'
}

function animatePauseButton() {
  const button = document.querySelector("#play-button");
  button.innerHTML = 'play_circle'
}

function initializePlaytimeProgress() {
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