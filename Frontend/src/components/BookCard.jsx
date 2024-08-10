import React from 'react';

const BookCard = ({ book, handleDownload }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="w-full h-48 flex items-center justify-center bg-gray-200">
        <img 
          src={book.image_path} 
          alt={book.title} 
          className="max-w-full max-h-full object-contain" 
          onError={(e) => e.target.src = '/images/default.jpg'} 
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{book.title}</h2>
        <p className="text-gray-700 mb-2">{book.author}</p>
        <p className="text-gray-500 text-sm">{book.description}</p>
        <button onClick={() => handleDownload(book.file_path)} className="btn btn-sm btn-primary mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 inline-block mr-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default BookCard;
