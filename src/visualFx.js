new Typed('#playlist-title-numeral', {
  strings: [alien_text_v2('123'), alien_text_v2('V'), 'V'],
  typeSpeed: Math.random() * 100,
  startDelay: Math.random() * 500,
  backSpeed: 20,
  showCursor: false,
});


let IS_PLAYING = false

function audioPlayerToTextureMove() {
  const audio = document.getElementById('music-player');
  const textured_elements = document.getElementsByClassName('texture')
  audio.addEventListener('play', (event) => {
    if (!IS_PLAYING) animateTexures(textured_elements)
    IS_PLAYING = true
  })
  audio.addEventListener('ended', () => {
    IS_PLAYING = false
    endAnimateTexures(textured_elements)
  })
  audio.addEventListener('pause', () => {
    IS_PLAYING = false
    endAnimateTexures(textured_elements)
  })
}

audioPlayerToTextureMove()
const INTERVALS = []

function animateTexures(elements) {
  Array.from(elements).forEach(function (element) {
    const interval = setInterval(() => {
      let current = 0
      const match = element.style.transform.match(/\d+/)
      if (match) current = parseFloat(match[0])
      if (current > 360) current = 0
      element.style.transform = `rotate(${current + 1}deg)`
    }, 50)

    INTERVALS.push(interval)
  });
}

function endAnimateTexures(elements) {
  INTERVALS.forEach((interval) => clearInterval(interval))
}