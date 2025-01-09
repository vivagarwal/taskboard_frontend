import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function uniqueStr(status) {
  let uniqueNumber = Math.floor(Math.random() * 10000) + 1;
  let numberAsString = uniqueNumber.toString();
  return status + "_" + numberAsString
}

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("To-Do");
  const [createColumnTask, setCreateColumnTask] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL; // Access base URL from environment variable

  // Fetch tasks for the logged-in user
  const fetchTasks = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseUrl}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTasks(response.data.tasks))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSaved = () => {
    fetchTasks();
    setIsFormOpen(false);
  };

  const handleEditTask = (taskId) => {
    setSelectedTaskId(taskId);
    setIsFormOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTaskId(null);
    setFormStatus("To-Do");
    setIsFormOpen(true);
  };

  const handleCreateTaskInColumn = (status) => {
    setSelectedTaskId(null);
    setFormStatus(status);
    setIsFormOpen(true);
    setCreateColumnTask(true);
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${baseUrl}/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    },
    {
      "To-Do": [],
      "In Progress": [],
      "Under Review": [],
      "Completed": [],
    }
  );

  const statusColors = {
    "To-Do": "bg-blue-100",
    "In Progress": "bg-yellow-100",
    "Under Review": "bg-purple-100",
    "Completed": "bg-green-100",
  };

  const onDragEnd = async (result) => {
    //console.log("onDragEnd result:", result);

    const { source, destination, draggableId } = result;

    //console.log("Source Droppable ID:", source.droppableId);
    //console.log("Destination Droppable ID:", destination ? destination.droppableId : "None");
    //console.log("Draggable ID:", draggableId);

    if (!destination) {
      console.log("Dropped outside the list");
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.log("Dropped in the same place");
      return;
    }

    const draggedTask = tasks.find((task) => task._id === draggableId);
    if (!draggedTask) {
      console.error("Task not found for ID:", draggableId);
      return;
    }

    const newStatus = destination.droppableId.split('_')[0];
    const updatedTask = { ...draggedTask, status: newStatus };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${baseUrl}/api/tasks/${draggableId}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newTasks = tasks.map((task) =>
        task._id === draggableId ? updatedTask : task
      );
      setTasks(newTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Task Board</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Create New Task
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(tasksByStatus).map((status) => (
            <Droppable droppableId={uniqueStr(status)} key={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 bg-gray-50 rounded-lg shadow min-h-[500px]"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-center">
                    {status}
                  </h2>
                  <div className="space-y-4">
                    {tasksByStatus[status].map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className={`p-4 rounded-lg shadow-lg ${statusColors[task.status]}`}
                          >
                            <h3 className="text-xl font-bold mb-2">
                              {task.title}
                            </h3>
                            <p className="text-gray-700 mb-2">
                              {task.description}
                            </p>
                            <div className="text-sm mb-2">
                              <p className="text-gray-600">
                                <strong>Priority:</strong> {task.priority}
                              </p>
                              <p className="text-gray-600">
                                <strong>Deadline:</strong>{" "}
                                {new Date(
                                  task.deadline
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <button
                                onClick={() => handleEditTask(task._id)}
                                className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  <button
                    onClick={() => handleCreateTaskInColumn(status)}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mt-4 w-full"
                  >
                    Add New Task
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {isFormOpen && (
        <TaskForm
          taskId={selectedTaskId}
          status={formStatus}
          onTaskSaved={handleTaskSaved}
          onClose={() => setIsFormOpen(false)}
          boolColumnTask={createColumnTask}
        />
      )}
    </div>
  );
};

export default TaskBoard;
