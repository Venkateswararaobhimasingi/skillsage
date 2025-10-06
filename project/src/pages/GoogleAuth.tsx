import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access && refresh) {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      navigate("/dashboard");
    } else {
      alert("Google login failed");
      navigate("/login");
    }
  }, []);

  return <div>Logging you in...</div>;
};

export default GoogleAuth;
