"use client";
import { useEffect, useRef } from "react";
import * as PANOLENS from "panolens";

const PanoramaViewer = () => {
  const panoramaRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<PANOLENS.Viewer | null>(null);
  const modalRef = useRef<HTMLDialogElement | null>(null); // Reference for the modal

  useEffect(() => {
    if (!viewerRef.current && panoramaRef.current) {
      const panorama = new PANOLENS.ImagePanorama("/vinfast-president-360.jpg");
      const viewer = new PANOLENS.Viewer({ container: panoramaRef.current });

      viewer.add(panorama);
      viewerRef.current = viewer; // Save the viewer instance
    }
  }, []);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal(); // Open the modal
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close(); // Close the modal
    }
  };

  return (
    <div>
      <button
        className="btn bg-blue-500 text-white"
        onClick={openModal} // Open the modal on button click
      >
        Xem Nội Thất Xe
      </button>
      <dialog id="my_modal_3" ref={modalRef} className="modal">
        <div className="modal-box bg-white w-10/12 h-max max-h-full max-w-full">
          <form method="dialog">
            {/* Close button */}
            <button
              type="button"
              className="btn btn-sm btn-secondary btn-ghost absolute right-2 top-2"
              onClick={closeModal} // Close the modal on button click
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">360 Car Interior Viewer</h3>
          <div ref={panoramaRef} style={{ width: "80vw", height: "80vh" }} />
          <p className="text-xl">
            Click and drag to look around | Scroll to zoom in and zoom out
          </p>
        </div>
      </dialog>
    </div>
  );
};

export default PanoramaViewer;
