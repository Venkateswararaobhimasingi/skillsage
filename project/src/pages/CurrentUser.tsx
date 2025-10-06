import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserData {
  id: number;
  username: string;
  email: string;
}

const CurrentUser: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/me/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setUser(response.data);
    } catch (err: any) {
      console.error("Error fetching user:", err.response?.data || err.message);
      setError("You are not authorized. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Current User</h1>

      {loading ? (
        <p>Loading user data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : user ? (
        <div>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default CurrentUser;
