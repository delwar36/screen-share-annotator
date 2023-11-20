import zIndex from "@mui/material/styles/zIndex";
import html2canvas from "html2canvas";

import { MarkerArea } from "markerjs2";

const takeScreenShot = async (img) => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    preferCurrentTab: true,
  });

  const track = stream.getVideoTracks()[0];

  const imageCapture = new ImageCapture(track);

  const bitmap = await imageCapture.grabFrame();

  track.stop();

  const canvas = document.createElement("canvas");

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
  const image = canvas.toDataURL();
  img.src = image;

  return image;
  // return frame;
};

function showMarkerArea(target) {
  const markerArea = new MarkerArea(target);
  console.log(markerArea);
  markerArea.settings.displayMode = "popup";
  markerArea.uiStyleSettings.zIndex = "1000";
  // markerArea.pos;a

  markerArea.uiStyleSettings.backgroundColor = "rgba(0,0,0,0.5)";
  // markerArea.uiStyleSettings
  markerArea.addEventListener("render", (event) => {
    // console.log(event);
    target.src = event.dataUrl;
  });
  markerArea.show();
}

function downloadImage(byteString, fileName) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = byteString;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(byteString);
}

export default function annotate() {
  //@ts-ignore
  // const dom = document.body;
  const root = document.getElementById("root");

  const preMain = document.getElementById("main");
  preMain?.remove();

  const main = document.createElement("div");
  main.id = "main";

  var tool = document.createElement("div");

  // Set its inner HTML
  // tool.innerHTML = "I'm a sticky block!";

  // Set the CSS properties
  tool.style.position = "fixed";
  tool.style.top = "0px";
  tool.style.left = "0px";
  tool.style.width = "100%";
  tool.style.zIndex = "1000";
  tool.style.backgroundColor = "#f9f9f9";
  tool.style.padding = "10px";
  tool.style.zIndex = "1000";

  // document.body.appendChild(tool);

  const annotatorModal = document.createElement("div");

  annotatorModal.style.display = "none";
  annotatorModal.style.position = "fixed";
  annotatorModal.style.top = "0";
  annotatorModal.style.left = "0";
  annotatorModal.style.width = "100%";
  annotatorModal.style.height = "100%";
  annotatorModal.style.justifyContent = "center";
  annotatorModal.style.alignItems = "center";
  annotatorModal.style.backgroundColor = "rgba(0,0,0,0.5)";
  annotatorModal.style.overflow = "auto";
  annotatorModal.style.zIndex = "1000";
  annotatorModal.id = "annotator";

  const annotator = document.createElement("div");
  annotator.style.display = "flex";
  annotator.style.flexDirection = "column";
  annotator.style.justifyContent = "center";
  annotator.style.width = "80%";
  annotator.style.height = "fit-content";
  annotator.style.marginLeft = "auto";
  annotator.style.marginRight = "auto";
  annotator.style.backgroundColor = "white";
  annotator.style.padding = "10px";
  annotator.style.borderRadius = "10px";
  annotator.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  annotator.style.textAlign = "center";
  annotator.style.overflowY = "scroll";
  annotator.style.zIndex = "1000";

  const emailDiv = document.createElement("div");
  emailDiv.id = "email";
  emailDiv.style.marginTop = "20px";
  emailDiv.style.display = "none";
  emailDiv.style.flexDirection = "column";
  emailDiv.style.justifyContent = "center";

  const recipient = document.createElement("input");
  recipient.type = "email";
  recipient.placeholder = "Recipient";
  recipient.style.marginBottom = "10px";
  recipient.style.padding = "10px";
  recipient.style.borderRadius = "5px";
  recipient.style.border = "1px solid #ccc";

  // recipient.onchange = (e) => {
  //   const val = e.target.value;
  //   const emails = val.split(" ");
  //   emails.forEach((email) => {
  //     // Assuming recipient is an input element for the email
  //     const badge = document.createElement("span");
  //     badge.textContent = email; // Set the text for the badge
  //     badge.style.backgroundColor = "green"; // Set the background color for the badge
  //     badge.style.color = "white"; // Set the text color for the badge
  //     badge.style.borderRadius = "5px"; // Make the badge round
  //     badge.style.padding = "2px 5px"; // Add some padding to the badge
  //     badge.style.marginLeft = "10px"; // Add some space between the email and the badge

  //     recipient.parentNode.insertBefore(badge, recipient.nextSibling);
  //   });
  // };

  const subject = document.createElement("input");
  subject.type = "text";
  subject.placeholder = "Subject";
  subject.style.marginBottom = "10px";
  subject.style.padding = "10px";
  subject.style.borderRadius = "5px";
  subject.style.border = "1px solid #ccc";

  const message = document.createElement("textarea");
  message.placeholder = "Message";
  message.style.marginBottom = "10px";
  message.style.padding = "10px";
  message.style.borderRadius = "5px";
  message.style.border = "1px solid #ccc";
  message.style.height = "200px";

  const sendEmailButton = document.createElement("button");
  sendEmailButton.innerHTML = "Send Email";
  sendEmailButton.style.marginRight = "auto";
  sendEmailButton.style.width = "30%";
  sendEmailButton.style.marginTop = "10px";
  sendEmailButton.onclick = () => {
    const email = recipient.value;
    const sub = subject.value;
    const msg = message.value;
    const img = document.getElementById("annotate_preview");

    const data = {
      email,
      sub,
      msg,
      img,
    };

    console.log(data);
  };

  emailDiv.appendChild(recipient);
  emailDiv.appendChild(subject);
  emailDiv.appendChild(message);
  emailDiv.appendChild(sendEmailButton);

  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.display = "flex";
  buttonsDiv.style.flexDirection = "row";
  buttonsDiv.style.justifyContent = "space-between";
  buttonsDiv.style.width = "50%";
  buttonsDiv.style.marginTop = "10px";
  buttonsDiv.style.padding = "10px";
  buttonsDiv.style.columnGap = "10px";
  buttonsDiv.style.marginLeft = "auto";

  root?.appendChild(main);

  const img = document.createElement("img");
  img.id = "annotate_preview";

  img.onclick = (e) => {
    showMarkerArea(e.target);
  };

  const openButton = document.createElement("button");
  openButton.id = "open";
  openButton.innerHTML = "Take Screenshot";

  tool.appendChild(openButton);
  document.body.appendChild(tool);

  const closeButton = document.createElement("button");
  closeButton.id = "close";
  closeButton.innerHTML = "Close";
  closeButton.style.marginLeft = "auto";
  closeButton.style.width = "50%";

  const downloadButton = document.createElement("button");
  downloadButton.id = "download";
  downloadButton.innerHTML = "Download";
  downloadButton.style.marginRight = "auto";
  downloadButton.style.width = "50%";
  downloadButton.onclick = () => {
    downloadImage(img.src, "screenshot.png");
  };

  const emailButton = document.createElement("button");
  emailButton.id = "emailButton";
  emailButton.innerHTML = "Email";
  emailButton.style.marginRight = "left";
  emailButton.style.width = "50%";
  emailButton.onclick = () => {
    emailDiv.style.display = "flex";
  };

  const openImage = () => {
    takeScreenShot(img).then(() => {
      annotatorModal.style.display = "flex";
    });
  };

  openButton.onclick = () => {
    openImage();
  };

  closeButton.onclick = () => {
    annotatorModal.style.display = "none";
  };

  buttonsDiv.appendChild(emailButton);
  buttonsDiv.appendChild(downloadButton);
  buttonsDiv.appendChild(closeButton);

  annotator.appendChild(img);
  annotator.appendChild(emailDiv);
  annotator.appendChild(buttonsDiv);

  annotatorModal.appendChild(annotator);

  main.appendChild(annotatorModal);
  let pressedKeys = [];

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);

  function handleKeydown(e) {
    if (!pressedKeys.includes(e.key)) {
      pressedKeys.push(e.key);

      if (
        pressedKeys.includes("Control") &&
        pressedKeys.includes("b") &&
        pressedKeys.length == 2
      ) {
        e.preventDefault();
        console.log("hello");
        openImage();

        return;
      }
    }
  }

  function handleKeyup(e) {
    const index = pressedKeys.indexOf(e.key);
    pressedKeys.splice(index, 1);
  }

  return "";
}
