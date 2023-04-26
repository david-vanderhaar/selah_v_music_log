import { range } from "../helper.js";
import { playlistStore } from "../stores/playlistStore.js";
import * as Controls from './controls.js';

let IS_PLAYING = false

audioPlayerToTextureMove()
Controls.initializePlayButton(getPlayer)
Controls.initializeShuffleButton(getPlayer)
Controls.initializePlaytimeProgress(getPlayer)
Controls.initializeVolumeControl(getPlayer)
Controls.initializePreviousButton(getPlayer)
Controls.initializeNextButton(getPlayer)

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
    Controls.animatePlayButton()
  })
  audio.addEventListener('ended', () => {
    IS_PLAYING = false
    endAnimateTexures(textured_elements)
    playlistStore.setTrack(playlistStore.getNextTrack().id)
  })
  audio.addEventListener('pause', () => {
    IS_PLAYING = false
    endAnimateTexures(textured_elements)
    Controls.animatePauseButton()
  })
}

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

export function getPlayer() {
  const audio = document.getElementById('music-player');
  const play = () => {
    if (!audio.src) playlistStore.setTrack(playlistStore.getCurrentTrack().id)
    audio.play()
  }
  const pause = () => audio.pause()
  const toggle = () => IS_PLAYING ? pause() : play()
  const playRandom = () => {
    playlistStore.setTrack(playlistStore.getRandomTrack().id)
  }
  const playNext = () => {
    playlistStore.setTrack(playlistStore.getNextTrack().id)
  }
  const playPrevious = () => {
    playlistStore.setTrack(playlistStore.getPreviousTrack().id)
  }
  return {
    element: audio,
    is_playing: IS_PLAYING,
    play,
    playNext,
    playPrevious,
    playRandom,
    pause,
    toggle,
  }
}