import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Game from "./pages/Game";
function App() {

  

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = "scroll"
    };
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/game" element={<Game/>}/>
      </Routes>
    </Router>
  );
}

export default App


// pageX/Y coordinates are relative to the top left corner of the whole rendered page (including parts hidden by scrolling),
// 
// while clientX/Y coordinates are relative to the top left corner of the visible part of the page, "seen" through browser window.
// 
// screenX/Y are relative to the physical screen.