import * as htmlToImage from "html-to-image";
import FaviconIcon from "@/components/layout/FaviconIcon";
import { useEffect, useRef } from "react";

export default function GenerateFavicon() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      htmlToImage.toPng(ref.current).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "favicon.png";
        link.href = dataUrl;
        link.click();
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div ref={ref}>
        <FaviconIcon />
      </div>
    </div>
  );
}
