import { useState, useEffect } from "react";
import "./App.css";
import { getDatabase, ref, push, set, onValue, remove } from "firebase/database";

function App() {
  const db = getDatabase();

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]); // সব task রাখার জন্য state

  // Input Handler
  const handleInput = (e) => {
    setTask(e.target.value);
    if (error) setError(false);
    if (success) setSuccess(false);
  };

  // Add Task
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

  // Fetch tasks (Realtime listener)
  useEffect(() => {
    const tasksRef = ref(db, "todoTask/");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        
        const taskArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setTasks(taskArray);
      } else {
        setTasks([]);
      }
    });
  }, [db]);

  // Delete Task
  const handleDelete = (id) => {
    remove(ref(db, "todoTask/" + id));
  };

  return (
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
            <div className="mt-3 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mt-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
              {success}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto w-full mt-8">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-gray-700 text-gray-100">
                  <th className="px-6 py-3 font-semibold text-left">Name</th>
                  <th className="px-6 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3">{item.taskName}</td>
                      <td className="px-6 py-3 flex items-center gap-3 justify-center">
                        <button className="px-4 py-2 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500 transition">
                           Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition"
                        >
                         Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center text-gray-300 py-6 italic"
                    >
                      No tasks found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
