"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2, Camera, RotateCcw, User } from "lucide-react"
import Cropper from "react-easy-crop"

interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedImage: string | null
  onCropComplete: (croppedArea: { x: number; y: number; width: number; height: number }, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => void
  onUpload: () => void
  uploading: boolean
  crop: { x: number; y: number }
  setCrop: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  rotation: number
  setRotation: React.Dispatch<React.SetStateAction<number>>
  croppedPreview: string | null
  onGeneratePreview: () => void
  croppedAreaPixels: { x: number; y: number; width: number; height: number } | null
}

export function ImageCropDialog({
  open,
  onOpenChange,
  selectedImage,
  onCropComplete,
  onUpload,
  uploading,
  crop,
  setCrop,
  zoom,
  setZoom,
  rotation,
  setRotation,
  croppedPreview,
  onGeneratePreview,
  croppedAreaPixels,
}: ImageCropDialogProps) {
  const handleReset = () => {
    setRotation(0)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cropper */}
            <div className="space-y-4">
              <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {selectedImage ? (
                  <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    rotation={rotation}
                    cropShape="round"
                    showGrid={false}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <Camera className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Loading image...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Zoom */}
                <div>
                  <Label className="text-sm font-medium">Zoom: {zoom.toFixed(1)}x</Label>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={1}
                    max={3}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <Label className="text-sm font-medium">Rotation</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRotation((prev) => prev - 90)}
                      disabled={!selectedImage}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[3rem] text-center">{rotation}°</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRotation((prev) => prev + 90)}
                      disabled={!selectedImage}
                    >
                      <RotateCcw className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      disabled={!selectedImage}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="flex flex-col items-center space-y-4">
                {/* Circular Preview */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {croppedPreview ? (
                    <Image
                      src={croppedPreview}
                      alt="Cropped preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Generate Preview Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={onGeneratePreview}
                  disabled={!selectedImage || !croppedAreaPixels}
                  className="w-full"
                >
                  Generate Preview
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Click "Generate Preview" to see how your cropped image will look
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={onUpload}
              disabled={!selectedImage || !croppedAreaPixels || uploading}
              className="bg-green-500 hover:bg-green-600"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Picture
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}