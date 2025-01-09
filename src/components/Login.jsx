import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Mail } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL; // Access base URL from environment variable

  // Reset form values on component mount
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!(email && password)) {
      alert("Please enter all the information");
      return;
    }

    // Clear previous error message
    setErrorMessage("");

    axios
      .post(
        `${baseUrl}/login`,
        { email, password },
        { withCredentials: true }
      )
      .then((response) => {
        const result = response.data;
        console.log(result);
        const { user , token } = response.data;

        if (user && token) {
          // Store user info in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Set the default Authorization header for future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        if (result.message === "You have successfully logged in!") {
          navigate("/taskboard"); //
        } else {
          // Handle other responses if needed
          console.log("Login failed or unexpected response");
          resetForm();
        }
      })
      .catch((error) => {
        console.error("Error:", error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message); // Set the error message
        } else {
          setErrorMessage("An unexpected error occurred."); // Default error message
        }

        resetForm();
      });
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-red-500 to-indigo-600 min-h-screen w-screen overflow-hidden">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-2">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {/* Display the error message if it exists */}
        {errorMessage && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Mail className="absolute top-10 left-3 text-gray-400" size={20} />
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className="w-full pl-10 pr-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Lock className="absolute top-10 left-3 text-gray-400" size={20} />
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              name="password"
              className="w-full pl-10 pr-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
