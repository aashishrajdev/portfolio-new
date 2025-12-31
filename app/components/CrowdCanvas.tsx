"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";

interface CrowdCanvasProps {
  src?: string;
  rows?: number;
  cols?: number;
  className?: string;
}

const configDefault = {
  src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png",
  rows: 15,
  cols: 7,
};

// UTILS
const randomRange = (min: number, max: number) =>
  min + Math.random() * (max - min);
const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
const removeItemFromArray = (array: any[], item: any) => {
  const idx = array.indexOf(item);
  if (idx !== -1) removeFromArray(array, idx);
};
const removeRandomFromArray = (array: any[]) =>
  removeFromArray(array, randomIndex(array));
const getRandomFromArray = (array: any[]) => array[randomIndex(array)];

// CLASSES
class Peep {
  image: HTMLImageElement;
  rect: number[] = [0, 0, 0, 0];
  width: number = 0;
  height: number = 0;
  drawArgs: any[] = [];
  x: number = 0;
  y: number = 0;
  anchorY: number = 0;
  scaleX: number = 1;
  walk: gsap.core.Timeline | null = null;

  constructor({ image, rect }: { image: HTMLImageElement; rect: number[] }) {
    this.image = image;
    this.setRect(rect);
  }

  setRect(rect: number[]) {
    this.rect = rect;
    this.width = rect[2];
    this.height = rect[3];
    this.drawArgs = [this.image, ...rect, 0, 0, this.width, this.height];
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, 1);
    ctx.drawImage(
      this.image,
      this.rect[0],
      this.rect[1],
      this.rect[2],
      this.rect[3],
      0,
      0,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

const CrowdCanvas: React.FC<CrowdCanvasProps> = ({
  src = configDefault.src,
  rows = configDefault.rows,
  cols = configDefault.cols,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const stateRef = useRef({
    allPeeps: [] as Peep[],
    availablePeeps: [] as Peep[],
    crowd: [] as Peep[],
    stage: { width: 0, height: 0 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = document.createElement("img");
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = init;

    function init() {
      createPeeps();
      resize();
      gsap.ticker.add(render);
      window.addEventListener("resize", resize);
    }

    function createPeeps() {
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      stateRef.current.allPeeps = [];
      for (let i = 0; i < total; i++) {
        stateRef.current.allPeeps.push(
          new Peep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          })
        );
      }
    }

    function resize() {
      if (!canvas) return;
      stateRef.current.stage.width = canvas.clientWidth;
      stateRef.current.stage.height = canvas.clientHeight;
      canvas.width = stateRef.current.stage.width * devicePixelRatio;
      canvas.height = stateRef.current.stage.height * devicePixelRatio;

      stateRef.current.crowd.forEach((peep) => {
        peep.walk?.kill();
      });

      stateRef.current.crowd = [];
      stateRef.current.availablePeeps = [...stateRef.current.allPeeps];

      initCrowd();
    }

    function initCrowd() {
      while (stateRef.current.availablePeeps.length) {
        addPeepToCrowd().walk!.progress(Math.random());
      }
    }

    function addPeepToCrowd() {
      const peep = removeRandomFromArray(stateRef.current.availablePeeps);
      const walk = normalWalk({
        peep,
        props: resetPeep({ peep, stage: stateRef.current.stage }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      stateRef.current.crowd.push(peep);
      stateRef.current.crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    }

    function removePeepFromCrowd(peep: Peep) {
      removeItemFromArray(stateRef.current.crowd, peep);
      stateRef.current.availablePeeps.push(peep);
    }

    function resetPeep({ stage, peep }: { stage: any; peep: Peep }) {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX;
      let endX;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    }

    function normalWalk({ peep, props }: { peep: Peep; props: any }) {
      const { startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0
      );
      return tl;
    }

    function render() {
      if (!canvas || !ctx) return;
      canvas.width = canvas.width; // Clear/Reset
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      stateRef.current.crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    }

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      stateRef.current.crowd.forEach((p) => p.walk?.kill());
    };
  }, [src, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default CrowdCanvas;
