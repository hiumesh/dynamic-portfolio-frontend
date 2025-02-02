import { BUCKET_URL } from "@/lib/constants";
import { getPostPresignedUrl } from "@/services/api/user";
import { useState } from "react";

interface FileProxy {
  name: string;
  type: string;
  size: number;
  url: string;
}

export default function useFileUpload() {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setProgress(0);
    setIsUploading(false);
    setController(null);
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setProgress(0);
    setIsUploading(true);

    const abortController = new AbortController();
    setController(abortController);

    try {
      const { error, data: presignedUrls } = await getPostPresignedUrl({
        files: [
          {
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
          },
        ],
      });

      if (error || !presignedUrls) {
        handleError(error?.message || "Failed to fetch presigned URL");
        throw new Error("Failed to fetch presigned URL");
      }

      const presignedUrl = presignedUrls[0];

      const uploadFileToS3 = () => {
        return new Promise<FileProxy>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round(
                (event.loaded / (event.total ?? 0)) * 100
              );
              setProgress(progress);
            }
          };

          xhr.open("PUT", presignedUrl.url, true);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                name: file.name,
                url: new URL(presignedUrl.key, BUCKET_URL).href,
                type: file.type,
                size: file.size,
              });
            } else {
              reject(new Error(`Failed to upload file: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error occurred"));

          xhr.onabort = () => reject(new Error("Upload aborted"));

          xhr.send(file);

          abortController.signal.addEventListener("abort", () => {
            xhr.abort();
          });
        });
      };
      const result = await uploadFileToS3();
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") {
        handleError("Upload canceled by user");
      } else {
        handleError(error.message);
      }
      throw error;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setController(null);
    }
  };

  const cancelUpload = () => {
    if (controller) {
      controller.abort();
    }
  };

  return { progress, error, uploadFile, isUploading, cancelUpload };
}
