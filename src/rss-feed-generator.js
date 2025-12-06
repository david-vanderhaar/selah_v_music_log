const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const BUCKET = 'selah-v';
const REGION = 'us-east-1';
const IDENTITY_POOL_ID = 'us-east-1:5ffdbd30-aed0-486f-a6db-7c1a0b64adfe';

// Define playlists
const PLAYLISTS = [
  {
    id: 'chronological',
    name: 'Chronological',
    prefix: 'tapes/chronological/',
    description: 'Chronological collection of music'
  },
  {
    id: 'catamorph',
    name: 'Catamorph',
    prefix: 'tapes/Catamorph/',
    description: 'Catamorph collection'
  },
  {
    id: 'oddessey',
    name: 'Oddessey',
    prefix: 'tapes/Oddessey/',
    description: 'Oddessey collection'
  },
  {
    id: 'jarod_x_david',
    name: 'Jarod x David',
    prefix: 'tapes/Jarod x David/',
    description: 'Collaboration between Jarod Wylie and David Vanderhaar'
  },
];

/**
 * Initialize AWS S3 client with Cognito credentials
 */
function getAwsS3Client() {
  AWS.config.region = REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
  });

  return new AWS.S3({ params: { Bucket: BUCKET } });
}

/**
 * Get all objects from S3 for a given prefix
 */
async function getAllObjects(s3Client, prefix) {
  try {
    const response = await s3Client.listObjects({ Prefix: prefix }).promise();
    return response.Contents || [];
  } catch (error) {
    console.error(`Error fetching objects from ${prefix}:`, error);
    return [];
  }
}

/**
 * Extract title from S3 object key
 */
function getS3ObjectTitle(object) {
  try {
    return object.Key.split('/').at(-1).split('.')[0].replace(/\*\*/g, '');
  } catch {
    return null;
  }
}

/**
 * Get S3 object URL
 */
function getS3ObjectUrl(object) {
  return `https://${BUCKET}.s3.amazonaws.com/${object.Key}`;
}

/**
 * Check if track is marked as favorite
 */
function getIsFavorite(object) {
  return object.Key.split('/').at(-1).split('.')[0].endsWith('**');
}

/**
 * Escape XML special characters
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate RSS feed XML
 */
function generateRSSFeed(playlistName, playlistDescription, tracks, playlistId) {
  // const siteUrl = 'https://selah-v.vercel.app';
  // const feedUrl = `${siteUrl}/feed.rss`;
  // github pages url
  const siteUrl = 'https://david-vanderhaar.github.io/selah_v_music_log';
  const feedUrl = `${siteUrl}/feeds/${playlistId}.rss`;
  const now = new Date().toUTCString();

  let itemsXml = '';

  tracks.forEach((track) => {
    const title = escapeXml(track.title);
    const url = escapeXml(track.url);
    const pubDate = new Date(track.lastModified).toUTCString();
    const isFavorite = track.isFavorite ? ' ⭐' : '';

    itemsXml += `
  <item>
    <title>${title}${isFavorite}</title>
    <link>${url}</link>
    <description>${title}</description>
    <enclosure url="${url}" length="${track.size}" type="audio/mpeg" />
    <pubDate>${pubDate}</pubDate>
    <guid isPermaLink="false">${url}</guid>
  </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(playlistName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(playlistDescription)}</description>
    <language>en-us</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${now}</lastBuildDate>
    <managingEditor>d.vanderhaarhunter@gmail.com</managingEditor>
    <webMaster>d.vanderhaarhunter@gmail.com</webMaster>
    ${itemsXml}
  </channel>
</rss>`;

  return rss;
}

/**
 * Main function to generate RSS feeds for all playlists
 */
async function generateAllFeeds() {
  const s3Client = getAwsS3Client();

  console.log('🎵 Starting RSS feed generation...\n');

  for (const playlist of PLAYLISTS) {
    console.log(`📋 Processing playlist: ${playlist.name}`);

    const objects = await getAllObjects(s3Client, playlist.prefix);
    const tracks = objects
      .map((object) => {
        const title = getS3ObjectTitle(object);
        if (!title) return null;

        return {
          title,
          url: getS3ObjectUrl(object),
          size: object.Size,
          lastModified: object.LastModified,
          isFavorite: getIsFavorite(object),
        };
      })
      .filter((track) => track !== null)
      .reverse(); // Most recent first

    console.log(`   Found ${tracks.length} tracks`);

    const rss = generateRSSFeed(
      `Selah V - ${playlist.name}`,
      playlist.description,
      tracks,
      playlist.id,
    );

    // Save to file
    const outputPath = path.join(__dirname, `../feeds/${playlist.id}.rss`);
    const outputDir = path.dirname(outputPath);

    // Create feeds directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, rss, 'utf-8');
    console.log(`   ✅ Saved to: ${outputPath}\n`);
  }

  console.log('🎉 All RSS feeds generated successfully!');
}

/**
 * Generate a single playlist RSS feed
 */
async function generateFeed(playlistId) {
  const playlist = PLAYLISTS.find((p) => p.id === playlistId);
  if (!playlist) {
    console.error(`Playlist "${playlistId}" not found`);
    return;
  }

  const s3Client = getAwsS3Client();

  console.log(`🎵 Generating RSS feed for: ${playlist.name}`);

  const objects = await getAllObjects(s3Client, playlist.prefix);
  const tracks = objects
    .map((object) => {
      const title = getS3ObjectTitle(object);
      if (!title) return null;

      return {
        title,
        url: getS3ObjectUrl(object),
        size: object.Size,
        lastModified: object.LastModified,
        isFavorite: getIsFavorite(object),
      };
    })
    .filter((track) => track !== null)
    .reverse();

  console.log(`Found ${tracks.length} tracks`);

  const rss = generateRSSFeed(
    `Selah V - ${playlist.name}`,
    playlist.description,
    tracks,
    playlist.id,
  );

  const outputPath = path.join(__dirname, `../feeds/${playlist.id}.rss`);
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, rss, 'utf-8');
  console.log(`✅ RSS feed saved to: ${outputPath}`);
}

// CLI interface
const args = process.argv.slice(2);
if (args.length === 0) {
  generateAllFeeds().catch(console.error);
} else {
  const playlistId = args[0];
  generateFeed(playlistId).catch(console.error);
}

module.exports = {
  generateAllFeeds,
  generateFeed,
  generateRSSFeed,
};
