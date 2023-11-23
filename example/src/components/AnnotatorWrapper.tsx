import React from "react";
import annotate from "../packages/annotate";

export default function AnnotatorWrapper({ children }: any) {
  const ref = React.useRef(null);
  // children.ref = ref;
  console.log(children);
  return (
    <>
      {children}
      {/* {annotate(ref.current)} */}
    </>
  );
}
