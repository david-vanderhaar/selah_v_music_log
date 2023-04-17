import Typed from 'typed.js'
import {createClient} from './aws';
import {alien_text_v2} from './aws';

async function intialize() {
  const client = createClient()
  const objects = await client.getAllObjects()
  client.addObjectsToPlaylist(objects)
}

function test_initialize() {
  const playlist = document.getElementById('playlist');
  console.log('playlist');
  console.log(playlist);
  Array(50).fill('test_track ').forEach((text, index) => {
    const title = text + index
    const alien_title = alien_text_v2(title)
    const id = title.split(' ').join('_')
    const li = document.createElement('li');
    li.id = id
    playlist.appendChild(li);
    new Typed(`#${id}`, {
      strings: [alien_title, title.repeat(4)],
      typeSpeed: Math.random() * 100,
      startDelay: Math.random() * 500,
      smartBackspace: true,
      backSpeed: 20,
      showCursor: false,
    });
  })
}

intialize()
// test_initialize()