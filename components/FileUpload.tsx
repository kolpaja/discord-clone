'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { X } from 'lucide-react';

import '@uploadthing/react/styles.css';
import Image from 'next/image';

interface IFileUpload {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage';
}

export const FileUpload = ({ endpoint, onChange, value }: IFileUpload) => {
  const fileType = value?.split('.').pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image
          alt='upload'
          src={value}
          fill
          className='rounded-full ring-green-500 ring-1 shadow-lg'
        />

        {/* TODO delete the uploaded file on server when the user clicks the remove btn */}
        <button
          className='rounded-full absolute top-0 right-0 bg-rose-500 text-white p-1 shadow-sm'
          type='button'
          onClick={() => onChange('')}
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error) => {
        console.log('upload error ' + endpoint + ' ' + error?.message);
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};
