import { writable } from 'svelte/store';
import { delay, random } from '../helper';
import * as AWS from '../utils/aws'

const initialValue = {
  tracks: [],
  current_track_id: null,
}
const writableStore = writable(initialValue)

let currentValue;
writableStore.subscribe(value => {
  currentValue = value;
});

function setTrack(id) {
  writableStore.update(store => {
    store.current_track_id = id;
    const url = findUrlFromTrackId(store.tracks, id)
    if (url) {
      const audio = document.getElementById('music-player');
      audio.src = url;
      audio.play();
    }
    return store;
  });
}

function getCurrentTrack() {
  return getCurrentTrackById(
    currentValue.tracks,
    currentValue.current_track_id
  )
}

function getRandomTrack() {
  return random(currentValue.tracks)
}

function getCurrentTrackById(tracks, id) {
  const result = tracks.filter((track) => track.id === id)
  if (result.length > 0) return result[0]
  return null
}

function getNextTrack() {
  const current = getCurrentTrack()
  const index = currentValue.tracks.findIndex((item) => {
    return item.id === current.id
  })
  const next = currentValue.tracks[(index + 1) % currentValue.tracks.length]
  return next
}

function getPreviousTrack() {
  const current = getCurrentTrack()
  const index = currentValue.tracks.findIndex((item) => {
    return item.id === current.id
  })
  const prevIndex = (index - 1 + currentValue.tracks.length) % currentValue.tracks.length
  const next = currentValue.tracks[prevIndex]
  return next
}

function findUrlFromTrackId(tracks, id) {
  const track = getCurrentTrackById(tracks, id)
  if (track) return track.url
  return null
}

export async function initializePlaylist() {
  // await testInitializePlaylist()
  await awsInitializePlaylist()
}

async function awsInitializePlaylist() {
  const client = AWS.createClient()
  const objects = await client.getAllObjects()
  const items = objects.map((object, index) => {
    const url = client.getS3ObjectUrl(object)
    const title = client.getS3ObjectTitle(object)
    if (!title) return null
    const id = 'track' + '-' + index
    return {
      id,
      title,
      url,
    }
  }).filter((item) => item !== null)


  if (items.length > 0) {
    writableStore.update(store => {
      store.tracks = items
      store.current_track_id = items[0].id
      return store;
    });
  }
}

async function testInitializePlaylist() {
  await delay(3000)
  const items = Array(50).fill('test_track ').map((text, index) => {
    const title = text + index
    const id = title.split(' ').join('_')
    return {
      title,
      id,
    }
  })

  if (items.length > 0) {
    writableStore.update(store => {
      store.tracks = items
      store.current_track_id = items[0].id
      return store;
    });
  }
}

export const playlistStore = {
  subscribe: writableStore.subscribe,
  set: writableStore.set,
  update: writableStore.update,
  setTrack,
  getCurrentTrack,
  getRandomTrack,
  getNextTrack,
  getPreviousTrack,
}
