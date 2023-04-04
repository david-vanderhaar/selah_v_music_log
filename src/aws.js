const BUCKET = 'selah-v'
const PREFIX = 'tapes/chronological/';
const S3_CLIENT = getAwsS3Client()

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
    addObjectsToPlaylist,
  }
}

async function getAllObjects() {
  try {
    const response = await S3_CLIENT.listObjects({Prefix: PREFIX}).promise()
    return response.Contents
  } catch (error) {
    handleError(error)
  }
}

function addObjectsToPlaylist(objects) {
  const playlist = document.getElementById('playlist');
  objects.forEach(function(object) {
    const key = object.Key;
    const url = 'https://' + BUCKET + '.s3.amazonaws.com/' + key;
    const li = document.createElement('li');
    const title = key.split('/').at(-1)
    if (title) {
      li.innerHTML = title.split('.')[0];
      li.addEventListener('click', function() {
        const audio = document.getElementById('music-player');
        audio.src = url;
        audio.play();
      });
      playlist.appendChild(li);
    }
  });
}

function handleError(error) {
  console.log(error, error.stack);
}
