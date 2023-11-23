import React, { useEffect, useRef, useState } from "react";

// import "./App.css";
import html2canvas from "html2canvas";
// import markerjs2 from "markerjs2";
import { MarkerArea } from "markerjs2";
import AnnotatorWrapper from "./AnnotatorWrapper";
import annotate from "../packages/annotate";
import AnnotatorModal from "./AnnotatorModal";

function Annotator() {
  const [image, setImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);

  const takeScreenshot = () => {
    return html2canvas(document.body, {}).then((canvas) => {
      // console.log(canvas.toDataURL);
      setImage(canvas.toDataURL());
    });
  };

  // const ref = useRef(null);
  function showMarkerArea(target: any) {
    //@ts-ignore
    const markerArea = new MarkerArea(target);
    // markerArea.settings.displayMode = "popup";

    markerArea.addEventListener("render", (event) => {
      setImage(event.dataUrl);
    });
    markerArea.show();
  }

  function downloadImage(byteString: any, fileName: any) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = byteString;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(byteString);
  }
  const ref = useRef(null);

  // const keyStrokeDetection = () => {};

  let pressedKeys: any[] = [];

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);

  function handleKeydown(e: any) {
    if (!pressedKeys.includes(e.key)) {
      pressedKeys.push(e.key);

      if (
        pressedKeys.includes("Control") &&
        pressedKeys.includes("b") &&
        pressedKeys.length == 2
      ) {
        e.preventDefault();

        // openImage();
        // takeScreenshot().then(() => {});
        takeScreenshot().then(() => {
          // showMarkerArea(imgRef.current);
          setShowModal(true);
        });

        // showMarkerArea(document.body);
        // setShowModal(true);

        return;
      }
    }
  }

  function handleKeyup(e: any) {
    const index = pressedKeys.indexOf(e.key);
    pressedKeys.splice(index, 1);
  }

  useEffect(() => {}, []);

  return (
    <div className="App">
      <AnnotatorModal
        img={image}
        setImage={setImage}
        opened={showModal}
        close={() => {
          setShowModal(false);
        }}
        downloadImage={(fileName) => {
          downloadImage(image, fileName);
        }}
      />
      <div ref={ref} data-html2canvas-ignore>
        {/* {image && (
          <>
            <img
              ref={imgRef}
              width={"100%"}
              height={"100%"}
              style={{
                width: "100%",
                height: "100%",
              }}
              src={image}
              onClick={(e) => {
                showMarkerArea(e.target);
              }}
            />
            <button
              onClick={() => {
                downloadImage(image, "screenshot.png");
              }}
            >
              Download
            </button>
            <button
              onClick={() => {
                // downloadImage(image, "screenshot.png");
                setImage("");
              }}
            >
              Discard
            </button>
          </>
        )} */}
      </div>
    </div>
  );
}

export default Annotator;
