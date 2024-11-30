import { cn } from "@/lib/utils";
import { getPostPresignedUrl } from "@/services/api/user";
import {
  createContext,
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DropEvent,
  DropzoneOptions,
  DropzoneState,
  FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { BUCKET_URL } from "@/lib/constants";
import { showErrorToast } from "@/lib/client-utils";
import { Button } from "../ui/button";
import { CircularProgress } from "@nextui-org/react";

type DirectionOptions = "rtl" | "ltr" | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  filesToUpload: FileUploadProgress[];
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  removeAllFilesFromSet: () => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: "horizontal" | "vertical";
  direction: DirectionOptions;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

type FileUploaderProps = {
  value: FileObjects | null | undefined;
  reSelect?: boolean;
  onValueChange?: (value: FileObjects | null) => void;
  dropzoneOptions: DropzoneOptions;
  orientation?: "horizontal" | "vertical";
};

interface FileUploadProgress {
  progress: number;
  File: File;
  source: AbortController | null;
}

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      dropzoneOptions,
      value,
      onValueChange,
      reSelect,
      orientation = "vertical",
      children,
      dir,
      ...props
    },
    ref
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [isLOF, setIsLOF] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>(
      []
    );
    const {
      accept = {
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      },
      maxFiles = 1,
      maxSize = 4 * 1024 * 1024,
      multiple = true,
    } = dropzoneOptions;

    const reSelectAll = maxFiles === 1 ? true : reSelect;
    const direction: DirectionOptions = dir === "rtl" ? "rtl" : "ltr";

    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!value) return;
        const newFiles = value.filter((_, index) => index !== i);
        onValueChange?.(newFiles);
      },
      [value, onValueChange]
    );

    const removeAllFilesFromSet = useCallback(() => {
      if (!value) return;
      onValueChange?.([]);
    }, [value, onValueChange]);

    const onUploadProgress = useCallback(
      (
        progressEvent: ProgressEvent<EventTarget>,
        file: FileObject,
        controller: AbortController
      ) => {
        const progress = Math.round(
          (progressEvent.loaded / (progressEvent.total ?? 0)) * 100
        );

        if (progress === 100) {
          multiple
            ? onValueChange?.(value ? [...value, file] : [file])
            : onValueChange?.([file]);
          setFilesToUpload((prevUploadProgress) => {
            return prevUploadProgress.filter((item) => item.File !== file.file);
          });

          return;
        }

        setFilesToUpload((prevUploadProgress) => {
          return prevUploadProgress.map((item) => {
            if (item.File === file.file) {
              return {
                ...item,
                progress,
                source: controller,
              };
            } else {
              return item;
            }
          });
        });
      },
      [onValueChange, value, multiple]
    );

    const uploadFileToPresignedUrl = useCallback(
      async (
        file: File,
        presignedUrl: PostPresignedUrl,
        onProgress?: (
          progressEvent: ProgressEvent<EventTarget>,
          file: File,
          controller: AbortController
        ) => void,
        controller?: AbortController
      ) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Handle upload progress
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress && controller) {
              onProgress(event, file, controller);
            }
          };

          // Set up the request to the presigned URL
          xhr.open("PUT", presignedUrl.url, true);
          xhr.setRequestHeader("Content-Type", file.type);

          // Listen for request completion
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({ success: true, message: "File uploaded successfully" });
            } else {
              reject(new Error(`Failed to upload file: ${xhr.statusText}`));
            }
          };

          // Handle errors
          xhr.onerror = () => reject(new Error("Network error occurred"));
          xhr.onabort = () => reject(new Error("Upload canceled by the user"));

          // Abort signal listener
          if (controller && controller.signal) {
            controller.signal.addEventListener("abort", () => {
              xhr.abort();
              reject(new Error("Upload canceled by the user"));
            });
          }

          // Send the file data
          xhr.send(file);
        });
      },
      []
    );

    const onDrop = useCallback(
      async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const files = acceptedFiles;

        if (!files) {
          showErrorToast(new Error("file error, probably too big"));
          return;
        }

        if (multiple && (value?.length || 0) + files.length > maxFiles) {
          const extraFiles = (value?.length || 0) + files.length - maxFiles;
          if (extraFiles >= files.length) return;
          files.splice(files.length - extraFiles, extraFiles);
        }

        const newValues: FileObjects = value ? [...value] : [];

        if (reSelectAll) {
          newValues.splice(0, newValues.length);
        }
        try {
          setFilesToUpload((prevUploadProgress) => {
            return [
              ...prevUploadProgress,
              ...files.map((file) => {
                return {
                  progress: 0,
                  File: file,
                  source: null,
                };
              }),
            ];
          });

          const presignedUrls = await getPostPresignedUrl({
            files: files.map((file) => ({
              file_name: file.name,
              file_size: file.size,
              file_type: file.type,
            })),
          });

          const uploadPromises = presignedUrls.map(async (f, idx) => {
            const controller = new AbortController();
            await uploadFileToPresignedUrl(
              files[idx],
              f,
              (event) =>
                onUploadProgress(
                  event,
                  {
                    file_name: f.file_name,
                    key: f.key,
                    url: new URL(f.key, BUCKET_URL).href,
                    file: files[idx],
                  },
                  controller
                ),
              controller
            );
          });

          await Promise.all(uploadPromises);
        } catch (error) {
          showErrorToast(error);
        }

        if (rejectedFiles.length > 0) {
          for (let i = 0; i < rejectedFiles.length; i++) {
            if (rejectedFiles[i].errors[0]?.code === "file-too-large") {
              toast.error(
                `File is too large. Max size is ${maxSize / 1024 / 1024}MB`
              );
              break;
            }
            if (rejectedFiles[i].errors[0]?.message) {
              toast.error(rejectedFiles[i].errors[0].message);
              break;
            }
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [reSelectAll, value]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) return;

        const moveNext = () => {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
        };

        const movePrev = () => {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
        };

        const prevKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowLeft"
              : "ArrowRight"
            : "ArrowUp";

        const nextKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowRight"
              : "ArrowLeft"
            : "ArrowDown";

        if (e.key === nextKey) {
          moveNext();
        } else if (e.key === prevKey) {
          movePrev();
        } else if (e.key === "Enter" || e.key === "Space") {
          if (activeIndex === -1) {
            dropzoneState.inputRef.current?.click();
          }
        } else if (e.key === "Delete" || e.key === "Backspace") {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex);
            if (value.length - 1 === 0) {
              setActiveIndex(-1);
              return;
            }
            movePrev();
          }
        } else if (e.key === "Escape") {
          setActiveIndex(-1);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value, activeIndex, removeFileFromSet]
    );

    useEffect(() => {
      if (!value) return;
      if (value.length === maxFiles) {
        setIsLOF(true);
        return;
      }
      setIsLOF(false);
    }, [value, maxFiles]);

    const opts = dropzoneOptions
      ? dropzoneOptions
      : { accept, maxFiles, maxSize, multiple };

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

    return (
      <FileUploaderContext.Provider
        value={{
          dropzoneState,
          filesToUpload,
          isLOF,
          isFileTooBig,
          removeFileFromSet,
          removeAllFilesFromSet,
          activeIndex,
          setActiveIndex,
          orientation,
          direction,
        }}
      >
        <div
          ref={ref}
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            "grid w-full focus:outline-none overflow-hidden ",
            className,
            {
              "gap-2": value && value.length > 0,
            }
          )}
          dir={dir}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  }
);

