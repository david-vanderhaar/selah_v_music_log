initializePlayButton()
initializeShuffleButton()
initializeNextButton()
initializePrevButton()
initializePlaytimeProgress()
initializeVolumeControl()

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
  const playFirst = () => {
    const player = getPlayer()
    const song = player.getPlaylistUrls()[0]
    PLAYLIST_INDEX = 0
    player.element.src = song
    player.play()
  }
  const showShuffleButtonActive = () => {
    button.classList.add('button-toggle-fliccker__active')
  }
  const showShuffleButtonInactive = () => {
    button.classList.remove('button-toggle-fliccker__active')
  }

  const setPlaylistUiItems = (playlist) => {
    const playlistContainer = document.getElementById('playlist')
    const playlistItems = playlistContainer.children

    for (let listElement of playlistItems) {
      const newIndex = playlist.findIndex((url) => url === listElement.dataset.source_url)
      listElement.dataset.index = newIndex
    }

    [...playlistItems]
      .sort((a, b) => a.dataset.index - b.dataset.index)
      .forEach(el => playlistContainer.appendChild(el))
  }
  const shufflePlaylist = () => {
    PLAYLIST_URLS = shuffleArray(ORIGINAL_PLAYLIST_URLS)
    showShuffleButtonActive()
    playFirst()
  }
  const unshufflePlaylist = () => {
    PLAYLIST_URLS = [...ORIGINAL_PLAYLIST_URLS]
    showShuffleButtonInactive()
    playRandom()
  }
  const toggleShuffle = () => {
    IS_PLAYLIST_SHUFFLED = !IS_PLAYLIST_SHUFFLED
    if (IS_PLAYLIST_SHUFFLED) shufflePlaylist()
    else unshufflePlaylist()
    setPlaylistUiItems(PLAYLIST_URLS)
  }
  button.addEventListener("click", function(evt) {
    evt.preventDefault()
    toggleShuffle()
  });
  button.addEventListener("touch", function(evt) {
    evt.preventDefault()
    toggleShuffle()
  });
}


function initializeNextButton() {
  const button = document.querySelector("#next-button");
  const playNext = () => {
    const player = getPlayer()
    PLAYLIST_INDEX = PLAYLIST_INDEX + 1
    if (PLAYLIST_INDEX >= player.getPlaylistUrls().length) {
      PLAYLIST_INDEX = 0
    }
    player.element.src = player.getPlaylistUrls()[PLAYLIST_INDEX]
    player.play()
  }
  button.addEventListener("click", function(evt) {
    evt.preventDefault()
    playNext()
  })
  button.addEventListener("touch", function(evt) {
    evt.preventDefault()
    playNext()
  })

  document.addEventListener('swiped-left', function(evt) {
    evt.preventDefault()
    playNext()
  });
}

function initializePrevButton() {
  const button = document.querySelector("#prev-button");
  const playPrev = () => {
    const player = getPlayer()
    PLAYLIST_INDEX = PLAYLIST_INDEX - 1
    if (PLAYLIST_INDEX < 0) {
      PLAYLIST_INDEX = player.getPlaylistUrls().length - 1
    }
    player.element.src = player.getPlaylistUrls()[PLAYLIST_INDEX]
    player.play()
  }
  button.addEventListener("click", function(evt) {
    evt.preventDefault()
    playPrev()
  })
  button.addEventListener("touch", function(evt) {
    evt.preventDefault()
    playPrev()
  })

  document.addEventListener('swiped-right', function(evt) {
    evt.preventDefault()
    playPrev()
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

function initializeVolumeControl() {
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