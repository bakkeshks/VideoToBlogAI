const { AssemblyAI } = require("assemblyai");

const transcribeAudio = async (filePath) => {
  try {
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY,
    });
    const transcript = await client.transcripts.transcribe({
      audio: filePath,
    });
    return transcript.text;
  } catch (error) {
    console.error("Error during transcription", error);
    throw error;
  }
};

module.exports = { transcribeAudio };
