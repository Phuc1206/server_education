const { google } = require("googleapis");
const youtube = google.youtube("v3");
const iso8601Duration = require("iso8601-duration");
async function getYouTubeVideoDuration(videoUrl) {
  const videoId = extractYouTubeVideoId(videoUrl); // Implement this function to extract video ID from the URL
  const response = await youtube.videos.list({
    key: "AIzaSyBu0LppT8J75pRXY8Z-2lvGHjfu91blpMA",
    part: "contentDetails",
    id: videoId,
  });

  if (response.data.items.length === 0) {
    throw new Error("Video not found");
  }

  const duration = response.data.items[0].contentDetails.duration;
  return iso8601Duration.toSeconds(iso8601Duration.parse(duration));
}

function extractYouTubeVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
}
module.exports = getYouTubeVideoDuration;
