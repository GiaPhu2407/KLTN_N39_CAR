"use client"
import { useEffect, useRef } from "react";
import * as PANOLENS from "panolens";

const PanoramaViewer = () => {
  return (
   <div>
<button className="btn bg-blue-500 text-white">Xem Nội Thất Xe</button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box bg-white w-10/12 h-max w- max-h-full max-w-full">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-secondary btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">360 Car Interior Viewer </h3>
    <div style={{ width: "80vw", height: "80vh" }} />
    <p className=" text-xl">Click and drag to look around | Scroll to zoom in and zoom out</p>
  </div>
</dialog>
  </div>
);  
};

export default PanoramaViewer;