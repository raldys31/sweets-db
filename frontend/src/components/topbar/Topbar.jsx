import React from "react";
import "./topbar.css";

// Raldys
// Function that manages the topbar rendering
// Returns the topbar component
export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div className="logo text-primary">SweetsDB</div>
        </div>
        <div className="topRight">
          <div className="logo text-success">Panadería Mi Arcoiris</div>
        </div>
      </div>
    </div>
  );
}