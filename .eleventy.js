const Image = require("@11ty/eleventy-img");
const tubeFrame = require("./src/shortcodes/tubeFrame");

const OUTPUT_DIR = "public";
const IMAGE_URL_PATH = "/assets/images/";
const IMAGE_OUTPUT_DIR = `${OUTPUT_DIR}${IMAGE_URL_PATH}`;

async function imageShortcode(src, alt, sizes = "100vw") {
	if (!alt && alt !== "") {
		throw new Error(`Missing alt text for image: ${src}`);
	}

	try {
		const metadata = await Image(src, {
			widths: [320, 640, 960, "auto"],
			formats: ["avif", "webp", "jpeg"],
			urlPath: IMAGE_URL_PATH,
			outputDir: IMAGE_OUTPUT_DIR,
			failOnError: false,
		});

		return Image.generateHTML(metadata, {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		});
	} catch (error) {
		console.error(`[imageShortcode] Image not available: ${src}`, error);
		return `<p role="status">Immagine non disponibile.</p>`;
	}
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addFilter("year", () => String(new Date().getFullYear()));

	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/assets");
	eleventyConfig.addPassthroughCopy({
		"node_modules/bootstrap/dist/css/bootstrap.min.css":
			"assets/vendor/bootstrap/bootstrap.min.css",
		"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js":
			"assets/vendor/bootstrap/bootstrap.bundle.min.js",
	});

	eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
	eleventyConfig.addNunjucksAsyncShortcode("tubeFrame", tubeFrame);

	return {
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
		dir: {
			input: "src",
			includes: "_includes",
			output: OUTPUT_DIR,
		},
	};
};
