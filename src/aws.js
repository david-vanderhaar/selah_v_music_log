const BUCKET = 'selah-v'
let PREFIX = 'tapes/chronological/';
const S3_CLIENT = getAwsS3Client()

// Define available playlists with their styling information
const PLAYLISTS = [
  {
    id: 'chronological',
    name: 'Chronological',
    prefix: 'tapes/chronological/',
    colors: {
      primary: '#e6734f',
      secondary: '#e5ca9f',
      tertiary: '#b84b2d',
      background: '#10101f'
    }
  },
  {
    id: 'catamorph',
    name: 'Catamorph',
    prefix: 'tapes/Catamorph/',
    colors: {
      primary: '#EFE1D1',
      secondary: '#A78295',
      tertiary: '#574052',
      background: '#1e151f'
      // primary: '#F6DC43',
      // secondary: '#FF2DF1',
      // tertiary: '#A5158C',
      // background: '#410445'
    }
  },
  {
    id: 'oddessey',
    name: 'Oddessey',
    prefix: 'tapes/Oddessey/',
    colors: {
      primary: '#EFE1D1',
      secondary: '#A78295',
      tertiary: '#574052',
      background: '#1e151f'
    }
  },
  {
    id: 'jarod_x_david',
    name: 'Jarod x David',
    prefix: 'tapes/Jarod x David/',
    colors: {
      primary: '#b8d9a3',
      secondary: '#f6f6f6',
      tertiary: '#9a9a9a',
      background: '#10101f'
    }
  },
];

// Set the active playlist (default to first one)
let ACTIVE_PLAYLIST = PLAYLISTS[0];

function getAwsS3Client() {
  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:5ffdbd30-aed0-486f-a6db-7c1a0b64adfe',
  });
  
  return new AWS.S3({params: {Bucket: BUCKET}})
}

function createClient() {
  return {
    getAllObjects,
    getS3ObjectUrl,
    getS3ObjectTitle,
    getS3ObjectDate,
    addObjectsToPlaylist,
    autoplayFromUrlParams,
    initializePlaylistSwitcher,
    switchPlaylist
  }
}

async function getAllObjects() {
  try {
    PREFIX = ACTIVE_PLAYLIST.prefix;
    const response = await S3_CLIENT.listObjects({Prefix: PREFIX}).promise()
    return response.Contents
  } catch (error) {
    handleError(error)
  }
}

function getS3ObjectUrl(object) {
  return 'https://' + BUCKET + '.s3.amazonaws.com/' + object.Key; 
}

function getS3ObjectTitle(object) {
  try {
    // without last two ** which denote it's one of my favorite tracks
    return object.Key.split('/').at(-1).split('.')[0].replace(/\*\*/g, '')
  } catch {
    return null
  }
}

function getS3ObjectDate(object) {

}

function getIsFavorite(object) {
  return object.Key.split('/').at(-1).split('.')[0].endsWith('**')
}

let PLAYLIST_INDEX = 0
let PLAYLIST_URLS = []
let ORIGINAL_PLAYLIST_URLS = []
let IS_PLAYLIST_SHUFFLED = false

function addObjectsToPlaylist(objects) {
  const playlist = document.getElementById('playlist');
  objects.forEach(function(object, index) {
    const url = getS3ObjectUrl(object)
    const title = getS3ObjectTitle(object)
    if (!title) return
    
    // Create main list item
    const li = document.createElement('li');
    ORIGINAL_PLAYLIST_URLS.push(url)
    PLAYLIST_URLS.push(url)
    const playlist_index = PLAYLIST_URLS.length - 1
    const id = 'track' + '-' + index
    li.id = id
    li.dataset['favorite'] = getIsFavorite(object)
    li.dataset['source_url'] = url
    li.dataset['track_title'] = title
    li.dataset['index'] = index
    
    // Create title span for the song
    const titleSpan = document.createElement('span');
    titleSpan.className = 'track-title';
    li.addEventListener('click', function() {
      const audio = document.getElementById('music-player');
      audio.src = url;
      PLAYLIST_INDEX = playlist_index
      audio.play();
    });
    
    li.appendChild(titleSpan);
    playlist.appendChild(li);
    
    // add text animation
    const alien_text = alien_text_v2(title)
    if (index <= 10) {
      new Typed(`#${id} .track-title`, {
        strings: [alien_text, title],
        typeSpeed: Math.random() * 20,
        startDelay: Math.random() * 500,
        smartBackspace: true,
        backSpeed: 20,
        showCursor: false,
      });
    } else {
      titleSpan.innerHTML = title
    }
  });

  // update share button click event to include playlist ID
  const shareButton = document.getElementById('share-button');
  shareButton.addEventListener('click', (e) => {
    e.stopPropagation();
    // get the current track title
    const currentTrackUrl = PLAYLIST_URLS[PLAYLIST_INDEX]
    const currentTrackElement = [...playlist.children].find((el) => el.dataset.source_url === currentTrackUrl);
    if (!currentTrackElement) return playlist.children[0].dataset.track_title
    const title = currentTrackElement.dataset.track_title
    
    // Include playlist ID in the permalink
    const permalink = `${window.location.origin}${window.location.pathname}?playlist=${ACTIVE_PLAYLIST.id}&track=${encodeURIComponent(title)}`;
    navigator.clipboard.writeText(permalink);
    
    // add feedback
    alert(`link copied to clipboard: ${permalink}`);
  });
}

function autoplayFromUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const playlistId = urlParams.get('playlist');
  const autoplayTrack = urlParams.get('track');
  
  // Function to continue with track loading after playlist is set
  const loadTrack = () => {
    if (!autoplayTrack) return;
    
    // get url from title
    const trackTitle = decodeURIComponent(autoplayTrack);
    const trackUrl = PLAYLIST_URLS.find((url) => url.includes(trackTitle));
    if (trackUrl) {
      PLAYLIST_INDEX = PLAYLIST_URLS.findIndex((url) => url === trackUrl);
      const audio = document.getElementById('music-player');
      audio.src = trackUrl;

      // create and show dialog
      const dialog = document.createElement('dialog');
      dialog.innerHTML = `
        <form method="dialog">
          <div>Welcome to</div>
          <h2 class='favorite-flicker' style='margin-top: 0px'>Selah V</h2>
          <div>Playlist: ${ACTIVE_PLAYLIST.name}</div>
          <button id="confirm" value="default">Initialize Landing Sequence</button>
        </form>
      `;
      document.body.appendChild(dialog);
      
      // Add slight delay before showing dialog to ensure transition works
      requestAnimationFrame(() => {
        dialog.showModal();
      });

      // handle dialog response
      dialog.addEventListener('close', () => {
        audio.play();
      });
    }
  };
  
  // Check if a playlist is specified in the URL
  if (playlistId) {
    const targetPlaylist = PLAYLISTS.find(p => p.id === playlistId);
    if (targetPlaylist && targetPlaylist.id !== ACTIVE_PLAYLIST.id) {
      // We need to switch to the requested playlist first, then load the track
      switchPlaylist(playlistId).then(() => {
        loadTrack();
      });
    } else {
      // Already on the right playlist, just load the track
      loadTrack();
    }
  } else {
    // No playlist specified, just try to load the track from current playlist
    loadTrack();
  }
}

// New function to initialize the playlist switcher UI
function initializePlaylistSwitcher() {
  const container = document.createElement('div');
  container.className = 'playlist-switcher';
  
  PLAYLISTS.forEach(playlist => {
    const button = document.createElement('button');
    button.innerText = playlist.name;
    button.dataset.playlistId = playlist.id;
    button.className = 'playlist-button';
    
    // Highlight the active playlist
    if (playlist.id === ACTIVE_PLAYLIST.id) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', async () => {
      await switchPlaylist(playlist.id);
    });
    
    container.appendChild(button);
  });
  
  // Insert after header section
  const header = document.querySelector('.header');
  header.parentNode.insertBefore(container, header.nextSibling);
}

