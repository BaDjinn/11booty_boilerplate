/**
 * tubeFrame — Shortcode 11ty per YouTube.
 *
 * Uso:
 *   {% tubeFrame "VIDEO_ID", false %} // iframe youtube-nocookie lazy-load
 *   {% tubeFrame "VIDEO_ID", true %}  // anteprima ottimizzata + link al video
 */

const Image = require("@11ty/eleventy-img");

const IMAGE_URL_PATH = "/assets/images/";
const IMAGE_OUTPUT_DIR = "public/assets/images/";
const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function isValidYouTubeId(id) {
	return typeof id === "string" && YOUTUBE_ID_RE.test(id);
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

async function buildThumbnail(videoId, sizes) {
	const thumbURL = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
	const metadata = await Image(thumbURL, {
		widths: [320, 640, "auto"],
		formats: ["avif", "webp", "jpeg"],
		urlPath: IMAGE_URL_PATH,
		outputDir: IMAGE_OUTPUT_DIR,
		failOnError: false,
		cacheOptions: {
			duration: "7d",
			directory: ".cache/eleventy-img",
		},
	});

	return Image.generateHTML(metadata, {
		alt: `Anteprima del video ${videoId}`,
		sizes,
		loading: "lazy",
		decoding: "async",
	});
}

module.exports = async function tubeFrame(
	videoId,
	preview = false,
	{ sizes = "(max-width: 768px) 100vw, 640px" } = {},
) {
	if (!isValidYouTubeId(videoId)) {
		return `<div role="status" class="text-danger">ID video non valido.</div>`;
	}

	const safeVideoId = escapeHtml(videoId);
	const embedURL = `https://www.youtube-nocookie.com/embed/${safeVideoId}`;

	if (preview) {
		try {
			const picture = await buildThumbnail(videoId, sizes);
			return `
        <a class="tube-frame-preview" href="${embedURL}" target="_blank" rel="noopener noreferrer" aria-label="Apri video YouTube ${safeVideoId}">
          ${picture}
        </a>
      `;
		} catch (error) {
			console.error(
				`[tubeFrame] Thumbnail not available for ${videoId}`,
				error,
			);
			return `<a href="${embedURL}" target="_blank" rel="noopener noreferrer">Apri video</a>`;
		}
	}

	return `
    <div class="ratio ratio-16x9">
      <iframe
        src="${embedURL}"
        title="Riproduzione video ${safeVideoId}"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  `;
};
