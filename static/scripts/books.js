document.addEventListener("DOMContentLoaded", function () {
  const appElement = document.getElementById("app");
  const API_KEY = "AIzaSyAxD4CT_JRUz3BP90ndDYN6HzSg44D95Go";

  // Define a mapping of emotions to book genres
  const emotionGenreMap = {
    happy: "fiction",
    sad: "romance",
    angry: "thriller",
    neutral: "history",
    disgust: "horror",
    fear: "mystery",
    surprise: "fantasy",
  };

  function App() {
    const [query, setQuery] = React.useState("");
    const [books, setBooks] = React.useState([]);

    React.useEffect(() => {
      if (query) {
        // Get the corresponding genre for the emotion
        const genre = emotionGenreMap[query.toLowerCase()] || "fiction"; // Default to "fiction" if no mapping is found

        // Fetch books from the Google Books API
        fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${genre}&key=${API_KEY}&maxResults=10`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
            setBooks((prevBooks) => shuffle(data.items || []));
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }, [query]);

    // Function to shuffle an array
    const shuffle = (array) => {
      let currentIndex = array.length,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    };

    return React.createElement(
      "div",
      null,
      React.createElement("h1", null, "Emotion-Based Book Recommendations"),
      React.createElement("input", {
        type: "text",
        placeholder: "Enter an emotion or keyword",
        value: query,
        onChange: (e) => setQuery(e.target.value),
      }),

      React.createElement(
        "div",
        { className: "book-card-container" },
        books.map((book, index) =>
          React.createElement(
            "div",
            { key: index, className: "book-card" },
            React.createElement(
              "a",
              {
                href: book.volumeInfo.infoLink,
                target: "_blank", // Open the link in a new tab
              },
              React.createElement("img", {
                src:
                  book.volumeInfo.imageLinks?.thumbnail ||
                  "./assets/img/alt-img.gif",
                alt: "Book Cover",
              })
            ),
            React.createElement(
              "div",
              { className: "book-info" },
              React.createElement("h2", null, book.volumeInfo.title),
              React.createElement(
                "p",
                null,
                "Author: ",
                book.volumeInfo.authors
                  ? book.volumeInfo.authors.join(", ")
                  : "Unknown"
              ),
              React.createElement(
                "p",
                null,
                "Description: ",
                book.volumeInfo.description || "No description available"
              )
            )
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
