const path = require("path");

module.exports = {
  // Other configurations
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
};
