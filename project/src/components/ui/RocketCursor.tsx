import React, { useEffect } from "react";

const RocketCursor: React.FC = () => {
  useEffect(() => {
    document.body.style.cursor = "auto"; // system cursor
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return null;
};

export default RocketCursor;
