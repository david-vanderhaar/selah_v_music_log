import AWS from 'aws-sdk';

const BUCKET = 'selah-v'
const PREFIX = 'tapes/chronological/';
// const S3_CLIENT = getAwsS3Client()

function getAwsS3Client() {
  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:5ffdbd30-aed0-486f-a6db-7c1a0b64adfe',
  });
  
  return new AWS.S3({params: {Bucket: BUCKET}})
}

export function createClient() {
  return {
    getAllObjects,
    getS3ObjectUrl,
    getS3ObjectTitle,
    getS3ObjectDate,
  }
}

async function getAllObjects() {
  try {
    const S3_CLIENT = getAwsS3Client()
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
    return object.Key.split('/').at(-1).split('.')[0]
  } catch {
    return null
  }
}

function getS3ObjectDate(object) {

}

function handleError(error) {
  console.log(error, error.stack);
}
