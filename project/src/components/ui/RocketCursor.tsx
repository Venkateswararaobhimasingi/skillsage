import React, { useEffect, useRef, useState } from "react";

const RocketCursor: React.FC = () => {
  const cursorRef = useRef<HTMLImageElement | null>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0 // Type assertion for msMaxTouchPoints
      );
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return; // Do not apply custom cursor on touch devices

    const moveCursor = (e: MouseEvent) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Determine if the hovered element is interactive
        const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
        if (
          hoveredElement &&
          (hoveredElement.tagName === "A" || // Links
            hoveredElement.tagName === "BUTTON" || // Buttons
            hoveredElement.tagName === "INPUT" || // Input fields
            hoveredElement.tagName === "TEXTAREA" || // Text areas
            hoveredElement.getAttribute("role") === "button" || // Elements with role="button"
            hoveredElement.closest('button') // Check if it's inside a button
          )
        ) {
          setIsHoveringInteractive(true);
        } else {
          setIsHoveringInteractive(false);
        }
      }
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, [isTouchDevice]);

  // Do not render the custom cursor on touch devices
  if (isTouchDevice) return null;

  return (
    <img
      ref={cursorRef}
      // Reverted to local image paths as confirmed by the user
      src={isHoveringInteractive 
            ? "/left.png" // Use your actual left.png from the public folder
            : "/cursor.png"} // Use your actual cursor.png from the public folder
      alt="custom-cursor"
      style={{
        position: "fixed",
        width: "20px",
        height: "20px",
        pointerEvents: "none", // Ensures the cursor doesn't interfere with clicks
        zIndex: 9999, // Ensures the cursor is always on top
        transform: "translate(-50%, -50%)", // Centers the cursor image on the mouse pointer
        transition: "transform 0.05s ease-out", // Smooth transition for movement
      }}
    />
  );
};

export default RocketCursor;
