import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import html2canvas from "html2canvas";
import { app } from "./utils/firebase";
//@ts-ignore
import annotate from "screen-share-annotator";

function App() {
  const ref = useRef(null);

  useEffect(() => {
    annotate(app, "your_template_id", "your_service_id", "your_public_key");
  }, []);

  return (
    <div className="App" ref={ref}>
      <header className="App-header">
        <h1>Hello Annotator</h1>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
