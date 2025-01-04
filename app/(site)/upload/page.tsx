"use client";

import { FileUploader } from "@/components/upload/file-uploader";

export default function UploadPage() {
  return (
    <div className="p-6 space-y-6">
      <h1>Upload Page</h1>

      <FileUploader maxSize={1024 * 1024 * 20} />
      <FileUploader
        maxSize={1024 * 1024 * 20}
        variant="avatar"
        className="rounded-full"
      />
      <FileUploader
        maxSize={1024 * 1024 * 20}
        variant="tile"
        maxFileCount={5}
      />
    </div>
  );
}
