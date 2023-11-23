import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { MarkerArea } from "markerjs2";
import { Interface } from "readline";
import { useRef } from "react";
import { IconDownload } from "@tabler/icons-react";

interface AnnotatorModalProps {
  img: string;
  opened: boolean;
  close: () => void;
  setImage: (dataUrl: string) => void;
  downloadImage: (fileName: string) => void;
}

function AnnotatorModal({
  img,
  opened,
  close,
  setImage,
  downloadImage,
}: AnnotatorModalProps) {
  //   const [opened, { open, close }] = useDisclosure(false);

  const ref = useRef(null);
  function showMarkerArea(target: any) {
    //@ts-ignore
    const markerArea = new MarkerArea(ref.current);
    markerArea.settings.displayMode = "popup";

    markerArea.addEventListener("render", (event) => {
      setImage(event.dataUrl);
    });
    markerArea.show();
  }

  //   function downloadImage(byteString: any, fileName: any) {
  //     const link = document.createElement("a");
  //     link.download = fileName;
  //     link.href = byteString;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(byteString);
  //   }

  //   console.log(img);

  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        title="Click on the image to annotate"
        centered
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        {/* Modal content */}
        <img
          ref={ref}
          width={"100%"}
          height={"100%"}
          //   src={
          //     "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
          //   }
          src={img}
          onClick={(e) => {
            showMarkerArea(e.target);
          }}
        />
        <div
          style={{
            width: "fit-content",
            border: "1px solid black",
            marginLeft: "auto",
            marginTop: "10px",
          }}
        >
          {" "}
          <Button
            ml={"auto"}
            justify="right"
            rightSection={<IconDownload size={14} />}
            onClick={() => {
              downloadImage("screenshot.jpg");
            }}
          >
            Download
          </Button>
        </div>
      </Modal>

      {/* <Button onClick={open}>Open Modal</Button> */}
    </div>
  );
}

export default AnnotatorModal;
