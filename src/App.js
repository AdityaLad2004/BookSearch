import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [bookName, setBookName] = useState('');

  const handleInputChange = (event) => {
    setBookName(event.target.value);
  };

  const handleUserMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
  };

  const clearResult = () => {
    setMessages([]);
  };

  const handleBotMessage = (message, image) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'bot', image }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    handleUserMessage(bookName);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}&maxResults=40`
      );

      if (response.data.items && response.data.items.length > 0) {
        const books = response.data.items;

        books.forEach((book) => {
          const { title, authors, publishedDate, description, imageLinks } = book.volumeInfo;
          const bookInfo = (
            <div className="book-info-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20,padding:20 }}>
              <div className="book-details" style={{}}>
                <div className="book-title"><b>Title:</b>{title || 'Title not found'}</div>
                <div className="book-authors"><b>Authors:</b> {authors ? authors.join(', ') : 'Author not found'}</div>
                <div className="book-published-date"><b>Published Date:</b> {publishedDate || 'Publication date not found'}</div>
                <div className="book-description"><b>Description:</b> {description || 'Description not found'}</div>
              </div>
              <div className="book-thumbnail">
                {imageLinks && <img src={imageLinks.thumbnail} alt="Book Thumbnail" />}
              </div>
            </div>
          );
          handleBotMessage(bookInfo);
        });
      } else {
        handleBotMessage('No books found');
      }
    } catch (error) {
      console.error(error);
    }

    setBookName('');
  };

  return (
    <div className="chatbot-container">
      <div style={{ position: 'fixed' }}>
        <form className="chatbot-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter prompt related to book"
            value={bookName}
            onChange={handleInputChange}
          />
          <button type="submit">Send</button>
          <button type="button" onClick={clearResult}>
            Clear
          </button>
        </form>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chatbot-message ${message.sender}`}>
            {message.text}
            {message.image && <img src={message.image} alt="Book Thumbnail" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
