// Simple webpack loader for component tagging
module.exports = function(source) {
  // This loader passes through the source code unchanged
  // In a real implementation, this would add visual editing tags
  return source;
};

module.exports.pitch = function() {
  // Pitch function is required for webpack loaders
  return undefined;
};