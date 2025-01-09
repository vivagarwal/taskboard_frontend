import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskForm = ({ taskId, onTaskSaved, onClose, status, boolColumnTask}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusValue, setStatusValue] = useState(status); // Status from props
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL; // Access base URL from environment variable

  useEffect(() => {
    if (taskId) {
      // Fetch existing task data if taskId is provided
      axios
        .get(`${baseUrl}/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const { title, description, status, priority, deadline } = response.data;
          setTitle(title);
          setDescription(description);
          setStatusValue(status); // Keep status unchangeable when editing
          setPriority(priority);
          setDeadline(deadline ? new Date(deadline).toISOString().substring(0, 10) : "");
        })
        .catch((error) => {
          console.error("Error fetching task data:", error);
          setError("Failed to fetch task details. Please try again later.");
        });
    } else {
      setStatusValue(status); // Set default status when creating new task
    }
  }, [taskId, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !statusValue) {
      setError("Title and status are required.");
      return;
    }

    const taskData = { title, description, status: statusValue, priority, deadline };

    try {
      if (taskId) {
        // Update existing task
        await axios.put(`${baseUrl}/api/tasks/${taskId}`, taskData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Task updated successfully");
      } else {
        // Create new task
        await axios.post(`${baseUrl}/api/tasks`, taskData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Task created successfully");
      }
      onTaskSaved();
    } catch (error) {
      console.error("Error saving task:", error);
      setError("An error occurred while saving the task. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center py-8 px-4 overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              required
              disabled={boolColumnTask ? true : false} // Disable when creating form through column
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
