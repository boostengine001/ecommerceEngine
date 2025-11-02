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
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
  });
  
  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
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
        <Input {...getInputProps()} />
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
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
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
      {/* Hidden input to carry the file to the form data */}
      {file && <input type="file" name={name} style={{ display: 'none' }} files={new DataTransfer().files} ref={input => {
          if (input) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
          }
      }}/>}
    </div>
  );
}