const Image = require("@11ty/eleventy-img");
const tubeFrame = require("./src/shortcodes/tubeFrame");

// Shortcode per le immagini
async function imageShortcode(src, alt, sizes) {
  let metadata;
  let sourcePath = `${src}`;
  try {
    metadata = await Image(sourcePath, {
      widths: [300, 800, null],
      formats: ["avif", "jpeg"],
      urlPath: "/assets/images",
      outputDir: "public/assets/images/",
    });
  } catch (error) {
    console.error("Errore nel caricamento dell'immagine:", error);
    return `<p>Immagine non disponibile a ${sourcePath}</p>`;
  }

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  // Configurazione di base
  eleventyConfig.addFilter("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/404.html");
  eleventyConfig.addNunjucksAsyncShortcode("EleventyImage", imageShortcode);
  eleventyConfig.addPassthroughCopy("./src/assets/images");
  // Shortcode per iframe di YouTube con supporto per la thumbnail
  eleventyConfig.addNunjucksAsyncShortcode("tubeFrame", tubeFrame);

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
