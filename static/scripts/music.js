document.addEventListener("DOMContentLoaded", async function () {
  const musicSuggestionsElement = document.getElementById("musicSuggestions");

  // Define a mapping of emotions to genres
  const emotionGenreMap = {
    neutral: "pop",
    sad: "blues",
    happy: "dance",
    angry: "rock",
    disgust: "metal",
    fear: "classical",
    surprise: "jazz",
  };

  window.fetchSpotifyMusic = async () => {
    const url = "https://spotify23.p.rapidapi.com/search/";
    const rapidApiKey = "4ad34a19c4msh29bdb34e9fa8279p186e67jsn27651f54f44e"; // Replace with your actual RapidAPI key
    const emotionInput = document
      .getElementById("emotionInput")
      .value.toLowerCase(); // Convert to lowercase for consistency

    // Get the corresponding genre for the emotion
    const genre = emotionGenreMap[emotionInput] || "pop"; // Default to "pop" if no mapping is found

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
      },
    };

    try {
      const queryParams = new URLSearchParams({
        q: genre, // Use the genre as the search parameter
        type: "multi",
        offset: 0,
        limit: 10,
        numberOfTopResults: 5,
      });

      const response = await fetch(`${url}?${queryParams.toString()}`, options);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch music from Spotify API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);

      displayMusicSuggestions(data.tracks || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const displayMusicSuggestions = (musicItems) => {
    console.log("Received music items:", musicItems);
    musicSuggestionsElement.innerHTML = "";

    if (musicItems && musicItems.items && musicItems.items.length > 0) {
      musicItems.items.forEach((item) => {
        const musicCard = document.createElement("div");
        musicCard.classList.add("music-card");

        const musicTitle = document.createElement("h3");
        musicTitle.textContent = item.data.name; // Accessing the name property under data

        const artistName = item.data.artists
          ? item.data.artists.items[0].profile.name
          : "Unknown Artist";
        const artistInfo = document.createElement("p");
        artistInfo.textContent = `Artists: ${artistName}`;

        const albumName = item.data.albumOfTrack
          ? item.data.albumOfTrack.name
          : "Unknown Album";

        const albumInfo = document.createElement("p");
        albumInfo.textContent = `Album: ${albumName}`;

        // const coverPhoto = item.data.albumOfTrack
        //   ? item.data.albumOfTrack.coverArt.sources[0]?.url ||
        //     "./assets/img/music1.jpg"
        //   : "./assets/img/music1.jpg";

        // const coverPhotoImg = document.createElement("img");
        // coverPhotoImg.src = coverPhoto;
        // coverPhotoImg.alt = "Album Cover";
        // coverPhotoImg.width = 100; // Set the desired width
        // coverPhotoImg.height = 100; // Set the desired height

        // 123;

        const coverPhoto = item.data.albumOfTrack
          ? item.data.albumOfTrack.coverArt.sources[0]?.url ||
            "./assets/img/music1.jpg"
          : "./assets/img/music1.jpg";

        const songLink = item.data.albumOfTrack
          ? item.data.albumOfTrack.sharingInfo.shareUrl || "#"
          : "#";

        const coverPhotoLink = document.createElement("a");
        coverPhotoLink.href = songLink;
        coverPhotoLink.target = "_blank"; // Open the link in a new tab

        const coverPhotoImg = document.createElement("img");
        coverPhotoImg.src = coverPhoto;
        coverPhotoImg.alt = "Album Cover";
        coverPhotoImg.width = 100; // Set the desired width
        coverPhotoImg.height = 100; // Set the desired height

        coverPhotoLink.appendChild(coverPhotoImg);

        const musicCaard = document.createElement("div");
        musicCaard.classList.add("music-card");
        musicCaard.appendChild(musicTitle);
        musicCaard.appendChild(artistInfo);
        musicCaard.appendChild(albumInfo);
        musicCaard.appendChild(coverPhotoLink); // Adding the cover photo link to the card

        musicSuggestionsElement.appendChild(musicCaard);

        musicSuggestionsElement.appendChild(musicCaard);
      }); // Closing parenthesis was missing here
    } else {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "No music suggestions found.";
      musicSuggestionsElement.appendChild(noResultsMessage);
    }
  };
});
