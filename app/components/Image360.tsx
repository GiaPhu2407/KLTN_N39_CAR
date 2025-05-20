"use client";

import { useEffect, useRef, useState } from "react";

const PanoramaViewer = () => {
  const panoramaRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any | null>(null);
  const [isPanoLoaded, setIsPanoLoaded] = useState(false);

  useEffect(() => {
    // Sử dụng dynamic import để đảm bảo PANOLENS chỉ được tải ở phía client
    if (!viewerRef.current && panoramaRef.current && !isPanoLoaded) {
      const loadPanolens = async () => {
        try {
          // Dynamic import PANOLENS chỉ khi ở client side
          const PANOLENS = await import("panolens");

          const panorama = new PANOLENS.ImagePanorama(
            "/vinfast-president-360.jpg"
          );
          const viewer = new PANOLENS.Viewer({
            container: panoramaRef.current,
          });
          viewer.add(panorama);
          viewerRef.current = viewer;
          setIsPanoLoaded(true);
        } catch (error) {
          console.error("Failed to load panorama viewer:", error);
        }
      };

      loadPanolens();
    }
  }, [isPanoLoaded]);

  return (
    <div>
      <button
        className="btn bg-blue-500 border-1 text-white"
        onClick={() => {
          // Sử dụng typeof để kiểm tra xem đang ở môi trường client hay không
          if (typeof window !== "undefined") {
            const modal = document.getElementById(
              "my_modal_3"
            ) as HTMLDialogElement;
            if (modal) modal.showModal();
          }
        }}
      >
        Xem Nội Thất Xe
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-white w-10/12 h-max max-h-full max-w-full">
          <form method="dialog">
            <button className="btn btn-sm btn-secondary btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Xem nội thất xe 360</h3>
          <div ref={panoramaRef} style={{ width: "80vw", height: "80vh" }} />
          <p className="text-xl">
            Nhấn giữ và kéo chuột để nhìn xung quanh | lăn chuột để phóng to thu
            nhỏ
          </p>
        </div>
      </dialog>
    </div>
  );
};

export default PanoramaViewer;