FileUploader.displayName = "FileUploader";

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();
  return (
    <div
      ref={ref}
      {...props}
      className={`relative w-full ${
        isLOF ? "opacity-50 cursor-not-allowed " : "cursor-pointer "
      }`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out
         ${
           dropzoneState.isDragAccept
             ? "border-green-500"
             : dropzoneState.isDragReject || isFileTooBig
             ? "border-red-500"
             : "border-gray-300"
         }`,
          className
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        ref={dropzoneState.inputRef}
        disabled={isLOF}
        {...dropzoneState.getInputProps()}
        className={`${isLOF ? "cursor-not-allowed" : ""}`}
      />
    </div>
  );
});

FileInput.displayName = "FileInput";

type SingleImageProps = {
  files: PostPresignedUrls | null;
};

export const SingleImageInput = forwardRef<
  HTMLDivElement,
  SingleImageProps & React.HTMLAttributes<HTMLDivElement>
>(({ className, files, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, filesToUpload, removeAllFilesFromSet } =
    useFileUpload();
  const rootProps = dropzoneState.getRootProps();
  return (
    <div ref={ref} {...props} className="relative">
      <div
        className={cn(
          `relative duration-300 ease-in-out bg-gray-50 border border-dashed w-24 h-24 rounded-full p-0.5 group
         ${
           dropzoneState.isDragAccept
             ? "border-green-500"
             : dropzoneState.isDragReject || isFileTooBig
             ? "border-red-500"
             : "border-gray-300"
         }`,
          className
        )}
        {...rootProps}
      >
        {files && files.length > 0 ? (
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={files[0].url}
              alt={files[0].file_name}
              objectFit="cover"
              fill
            />
          </div>
        ) : null}

        {!(filesToUpload && filesToUpload.length > 0) &&
        (!files || files?.length === 0) ? (
          <div className="flex items-center justify-center flex-col h-full w-full">
            <Plus className="text-gray-500 w-4" />
            <p className="text-xs text-gray-500 font-normal">Upload</p>
          </div>
        ) : null}

        {filesToUpload && filesToUpload.length > 0 ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2">
            <CircularProgress size="sm" value={filesToUpload[0].progress} />
          </div>
        ) : null}

        {files && files.length > 0 && (
          <Button
            type="button"
            size={"icon"}
            variant={"outline"}
            className="hidden group-hover:flex absolute -top-1 -right-1 rounded-full shadow-md h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeAllFilesFromSet();
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        )}

        {files && files.length > 0 && (
          <Button
            type="button"
            size={"icon"}
            variant={"outline"}
            className="absolute -bottom-1 -right-1 rounded-full shadow-md h-8 w-8"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Input ref={dropzoneState.inputRef} {...dropzoneState.getInputProps()} />
    </div>
  );
});

SingleImageInput.displayName = "SingleImageInput";
