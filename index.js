import emailjs from "@emailjs/browser";
import {
  getStorage,
  ref as firebaseRef,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, ref, child, get, set } from "firebase/database";

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
};

function showMarkerArea(target) {
  const markerArea = new MarkerArea(target);
  console.log(markerArea);
  markerArea.settings.displayMode = "popup";
  markerArea.uiStyleSettings.zIndex = "1000";

  markerArea.uiStyleSettings.backgroundColor = "rgba(0,0,0,0.5)";
  markerArea.addEventListener("render", (event) => {
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

async function getRecipients(database) {
  const dbRef = ref(database);

  const snapshot = await get(child(dbRef, `emails`));

  const recipientsDiv = document.createElement("div");

  recipientsDiv.id = "recipientsDiv";
  recipientsDiv.style.display = "flex";
  recipientsDiv.style.flexDirection = "column";
  recipientsDiv.style.justifyContent = "center";
  recipientsDiv.style.marginTop = "10px";
  recipientsDiv.style.marginBottom = "10px";
  recipientsDiv.style.padding = "10px";
  recipientsDiv.style.border = "1px solid #ccc";
  recipientsDiv.style.borderRadius = "5px";
  recipientsDiv.style.rowGap = "10px";
  recipientsDiv.style.maxHeight = "200px";
  recipientsDiv.style.overflowY = "scroll";
  const recipientsList = document.createElement("ul");
  recipientsList.id = "recipientList";

  if (snapshot.exists()) {
    const recipients = snapshot.val();

    recipients.forEach((recipient) => {
      const listItem = document.createElement("div");
      listItem.style.textAlign = "left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "recipient";
      checkbox.onclick = (e) => {
        console.log(e.target.checked);
      };
      const label = document.createElement("label");
      label.htmlFor = recipient;
      label.innerHTML = recipient;

      listItem.appendChild(checkbox);
      listItem.appendChild(label);
      recipientsList.appendChild(listItem);
    });
  } else {
    console.log("No data available");
  }
  recipientsDiv.appendChild(recipientsList);
  return recipientsDiv;
}

async function sendEmail(storage, templateId, serviceId) {
  const recipient = document.getElementById("recipient").value;
  const sub = document.getElementById("subject").value;
  const msg = document.getElementById("message").value;
  const img = document.getElementById("annotate_preview");

  let recipients = document.getElementById("recipientList").children;

  recipients = Array.from(recipients);

  const imageId = Date.now().toString();

  const storageRef = firebaseRef(storage, "images/" + imageId + ".jpg");

  document.getElementById("sendEmail").innerHTML = "Sending";

  const snapshot = await uploadString(storageRef, img.src, "data_url");
  const url = await getDownloadURL(snapshot.ref);

  const promises = recipients.map((recipient) => {
    if (recipient.children.item(0).checked) {
      const email = recipient.children.item(1).innerHTML;
      return emailjs.send(
        serviceId,
        templateId,
        {
          to_email: email,
          subject: sub,
          message: msg,
          src: url,
        },
        emailJsApiKey
      );
    }
  });

  Promise.all(promises)
    .then((res) => {
      console.log(res);
      document.getElementById("sendEmail").innerHTML = "Send Mail";
      alert("Email has been sent");
      document.getElementById("emailDiv").style.display = "none";
      document.getElementById("annotator").style.display = "none";
    })
    .catch((e) => {
      alert("There was an error sending the mail");
      console.log(e);
    });
}

export default async function annotate(app_instance, templateId, serviceId) {
  const storage = getStorage(app_instance);
  const database = getDatabase(app_instance);

  const root = document.getElementById("root");

  const preMain = document.getElementById("main");
  preMain?.remove();

  const main = document.createElement("div");
  main.id = "main";

  var tool = document.createElement("div");

  tool.style.position = "fixed";
  tool.style.top = "0px";
  tool.style.left = "0px";
  tool.style.width = "100%";
  tool.style.zIndex = "1000";
  tool.style.backgroundColor = "#f9f9f9";
  tool.style.padding = "10px";
  tool.style.zIndex = "1000";

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
  emailDiv.id = "emailDiv";
  emailDiv.style.marginTop = "20px";
  emailDiv.style.display = "none";
  emailDiv.style.flexDirection = "column";
  emailDiv.style.justifyContent = "center";
  emailDiv.style.width = "100%";

  const recipient = document.createElement("input");
  recipient.type = "email";
  recipient.id = "recipient";
  recipient.placeholder = "Add a new recipient";
  recipient.style.marginBottom = "10px";
  recipient.style.padding = "10px";
  recipient.style.borderRadius = "5px";
  recipient.style.border = "1px solid #ccc";

  const addRecipientButton = document.createElement("button");
  addRecipientButton.id = "addRecipient";
  addRecipientButton.innerHTML = "Add New Recipient";
  addRecipientButton.style.width = "30%";
  addRecipientButton.onclick = async () => {
    const recipient = document.getElementById("recipient").value;
    if (!recipient) {
      alert("Please enter a valid email address");
      return;
    }
    let list = document.getElementById("recipientList");

    let listArr = Array.from(list.children);
    listArr = listArr.map((item) => item.children.item(1).innerHTML);
    if (listArr.includes(recipient)) {
      alert("Recipient already exists");
      return;
    }

    const dbRef = ref(database);

    addRecipientButton.innerHTML = "Adding";
    await set(child(dbRef, `emails`), [...listArr, recipient]);

    const listItem = document.createElement("div");
    listItem.style.textAlign = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "recipient";
    checkbox.onclick = (e) => {
      console.log(e.target.checked);
    };
    const label = document.createElement("label");
    label.htmlFor = recipient;
    label.innerHTML = recipient;

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    list.appendChild(listItem);

    document.getElementById("recipient").value = "";
    addRecipientButton.innerHTML = "Add New Recipient";
  };

  const subject = document.createElement("input");
  subject.id = "subject";
  subject.type = "text";
  subject.placeholder = "Subject";
  subject.style.marginBottom = "10px";
  subject.style.padding = "10px";
  subject.style.borderRadius = "5px";
  subject.style.border = "1px solid #ccc";

  const message = document.createElement("textarea");
  message.id = "message";
  message.placeholder = "Message";
  message.style.marginBottom = "10px";
  message.style.padding = "10px";
  message.style.borderRadius = "5px";
  message.style.border = "1px solid #ccc";
  message.style.height = "200px";

  const sendEmailButton = document.createElement("button");
  sendEmailButton.id = "sendEmail";
  sendEmailButton.innerHTML = "Send Email";
  sendEmailButton.style.width = "30%";
  sendEmailButton.onclick = async () => {
    sendEmail(storage, templateId, serviceId);
  };

  const recipeintsDiv = await getRecipients(database);
  emailDiv.appendChild(recipient);
  emailDiv.appendChild(addRecipientButton);
  emailDiv.appendChild(recipeintsDiv);

  emailDiv.appendChild(subject);
  emailDiv.appendChild(message);

  const emailButtonDiv = document.createElement("div");
  emailButtonDiv.style.display = "flex";
  emailButtonDiv.style.flexDirection = "row";
  emailButtonDiv.style.gap = "10px";
  emailButtonDiv.style.marginTop = "10px";

  const closeEmailDivButton = document.createElement("button");
  closeEmailDivButton.id = "closeEmailDivButton";
  closeEmailDivButton.innerHTML = "Close";
  closeEmailDivButton.style.marginRight = "auto";
  closeEmailDivButton.style.width = "30%";
  closeEmailDivButton.onclick = () => {
    emailDiv.style.display = "none";
  };

  emailButtonDiv.appendChild(sendEmailButton);
  emailButtonDiv.appendChild(closeEmailDivButton);

  emailDiv.appendChild(emailButtonDiv);

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
    takeScreenShot(img)
      .then(() => {
        annotatorModal.style.display = "flex";
      })
      .catch((e) => {
        annotatorModal.style.display = "none";
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
