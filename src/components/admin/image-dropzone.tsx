
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface ImageDropzoneProps {
  name: string;
  initialImage?: string | null;
}

export default function ImageDropzone({ name, initialImage }: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  // We use this to track if the image has been removed by the user
  const [isRemoved, setIsRemoved] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setPreview(URL.createObjectURL(selectedFile));
      setIsRemoved(false);
      
      // We need a way to pass the file to the form data. A hidden input is a good way.
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(selectedFile);
      const fileInput = document.getElementById(`${name}-file-input`) as HTMLInputElement;
      if (fileInput) {
          fileInput.files = dataTransfer.files;
      }
    }
  }, [name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
  });
  
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setIsRemoved(true);
    const fileInput = document.getElementById(`${name}-file-input`) as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ""; // Clear the file input
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background/50 p-8 text-center transition-colors hover:border-primary',
          isDragActive && 'border-primary bg-primary/10'
        )}
      >
        {/* The actual file input is always part of the DOM for form submission */}
        <input {...getInputProps()} id={`${name}-file-input`} name={name} />

        {preview ? (
          <>
            <Image
              src={preview}
              alt="Image preview"
              width={200}
              height={200}
              className="h-32 w-32 rounded-md object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-destructive backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-10 w-10" />
            <p>Drag & drop an image here, or click to select one</p>
          </div>
        )}
      </div>
      {/* Hidden input to track if the image was removed by the user */}
      {isRemoved && <input type="hidden" name="isLogoRemoved" value="true" />}
      
      {/* Hidden input to track the state of the initial image */}
      {!preview && !isRemoved && initialImage && (
        <input type="hidden" name="currentImage" value={initialImage} />
      )}
    </div>
  );
}
