"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  FileUp,
  Trash2,
  Loader2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImportResult {
  total: number
  success: number
  failed: number
  duplicates: number
  errors: string[]
  duplicates_list: string[]
}

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  importEndpoint: string
  sampleCsvUrl?: string
  onSuccess?: () => void
}

export function ImportDialog({
  isOpen,
  onClose,
  title,
  description,
  importEndpoint,
  sampleCsvUrl,
  onSuccess
}: ImportDialogProps) {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', event.target.files)
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.size, file.type)
      validateAndSetFile(file)
    } else {
      console.log('No file selected')
    }
  }

  const validateAndSetFile = (file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Only CSV files are allowed",
      })
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "File size must be less than 5MB",
      })
      return
    }

    setSelectedFile(file)
    setImportResult(null)
    setError("")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      validateAndSetFile(files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setImportResult(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      setUploadProgress(0)
      setError("")

      const formData = new FormData()
      formData.append('file', selectedFile)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch(importEndpoint, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      if (data.success) {
        setImportResult(data.data)
        toast({
          title: "Import Completed",
          description: `Successfully imported ${data.data.success} out of ${data.data.total} records`,
        })

        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error(data.error || 'Import failed')
      }
    } catch (error) {
      console.error('Import error:', error)
      setError(error instanceof Error ? error.message : 'Import failed')
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Import failed',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setImportResult(null)
    setError("")
    setUploadProgress(0)
    onClose()
  }

  const downloadSampleCsv = () => {
    console.log('Download button clicked, sampleCsvUrl:', sampleCsvUrl)
    if (!sampleCsvUrl) {
      console.log('No sample CSV URL provided')
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sample file not available",
      })
      return
    }

    try {
      console.log('Attempting to download:', sampleCsvUrl)
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = sampleCsvUrl
      link.download = sampleCsvUrl.split('/').pop() || 'sample.csv'
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      // Add to DOM temporarily
      document.body.appendChild(link)

      // Trigger download
      link.click()

      // Remove from DOM
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: "Sample CSV file download has been initiated",
      })
    } catch (error) {
      console.error('Download error:', error)
      // Fallback: open in new tab
      window.open(sampleCsvUrl, '_blank', 'noopener,noreferrer')

      toast({
        title: "Download Opened",
        description: "Sample CSV file opened in new tab",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {description}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Sample CSV Download */}
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Need a sample CSV file?</p>
                    <p className="text-xs text-muted-foreground">Download and use as a template</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadSampleCsv}
                  disabled={!sampleCsvUrl}
                  className="flex items-center gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Download Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`} onClick={() => fileInputRef.current?.click()}>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                {!selectedFile ? (
                  <>
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <FileUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Drop your CSV file here</h3>
                      <p className="text-sm text-muted-foreground">
                        or click to browse files
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          console.log('Choose File button clicked')
                          if (fileInputRef.current) {
                            console.log('File input found, clicking...')
                            fileInputRef.current.click()
                          } else {
                            console.log('File input not found')
                          }
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Choose File
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-green-800">{selectedFile.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB • CSV file
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove File
                    </Button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                />

                {/* Hidden drop zone - positioned behind content */}
                <div
                  className="absolute inset-0 -z-10"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isUploading && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <div>
                      <p className="font-medium">Processing import...</p>
                      <p className="text-sm text-muted-foreground">Please wait while we process your data</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">{uploadProgress}% complete</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Import Results</h3>
                <p className="text-sm text-muted-foreground">
                  Processed {importResult.total} records
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">{importResult.success}</p>
                    <p className="text-sm text-green-600 font-medium">Successful</p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-700">{importResult.failed}</p>
                    <p className="text-sm text-red-600 font-medium">Failed</p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-700">{importResult.duplicates}</p>
                    <p className="text-sm text-yellow-600 font-medium">Duplicates</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">{importResult.total}</p>
                    <p className="text-sm text-blue-600 font-medium">Total</p>
                  </CardContent>
                </Card>
              </div>

              {importResult.errors.length > 0 && (
                <Card className="border-destructive/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <h4 className="font-medium text-destructive">Import Errors</h4>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm text-destructive bg-destructive/5 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {importResult.duplicates_list.length > 0 && (
                <Card className="border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Duplicate Records</h4>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      <div className="space-y-1">
                        {importResult.duplicates_list.map((duplicate, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {duplicate}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 sm:flex-none"
            >
              {importResult ? "Close" : "Cancel"}
            </Button>
            {selectedFile && !importResult && (
              <Button
                onClick={handleImport}
                disabled={isUploading}
                className="flex-1 sm:flex-none"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}