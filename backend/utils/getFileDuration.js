async function getDuration(filePath) {
  // Dynamically import the ES module
  const { parseFile } = await import("music-metadata");
  const metadataResult = await parseFile(filePath);
  return metadataResult.format.duration;
}

module.exports = { getDuration };

// Function to handle the duration result and errors
async function handleDuration(filePath) {
  try {
    const duration = await getDuration(filePath);
    return duration;
  } catch (error) {
    console.error("Error getting audio duration:", error);
    throw error;
  }
}

module.exports.handleDuration = handleDuration;
