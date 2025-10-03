import { useState } from "react";
import "./App.css";
import { getDatabase, ref, push, set } from "firebase/database";

function App() {
  const db = getDatabase();

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [task, setTask] = useState("");

  const handleInput = (e) => {
    setTask(e.target.value);
    if (error) setError(false); 
    if (success) setSuccess(false); 
  };

  const handleClick = () => {
    if (!task.trim()) {
      setError("⚠️ Task is missing!");
    } else {
     
      const newTaskRef = push(ref(db, "todoTask/"));
      set(newTaskRef, {
        taskName: task,
      })
        .then(() => {
          setSuccess("✅ Task added successfully!");
          setTask(""); 
        })
        .catch((err) => setError("❌ Failed to add task: " + err.message));
    }
  };

  return (
    <>
      <div className="bg-cyan-800 min-h-screen py-[100px]">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="w-full sm:w-[500px] mx-auto">
            
            {/* Input + Button */}
            <div className="flex gap-3 items-center">
              <input
                value={task}
                onChange={handleInput}
                type="text"
                placeholder="Enter your task..."
                className="flex-1 px-4 py-3 bg-[#1a1a1a] text-gray-200 placeholder-gray-500 rounded-2xl border border-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              <button
                className="px-6 py-3 w-[110px] rounded-lg bg-black text-white font-medium shadow-md hover:bg-gray-900 hover:shadow-lg hover:ring-2 hover:ring-cyan-400 transition"
                onClick={handleClick}
              >
                 Add
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mt-3 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.607c.75 1.337-.213 2.994-1.742 2.994H3.48c-1.53 0-2.493-1.657-1.743-2.994L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mt-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                 {success}
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto w-full mt-8">
              <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gray-700 text-gray-100">
                    <th className="px-6 py-3 font-semibold text-left">Name</th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-gray-50 transition">
                    <td className="px-6 py-3">John Doe</td>
                    <td className="px-6 py-3 flex items-center gap-3 justify-center">
                      <button className="px-4 py-2 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500 transition">
                         Edit
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition">
                         Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default App;
