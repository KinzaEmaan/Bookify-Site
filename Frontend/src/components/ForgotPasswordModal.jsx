import React, { useState } from "react";

const ForgotPasswordModal = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowOtpInput(true); // Show OTP input boxes
        const data = await response.json();
        setMessage(data.message);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otp.join("") }), 
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setShowNewPasswordInput(true); 
      } else {
        const errorData = await response.json();
        setMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }), 
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setTimeout(() => closeModal(), 3000); // Close modal after 3 seconds
      } else {
        const errorData = await response.json();
        setMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <dialog className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Forgot Password</h3>
        <p className="py-4">Enter your email to reset your password.</p>
        <form onSubmit={handleSubmit}>
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
              required
            />
          </div>
          <div className="modal-action">
            <button
              type="submit"
              className="btn bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-pink-700"
              disabled={loading}
            >
              {loading ? "Loading..." : "Reset Password"}
            </button>
            <button type="button" className="btn ml-2" onClick={closeModal}>
              Close
            </button>
          </div>
        </form>
        {message && <div className="mt-4 text-red-500 text-sm">{message}</div>}
        {showOtpInput && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mt-4">
              <label htmlFor="otp" className="text-sm font-semibold">
                Enter OTP
              </label>
              <div className="flex">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[index] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-8 h-8 mr-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                ))}
              </div>
            </div>
            <div className="modal-action mt-4">
              <button
                type="submit"
                className="btn bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-pink-700"
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit OTP"}
              </button>
            </div>
          </form>
        )}
        {showNewPasswordInput && (
          <form onSubmit={handleNewPasswordSubmit}>
            <div className="mt-4">
              <label htmlFor="newPassword" className="text-sm font-semibold">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="confirmPassword" className="text-sm font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
                placeholder="Confirm new password"
                required
              />
            </div>
            <div className="modal-action mt-4">
              <button
                type="submit"
                className="btn bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-pink-700"
                disabled={loading}
              >
                {loading ? "Loading..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default ForgotPasswordModal;
