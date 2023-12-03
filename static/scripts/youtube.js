document.addEventListener("DOMContentLoaded", function () {
  const appElement = document.getElementById("app");
  const API_KEY = "AIzaSyCaz3H-9NuNeNlYJKNLOlo9d7gb6ZArcbc"; // Replace with your actual YouTube Data API key

  function App() {
    const [emotion, setEmotion] = React.useState("");
    const [videos, setVideos] = React.useState([]);

    const fetchYouTubeVideos = async (emotion) => {
      try {
        // Construct the YouTube Data API endpoint for video search
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${emotion}&key=${API_KEY}`;

        // Make the request to the YouTube Data API
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch videos from YouTube Data API");
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Extract video information from the API response
        const videoItems = data.items || [];
        const videoIds = videoItems.map((item) => item.id.videoId);

        // Set the video data in the state
        setVideos(videoIds);
      } catch (error) {
        console.error("Error:", error);
      }
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
