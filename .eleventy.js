module.exports = function(eleventyConfig) {
    // Configurazione di base
    eleventyConfig.addFilter("year", () => `${new Date().getFullYear()}`);
    eleventyConfig.addPassthroughCopy("src/css");
  
    return {
        dir: {
          input: "src",
          output: "public",
        },
      };
    };
