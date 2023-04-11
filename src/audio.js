animatePageTitle()

function animatePageTitle() {
  new Typed('#playlist-title-numeral', {
    strings: [alien_text_v2('123'), alien_text_v2('V'), 'V'],
    typeSpeed: Math.random() * 100,
    startDelay: Math.random() * 500,
    backSpeed: 20,
    showCursor: false,
  });
}


let IS_PLAYING = false

function audioPlayerToTextureMove() {
  const audio = document.getElementById('music-player');
  const locatorUI = document.getElementById('locator');
  const locatorText = document.getElementById('locator-text');
  const textured_elements = document.getElementsByClassName('texture')
  audio.addEventListener('play', (event) => {
    if (!IS_PLAYING) animateTexures(textured_elements)
    IS_PLAYING = true
    const text = audio.src.split('/').at(-1).split('.')[0]
    locatorText.innerHTML = text
    locatorUI.style.visibility = 'visible'
    locatorUI.style.top = `${range(-78, -37)}%`
    locatorUI.style.left = `${range(4, 94)}%`
    animatePlayButton()
  })
  audio.addEventListener('ended', () => {
    IS_PLAYING = false
    endAnimateTexures(textured_elements)

    const next = (PLAYLIST_INDEX + 1) % PLAYLIST_URLS.length;
    const nextUrl = PLAYLIST_URLS[next] 
    PLAYLIST_INDEX = next
    audio.src = nextUrl;
    audio.play();
  })
  audio.addEventListener('pause', () => {
    IS_PLAYING = false
    endAnimateTexures(textured_elements)
    animatePauseButton()
  })
}

audioPlayerToTextureMove()
const INTERVALS = []

function animateTexures(elements) {
  Array.from(elements).forEach(function (element) {
    let maskDirection = 1
    const interval = setInterval(() => {
      // rotate image
      let current = 0
      const match = element.style.transform.match(/[+-]?([0-9]*[.])?[0-9]+/)
      if (match) current = parseFloat(match[0])
      if (current > 360) current = 0
      element.style.transform = `rotate(${current + 0.1}deg)`

      // animate texture
      let maskX = 0
      const maskMatch = element.style.webkitMaskPositionX.match(/[+-]?([0-9]*[.])?[0-9]+/)
      if (maskMatch) maskX = parseFloat(maskMatch[0])
      if (maskDirection > 0 && maskX >= 3500) maskDirection = -1
      if (maskDirection < 0 && maskX <= 0) maskDirection = 1
      let increment = 0.5 * maskDirection
      element.style.webkitMaskPositionX = `${maskX + increment}px`
    }, 50)

    INTERVALS.push(interval)
  });
}

function endAnimateTexures(elements) {
  INTERVALS.forEach((interval) => clearInterval(interval))
}

function getPlayer() {
  const audio = document.getElementById('music-player');
  const play = () => {
    if (!audio.src) audio.src = PLAYLIST_URLS[PLAYLIST_INDEX]
    audio.play()
  }
  const pause = () => audio.pause()
  const toggle = () => IS_PLAYING ? pause() : play()
  return {
    element: audio,
    is_playing: IS_PLAYING,
    play,
    pause,
    toggle,
    getPlaylistUrls: () => PLAYLIST_URLS
  }
}