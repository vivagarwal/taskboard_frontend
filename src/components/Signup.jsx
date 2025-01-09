import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock } from "lucide-react";

function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to store error message
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL; // Access base URL from environment variable

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Reset form values on component mount
  useEffect(() => {
    setFullname("");
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous error message
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    axios
      .post(`${baseUrl}/register`, {
        fullname,
        email,
        password,
      })
      .then((response) => {
        const result = response.data;
        console.log(result);
        if (result.message === "You have successfully registered!") {
          alert("You have successfully registered");
          navigate("/login");
        } else {
          // Handle other responses if needed
          console.log("Registration failed or unexpected response");
          setError(result.message); // Display server message as error
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err);

        // Handle different error scenarios
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message); // Set the error message from server
        } else if (err.request) {
          setError("Network Error: Please try again later");
        } else {
          setError("An unexpected error occurred");
        }
        resetForm();
      });
  };

  const resetForm = () => {
    setFullname("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-green-600 min-h-screen w-screen overflow-hidden">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-2">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome to Trello Style!
        </h2>

        {/* Display the error message if it exists */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative mb-4">
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <User className="absolute top-10 left-3 text-gray-400" size={20} />
            <input
              type="text"
              id="fullname"
              placeholder="Enter full name"
              autoComplete="off"
              name="fullname"
              className="w-full pl-10 pr-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
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
              required
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
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
