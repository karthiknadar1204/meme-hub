"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TwitterPicker } from "react-color";

export function TextOverlay({
  index,
  onUpdate,
}: {
  index: number;
  onUpdate: (
    index: number,
    text: string,
    x: number,
    y: number,
    bgColor?: string
  ) => void;
}) {
  const [textOverlay, setTextOverlay] = useState("");
  const [textOverlayXPosition, setTextOverlayXPosition] = useState(0);
  const [textOverlayYPosition, setTextOverlayYPosition] = useState(0);
  const [applyTextBackground, setApplyTextBackground] = useState(false);
  const [textBgColor, setTextBgColor] = useState("#FFFFFF");
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const xPositionDecimal = textOverlayXPosition / 100;
  const yPositionDecimal = textOverlayYPosition / 100;
  const bgColor = applyTextBackground ? textBgColor.replace("#", "") : undefined;

  useEffect(() => {
    onUpdate(
      index,
      textOverlay || " ",
      xPositionDecimal,
      yPositionDecimal,
      bgColor
    );
  }, [
    index,
    textOverlay,
    xPositionDecimal,
    yPositionDecimal,
    bgColor,
    onUpdate,
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - container.left) / container.width) * 100;
      const y = ((e.clientY - container.top) / container.height) * 100;

      setTextOverlayXPosition(Math.max(0, Math.min(100, x)));
      setTextOverlayYPosition(Math.max(0, Math.min(100, y)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between gap-8">
        <div className="flex-grow">
          <Label htmlFor={`textOverlay${index}`}>Text Overlay {index}</Label>
          <Input
            id={`textOverlay${index}`}
            onChange={(e) => {
              setTextOverlay(e.target.value);
            }}
            value={textOverlay}
          />
        </div>
        <div className="flex items-center space-x-2 flex-col space-y-4">
          <div className="flex gap-4">
            <Checkbox
              checked={applyTextBackground}
              onCheckedChange={(v) => {
                setApplyTextBackground(v as boolean);
              }}
              id="terms"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Apply Text Background
            </label>
          </div>

          {applyTextBackground && (
            <TwitterPicker
              color={textBgColor}
              onChange={(value) => {
                setTextBgColor(value.hex);
              }}
            />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor={`text${index}XPosition`}>Text {index} Position</Label>
        <div 
          ref={containerRef}
          className="relative w-full h-40 border rounded-md mt-2 cursor-pointer bg-muted/10"
          onClick={(e) => {
            if (!containerRef.current) return;
            const container = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - container.left) / container.width) * 100;
            const y = ((e.clientY - container.top) / container.height) * 100;
            setTextOverlayXPosition(x);
            setTextOverlayYPosition(y);
          }}
        >
          <div
            ref={dragRef}
            className="absolute w-4 h-4 bg-primary rounded-full cursor-move transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${textOverlayXPosition}%`,
              top: `${textOverlayYPosition}%`,
            }}
            onMouseDown={() => setIsDragging(true)}
          />
        </div>
      </div>
    </Card>
  );
}
