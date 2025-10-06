// src/pages/Logout.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      try {
        await fetch("http://127.0.0.1:8000/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error("Logout error:", error);
      }

      // Clear tokens from local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Redirect to login
      navigate("/login");
    };

    logoutUser();
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