// Function to switch between playlists
async function switchPlaylist(playlistId) {
  // Find the selected playlist
  const newPlaylist = PLAYLISTS.find(p => p.id === playlistId);
  if (!newPlaylist || newPlaylist.id === ACTIVE_PLAYLIST.id) return;
  
  // Update active playlist
  ACTIVE_PLAYLIST = newPlaylist;
  PREFIX = ACTIVE_PLAYLIST.prefix;
  
  // Update color scheme
  updateColorScheme(ACTIVE_PLAYLIST.colors);
  
  // Clear current playlist
  clearPlaylist();
  
  // Load new tracks
  const objects = await getAllObjects();
  addObjectsToPlaylist(objects.reverse());
  
  // Update active button
  const buttons = document.querySelectorAll('.playlist-button');
  buttons.forEach(btn => {
    if (btn.dataset.playlistId === playlistId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateColorScheme(colors) {
  const root = document.documentElement;
  
  // Apply with transition
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--secondary-color', colors.secondary);
  root.style.setProperty('--tertiary-color', colors.tertiary);
  root.style.setProperty('--background-color', colors.background);
  
  // Update scrollbar color
  document.body.style.setProperty('scrollbar-color', `${colors.primary} transparent`);
}

function clearPlaylist() {
  const playlist = document.getElementById('playlist');
  playlist.innerHTML = '';
  PLAYLIST_URLS = [];
  ORIGINAL_PLAYLIST_URLS = [];
  PLAYLIST_INDEX = 0;
  
  // Stop audio if playing
  const audio = document.getElementById('music-player');
  audio.pause();
  audio.src = '';
}

function handleError(error) {
  console.log(error, error.stack);
}

function shuffleArray(unshuffled) {
  return unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function shuffleText(unshuffled) {
  return shuffleArray(unshuffled.split('')).join('')
}

function alien_text_v1(text) {
  return shuffleText(text)
}

function alien_text_v2(text) {
  return Array(text.length).fill('').map(() => random(FONTS.SHAPES)).join('')
}

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function range(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const FONTS = {
  SHAPES: ['■','●','▼','○','◆','▲','◎','▽','◇','▶','□','△','◯','◀','▷','◉','▪','◢','◦','◒','◁','▫','◤','◊','◣','◥','◑','◐','◓','▣','▦','▢','▥','▧','▱','▤','▨','▩'],
  BLOCKS: ['█','▓','▇','▒','░','▅','▂','▄','▀','▃','▆','▋','▍','▌','▉','▎','▊','▁','▐','▏','▕','▗','▚','▙','▞','▝','▘','▛','▖','▟','▜'],
  CHINESE: ['日','人','中','合','一','本','大','新','用','見','方','入','報','会','事','時','年','気','上','出','定','情','月','最','問','生','間','場','前','無','分','内','行','全','目','利','記','関','画','動','手','子','料','作','検','高','自','表','名','取','覧','者','約','開','連','下','知','社','通','索','理','体','今','地','登','物','部','品','集','特','能','発','数','業','他','金','録','小','文','付','外','要','後','使','法','様','当','規','楽','式','意','加','国','話','以','有','回','性','実','示','所','公','変','長','成','番','近','対','先','機','電','設','家','広','真','度','更','学','選','的','書','可','初','東','水','力','明','美','別','現','多','不','代','感','着','来','告','市','次','安','保','介','店','立','心','信','女','込','送','在','田','載','期','山','活','員','引','注','売','件','円','面','同','像','木','々','道','思','海','良','食','予','野','化','愛','受','応','個','結','持','認','投','正','容','詳','商','切','川','相','確','言','味','続','細','限','価','口','好','質','紹','必','元','写','車','屋','天','三','京','営','仕','少','運','追','向','調','神','指','望','語','得','読','解','号','原','買','何','掲','世','白','和','題','決','配','点','探','稿','始','都','重','考','土','色','音','種','終','県','等','古','北','島','交','教','身','主','果','説','第','参','位','素','達','単','供','違','状','際','平','住','転','空','常','販','専','過','男','直','風','界','基','線','案','総','優','未','組','再','工','花','効','形','戻','流','私','強','提','経','頭','二','購','光','万','制','西','周','客','務','除','編','型','管','験','支','願','完','然','材','台','製','便','門','類','置','待','閉','映','雑','共','想','友','返','断','満','福','護','井','室','備','観','由','了','放','石','足','歴','談','企','伝','止','版','済','条','器','週','進','収','園','町','具','申','岡','軽','評','早','火','落','戦','宮','求','非','態','図','区','香','残','休','芸','校','旅','育','反','存','聞','届','量','字','春','庫','希','毎','証','各','青','張','村','帯','千','適','択','株','役','試','越','半','辺','術','系','歩','装','急','笑','歳','順','超','顔','乗','黒','換','舗','太','宅','夜','速','消','象','施','接','健','募','域','士','崎','概','携','比','資','南','修','座','飲','朝','奈','阪','念','頂','森','絶','夫','職','館','異','駅','医','声','採','谷','段','科','松','悪','納','児','佐','抜','演','赤','団','例','改','替','係','馬','影','含','根','服','玉','富','寄','税','歌','印','準','去','防','城','四','研','割','藤','任','構','治','秋','移','久','離','板','戸','項','独']
}