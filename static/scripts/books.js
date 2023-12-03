document.addEventListener("DOMContentLoaded", function () {
  const appElement = document.getElementById("app");
  const API_KEY = "AIzaSyAxD4CT_JRUz3BP90ndDYN6HzSg44D95Go";

  function App() {
    const [query, setQuery] = React.useState("");
    const [books, setBooks] = React.useState([]);

    React.useEffect(() => {
      if (query) {
        // Fetch books from the Google Books API
        fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=10`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
            setBooks(data.items || []);
            console.log("Rendering App with books:", books);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }, [query]);

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
                target: "https://books.google.co.in/", // Open the link in a new tab
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
