import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DownloadImagesButton = ({ images }) => {
  const handleDownloadAll = async () => {
    const zip = new JSZip();

    for (const img of images) {
      const filename = img.image_key;
      // Fetch the image as a blob
      const imageBlob = await fetchImageAsBlob(img.image);
      zip.file(filename, imageBlob, { binary: true });
    }

    // Generate the zip file and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "images.zip");
    });
  };

  return (
    <button
      onClick={handleDownloadAll}
      className="px-4 mx-2 text-[14px] font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
    >
      تحميل جميع الصور
    </button>
  );
};

export default DownloadImagesButton;

// Helper function to fetch the image as a Blob
async function fetchImageAsBlob(imageUrl) {
  const response = await fetch(imageUrl);
  return response.blob();
}
