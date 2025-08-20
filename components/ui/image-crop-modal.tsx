"use client"

import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number; // e.g., 1 for 1:1, 16/9 for 16:9
  circularCrop?: boolean;
}

// Helper function to draw image on canvas
async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // Translate the canvas origin to the center of the image
  ctx.translate(centerX, centerY);
  // Then move it from the center to the top-left of the crop
  ctx.translate(-cropX, -cropY);
  // Apply rotation and scale
  ctx.rotate(rotate * Math.PI / 180);
  ctx.scale(scale, scale);

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.width,
    image.height,
  );

  ctx.restore();
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio,
  circularCrop = false,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>(aspectRatio ? aspectRatio.toString() : 'free');

  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate,
      );
    }
  }, [completedCrop, scale, rotate]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (aspectRatio) {
      setCrop(centerCrop(
        makeAspectCrop(
          { unit: 'px', width: 100, height: 100 },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      ));
    } else {
      setCrop(centerCrop(
        {
          unit: 'px',
          width: Math.min(200, width),
          height: Math.min(200, height),
        },
        width,
        height
      ));
    }
  };

  const handleSave = () => {
    if (completedCrop && previewCanvasRef.current) {
      previewCanvasRef.current.toBlob((blob) => {
        if (blob) {
          console.log('Cropped Blob:', blob); // Log the blob
          onCropComplete(blob);
          onClose();
        } else {
          console.error('Failed to create blob from canvas');
        }
      }, 'image/png'); // You can change the image format here
    }
  };

  const handleAspectRatioChange = (value: string) => {
    setSelectedAspectRatio(value);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      let newAspectRatio: number | undefined = undefined;
      if (value !== 'free') {
        const [w, h] = value.split(':').map(Number);
        newAspectRatio = w / h;
      }
      setCrop(
        centerCrop(
          makeAspectCrop(
            { unit: '%', width: 20, height: 20 } as PercentCrop, // Force PercentCrop overload
            newAspectRatio,
            width ?? 100,
            height ?? 100
          ),
          width ?? 100,
          height ?? 100
        )
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto py-4">
          {imageSrc && (
            <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={selectedAspectRatio === 'free' ? undefined : parseFloat(selectedAspectRatio)}
                circularCrop={circularCrop}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageSrc}
                  onLoad={onImageLoad}
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                    maxHeight: '80vh',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </ReactCrop>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="zoom-slider" className="w-16">Zoom:</Label>
            <Slider
              id="zoom-slider"
              min={1}
              max={3}
              step={0.1}
              value={[scale]}
              onValueChange={(val) => setScale(val[0])}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="rotate-slider" className="w-16">Rotate:</Label>
            <Slider
              id="rotate-slider"
              min={0}
              max={360}
              step={1}
              value={[rotate]}
              onValueChange={(val) => setRotate(val[0])}
              className="flex-1"
            />
          </div>
          {aspectRatio === undefined && (
            <div className="flex items-center gap-4">
              <Label htmlFor="aspect-ratio-select" className="w-16">Aspect:</Label>
              <Select value={selectedAspectRatio} onValueChange={handleAspectRatioChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
          <canvas ref={previewCanvasRef} className="hidden" /> {/* Hidden canvas for actual cropping */}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Cropped Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
