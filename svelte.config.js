import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
    // paths: {
    //   base: process.env.NODE_ENV === "production" ? "/selah_v_music_log" : "",
    // },
	},
};

export default config;
