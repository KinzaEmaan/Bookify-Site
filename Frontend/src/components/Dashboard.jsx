import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from './BookCard';

function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [books, setBooks] = useState([]);
  const [showBooks, setShowBooks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noSuchBook, setNoSuchBook] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const toggleBooks = () => {
    if (!showBooks) {
      fetchBooks();
    }
    setShowBooks((prevShowBooks) => !prevShowBooks);
  };

  const filterBooks = () => {
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredBooks);
    setNoSuchBook(filteredBooks.length === 0);
  };

  useEffect(() => {
    filterBooks();
  }, [searchQuery, books]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (response.ok) {
        window.location.href = '/login'; // Redirect to login page
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDownload = async (filePath) => {
    try {
      const response = await fetch(`http://localhost:4000/api/books/download/${filePath}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
        credentials: 'same-origin', // Include credentials in the request
      });
  
      console.log('Download response headers:', response.headers); // Log the response headers
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filePath.split('/').pop(); // Extract the file name from the path
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  


  return (
    <div className={`max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col my-10 ${darkMode ? 'dark-mode' : ''}`}>
      <div className="navbar bg-base-100 sticky top-0 z-50">
        <div className="flex-1">
          <Link to="/dashboard" className="btn btn-ghost text-xl">Bookify</Link>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full mt-12 md:mt-36">
        <div className="space-y-8">
          <h1 className="text-2xl md:text-4xl font-bold">
            Welcome to the Dashboard
          </h1>
          <p className="text-sm md:text-xl text-gray-500">
            This is your dashboard where you can manage all your activities.
          </p>
          <button onClick={toggleBooks} className="btn btn-primary">
            {showBooks ? 'Hide Books' : 'All Books'}
          </button>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="text-pink-500 hover:text-pink-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            {darkMode ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m4.22 1.62l.82.82M21 12h-16.5"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3.75v16.5M21.75 12h-16.5"
              />
            )}
          </svg>
        </button>
      </div>
      {showBooks && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.length > 0 ? (
            searchResults.map(book => (
              <BookCard key={book.id} book={book} handleDownload={handleDownload} />
            ))
          ) : (
            <div className="text-center text-gray-500">No such book</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
