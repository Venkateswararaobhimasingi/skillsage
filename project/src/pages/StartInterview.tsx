import React, { useState } from "react";

export default function StartInterview() {
  const [course, setCourse] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();

    if (!course.trim()) {
      setError("Please enter a course name.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token"); // JWT token from login

      const response = await fetch("http://127.0.0.1:8000/api/start-interview/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ course, difficulty }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      setQuestions(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Start AI Interview
        </h1>

        {/* Form */}
        <form onSubmit={handleGenerateQuestions} className="space-y-4">
          {/* Course Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g., Data Structures"
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300 text-gray-800"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>
        </form>

        {/* Error message */}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        {/* Display Generated Questions */}
        {questions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">
              Generated Questions
            </h2>
            <ul className="space-y-3">
              {questions.map((q, index) => (
                <li
                  key={index}
                  className="border p-4 rounded-xl shadow-md bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Order: {q.order}</span>
                    <span>Time: {q.allocated_time} sec</span>
                  </div>
                  <p className="mt-2 text-gray-900 font-medium">{q.question}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
