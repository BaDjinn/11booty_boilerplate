module.exports = function(eleventyConfig) {
    // Configurazione di base
    eleventyConfig.addPassthroughCopy("src/css");
  
    return {
      dir: {
        input: "src",
        output: "_site"
      }
    };
  };
  