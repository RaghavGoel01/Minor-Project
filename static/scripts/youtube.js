document.addEventListener("DOMContentLoaded", function () {
  const appElement = document.getElementById("app");
  const API_KEY = "AIzaSyCI0JXbE134VDasjshNPQo1e-3QQSm1mWE";

  function App() {
    const [emotion, setEmotion] = React.useState("");
    const [videos, setVideos] = React.useState([]);

    const emotionsMap = {
      happy: "upbeat",
      sad: "melancholic",
      angry: "intense",
      fear: "calm",
      neutral: "energetic",
      disgust: "nostalgic",
      surprise: "surprising",
      // Add more emotions and their corresponding video genres
    };

const fetchYouTubeVideos = async (emotion) => {
  try {
    const query = emotion.toLowerCase(); // Use the emotion directly as the search query

    const maxResults = 10; // You can adjust this number to fetch more or fewer videos
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}&maxResults=${maxResults}`;


    // Make the request to the YouTube Data API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("YouTube API Error:", errorData.error.message);
      throw new Error("Failed to fetch videos from YouTube Data API");
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Extract video information from the API response
    const videoItems = data.items || [];
    const filteredVideoIds = videoItems
      .filter(
        (item) => item.snippet.thumbnails && item.snippet.thumbnails.default
      )
      .map((item) => item.id.videoId);

    // Set the video data in the state, or use a default set if no videos are found
    setVideos(
      filteredVideoIds.length > 0 ? filteredVideoIds : getDefaultVideos()
    );
  } catch (error) {
    console.error("Error:", error);
  }
};


    const getDefaultVideos = async () => {
      try {
        // Fetch a set of random video IDs (replace this with your logic)
        const randomVideoIds = await fetchRandomVideoIds();

        return randomVideoIds || ["abc123", "def456", "ghi789"];
      } catch (error) {
        console.error("Error fetching random videos:", error);
        return ["abc123", "def456", "ghi789"]; // Default to a set of random video IDs
      }
    };

    const fetchRandomVideoIds = async () => {
      // Implement logic to fetch a set of random video IDs here
      // For example, you can make another API call or use a random video ID generator
      // Replace the following line with your logic
      const response = await fetch("https://example.com/api/random-video-ids");
      const data = await response.json();
      return data.videoIds;
    };

    const handleEmotionChange = (e) => {
      const selectedEmotion = e.target.value;
      setEmotion(selectedEmotion);

      // Fetch videos when the user selects an emotion
      fetchYouTubeVideos(selectedEmotion);
    };

    return React.createElement(
      "div",
      null,
      React.createElement("h1", null, "Emotion-Based Video Recommendations"),
      React.createElement("label", null, "Select your emotion:"),
      React.createElement("input", {
        type: "text",
        placeholder: "Enter emotion...",
        value: emotion,
        onChange: handleEmotionChange,
      }),

      React.createElement(
        "div",
        { className: "music-video-container" },
        videos.map((videoId, index) =>
          React.createElement(
            "div",
            { key: index, className: "music-video" },
            React.createElement("iframe", {
              width: "300",
              height: "200",
              src: `https://www.youtube.com/embed/${videoId}`,
              title: "YouTube video player",
              frameBorder: "0",
              allow:
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: true,
            })
          )
        )
      )
    );
  }

  function render() {
    ReactDOM.render(React.createElement(App), appElement);
  }

  render();
});
