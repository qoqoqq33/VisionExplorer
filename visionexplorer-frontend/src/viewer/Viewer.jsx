import OpenSeadragon from "openseadragon";
import { useEffect, useRef, useState } from "react";
import AnnotationsCanvas from "../components/Annotations/AnnotationsCanvas.jsx";
import TimelineBar from "../components/Timeline/TimelineBar.jsx";
import { useViewer } from "../context/ViewerContext.jsx";

function Viewer() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { layers, timeline, timelineIndex, viewerRef: vr } = useViewer();

  useEffect(() => {
    if (!containerRef.current) return;

    viewerRef.current = OpenSeadragon({
      element: containerRef.current,
      prefixUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images/",
      showNavigator: true,
      gestureSettingsMouse: { clickToZoom: true, dblClickToZoom: true },
      maxZoomPixelRatio: 2,
      visibilityRatio: 1,
      constrainDuringPan: true,
      animationTime: 0.9,
      blendTime: 0.1,
      zoomPerScroll: 1.2,
    });
    setReady(true);
    // expose viewer in context for other features (e.g., AI region, screenshot)
    vr.current = viewerRef.current;

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [vr]);

  // Load/refresh layers when ready, timeline or layer list changes
  useEffect(() => {
    const osd = viewerRef.current;
    if (!osd || !ready) return;

    // Clear all
    osd.world.removeAll();

    // Determine base URL (timeline image if exists) as base layer
    const timelineUrl = timeline[timelineIndex]?.url;
    const base = layers.find((l) => l.id === "base");

    if (timelineUrl) {
      // Timeline image takes priority
      osd.addTiledImage({
        tileSource: { type: "image", url: timelineUrl },
        opacity: base?.opacity ?? 1,
      });
    } else if (base) {
      // Use base layer - check if it's tiles or regular image
      if (base.type === "tiles" && base.tileSource) {
        // Use tile source for backend tiles
        osd.addTiledImage({
          tileSource: base.tileSource,
          opacity: base.opacity ?? 1,
        });
      } else if (base.url) {
        // Use regular image URL
        osd.addTiledImage({
          tileSource: { type: "image", url: base.url },
          opacity: base.opacity ?? 1,
        });
      }
    }

    // Add other visible layers on top
    layers
      .filter((l) => l.id !== "base" && l.visible)
      .forEach((l) => {
        if (l.type === "tiles" && l.tileSource) {
          osd.addTiledImage({
            tileSource: l.tileSource,
            opacity: l.opacity,
          });
        } else if (l.url) {
          osd.addTiledImage({
            tileSource: { type: "image", url: l.url },
            opacity: l.opacity,
          });
        }
      });
  }, [layers, timeline, timelineIndex, ready]);

  const osd = viewerRef.current;

  return (
    <div className="w-full h-full relative bg-black">
      <div ref={containerRef} className="absolute inset-0" />
      {osd && <AnnotationsCanvas osd={osd} />}
      <TimelineBar />
    </div>
  );
}

export default Viewer;
