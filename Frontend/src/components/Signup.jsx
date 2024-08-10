import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json(); // Parse JSON response

      if (response.ok) {
        console.log(responseData); 
        
        setTimeout(() => {
          window.location.href = "/login"; 
        }, 1000);

      } else {
        console.error(responseData.error); 
        setErrorMessage(responseData.error); 
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className={`max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-10 ${darkMode ? 'dark-mode' : ''}`}>
      <div className="w-full md:w-1/2 md:order-1 order-2 mt-12 md:mt-36">
        <div className="space-y-8">
          <h1 className="text-2xl md:text-4xl font-bold">
            Hello, Welcome{" "}
            <span className="text-pink-500">to Bookify!</span>
          </h1>
          <p className="text-sm md:text-xl text-gray-500">
          Efficiently organize and track your book collection with streamlined book management solutions!
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 md:order-2 order-1 mt-10 md:mt-32">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:bg-slate-900 dark:text-white">
              Please Register Yourself
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-pink-700"
              >
                Sign up
              </button>
            </form>

            {errorMessage && (
              <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>
            )}

            <p className="mt-4 text-center text-sm text-gray-500">
              Already a member?{" "}
              <Link
                to="/login"
                className="font-semibold leading-6 text-pink-500 hover:text-pink-700"
              >
                Login to your Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="text-pink-500 hover:text-pink-700 focus:outline-none"
        >
        </button>
      </div>
    </div>
  );
}

export default Signup;
