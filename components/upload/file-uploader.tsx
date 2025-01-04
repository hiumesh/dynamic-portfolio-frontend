"use client";

import * as React from "react";
import Image from "next/image";
import { Edit, File, FileText, Plus, Trash2, Upload, X } from "lucide-react";
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from "react-dropzone";
import { toast } from "sonner";

import { cn, formatBytes } from "@/lib/utils";
import { useControllableState } from "@/hooks/use-controllable-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircularProgress } from "@nextui-org/react";
import { getPostPresignedUrl } from "@/services/api/user";
import { showErrorToast } from "@/lib/client-utils";
import { BUCKET_URL } from "@/lib/constants";
import _, { set } from "lodash";
import { Separator } from "../ui/separator";

interface FileProxy {
  id?: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  status?: "success" | "error" | "uploading";
  source?: File;
  preview?: string;
  controller?: AbortController;
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "avatar" | "tile";

  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: FileProxy[];

  /**
   * Function to be called when the value changes.
   * @type (files: File[]) => void
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: FileProxy[]) => void;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps["accept"];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps["maxSize"];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFileCount={4}
   */
  maxFileCount?: DropzoneProps["maxFiles"];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
  const {
    variant = "default",
    value: valueProp,
    onValueChange,
    accept = {
      "image/*": [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });
  const [progresses, setProgresses] = React.useState<{ [key: string]: number }>(
    {}
  );

  const uploadFileToPresignedUrl = React.useCallback(
    async (
      id: string,
      file: File,
      presignedUrl: PostPresignedUrl,
      controller?: AbortController
    ) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Handle upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && id) {
            const progress = Math.round(
              (event.loaded / (event.total ?? 0)) * 100
            );

            // setFiles((files) => {
            //   if (!files) return files;
            //   const idx = files.findIndex((f) => f.source && f.source === file);
            //   if (idx !== -1) {
            //     const newFiles = [...files];
            //     newFiles[idx] = {
            //       ...newFiles[idx],
            //       progress,
            //     };
            //     return newFiles;
            //   }

            //   return files;
            // });
            setProgresses((progresses) => ({ ...progresses, [id]: progress }));
          }
          // if (event.lengthComputable && onProgress && controller) {
          //   onProgress(event, file, controller);
          // }
        };

        // Set up the request to the presigned URL
        xhr.open("PUT", presignedUrl.url, true);
        xhr.setRequestHeader("Content-Type", file.type);

        // Listen for request completion
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setFiles((prev) => {
              if (!prev) return prev;
              const idx = prev.findIndex((f) => f.id && f.id === id);
              if (idx !== -1) {
                const newFiles = [...prev];
                newFiles[idx] = {
                  ...newFiles[idx],
                  url: new URL(presignedUrl.key, BUCKET_URL).href,
                  controller: undefined,
                  source: undefined,
                  preview: undefined,
                  status: "success",
                };
                return newFiles;
              }

              return prev;
            });
            resolve({ success: true, message: "File uploaded successfully" });
          } else {
            setFiles((prev) => {
              if (!prev) return prev;
              const idx = prev.findIndex((f) => f.id && f.id === id);
              if (idx !== -1) {
                const newFiles = [...prev];
                newFiles[idx] = {
                  ...newFiles[idx],
                  status: "error",
                };
                return [...newFiles];
              }
              return prev;
            });
            reject(new Error(`Failed to upload file: ${xhr.statusText}`));
          }
        };

        // Handle errors
        xhr.onerror = () => {
          setFiles((prev) => {
            if (!prev) return prev;
            const idx = prev.findIndex((f) => f.id && f.id === id);
            if (idx !== -1) {
              const newFiles = [...prev];
              newFiles[idx] = {
                ...newFiles[idx],
                status: "error",
              };
              return newFiles;
            }
            return prev;
          });
          reject(new Error("Network error occurred"));
        };
        xhr.onabort = () => {
          setFiles((prev) => {
            if (!prev) return prev;
            const idx = prev.findIndex((f) => f.id && f.id === id);
            if (idx !== -1) {
              const newFiles = [...prev];
              newFiles[idx] = {
                ...newFiles[idx],
                status: "error",
              };
              return [...newFiles];
            }
            return prev;
          });
          reject(new Error("Upload canceled by the user"));
        };

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
    [setFiles]
  );

  const onDrop = React.useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (
        variant !== "avatar" &&
        !multiple &&
        maxFileCount === 1 &&
        acceptedFiles.length > 1
      ) {
        toast.error("Cannot upload more than 1 file at a time");
        return;
      }

      if (
        variant !== "avatar" &&
        (files?.length ?? 0) + acceptedFiles.length > maxFileCount
      ) {
        toast.error(`Cannot upload more than ${maxFileCount} files`);
        return;
      }

      const newFiles: FileProxy[] = acceptedFiles.map((file) => ({
        id: _.uniqueId(),
        name: file.name,
        size: file.size,
        type: file.type,
        source: file,
        preview: URL.createObjectURL(file),
        status: "uploading",
        controller: new AbortController(),
      }));

      const updatedFiles =
        files && variant !== "avatar" ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);
      // setProgresses((progresses) => {
      //   return {
      //     ...progresses,
      //     ...newFiles.reduce((prev, file) => ({ ...prev, [file.id!]: 0 }), {}),
      //   };
      // });

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      try {
        if (newFiles.length <= 0) return;
        const { error, data: presignedUrls } = await getPostPresignedUrl({
          files: newFiles.map((file) => ({
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
          })),
        });

        if (error) {
          setFiles((files) => {
            if (!files) return files;
            return files.map((file) => {
              if (newFiles.find((f) => f.id === file.id)) {
                return {
                  ...file,
                  status: "error",
                };
              }
              return file;
            });
          });
          showErrorToast(error);
          return;
        }

        const uploadPromises =
          presignedUrls?.map(async (f, idx) => {
            await uploadFileToPresignedUrl(
              newFiles[idx].id as string,
              newFiles[idx].source!,
              f,
              newFiles[idx].controller
            );
          }) ?? [];
        await Promise.all(uploadPromises);
      } catch (error) {
        showErrorToast(error);
      }
    },

    [files, variant, maxFileCount, multiple, setFiles, uploadFileToPresignedUrl]
  );

  function onRemove(index: number) {
    if (!files || files?.length <= index) return;
    files[index].controller?.abort("removed");
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview!);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled =
    disabled || (variant !== "avatar" && (files?.length ?? 0) >= maxFileCount);

  if (variant === "avatar") {
    return (
      <div className="relative flex flex-col gap-6 overflow-hidden">
        <Dropzone
          onDrop={onDrop}
          accept={{
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
            "image/svg+xml": [],
          }}
          maxSize={maxSize}
          maxFiles={maxFileCount}
          multiple={variant !== "avatar"}
          disabled={isDisabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                "group relative grid h-28 w-28 cursor-pointer place-items-center rounded-lg border-[1.4px] border-dashed border-muted-foreground/25 p-2 text-center transition hover:bg-muted/25 bg-muted",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isDragActive && "border-muted-foreground/50",
                isDisabled && "pointer-events-none opacity-60",
                className
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />
              {files && files?.length > 0 ? (
                <div className="w-full h-full relative">
                  <Image
                    src={files[0].preview || files[0].url || ""}
                    alt={files[0].name}
                    width={100}
                    height={100}
                    className={cn(
                      "object-contain w-full h-full",
                      files[0].status === "uploading" && "opacity-50"
                    )}
                  />
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black/30 justify-center items-center gap-3">
                    <Button
                      type="button"
                      size={"icon"}
                      variant={"outline"}
                      className="rounded-full shadow-md h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      type="button"
                      size={"icon"}
                      variant={"outline"}
                      className="rounded-full shadow-md h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onRemove(0);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ) : null}
              {files && files?.length > 0 && files[0].status === "uploading" ? (
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <CircularProgress
                    size="sm"
                    value={
                      files[0].id && files[0].id in progresses
                        ? progresses[files[0].id]
                        : undefined
                    }
                  />
                </div>
              ) : null}
              {!files || files?.length <= 0 ? (
                <div className="flex flex-col items-center justify-center gap-1 sm:px-2">
                  <Plus
                    strokeWidth={1.5}
                    size={18}
                    className="text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">Upload</p>
                </div>
              ) : null}
            </div>
          )}
        </Dropzone>
      </div>
    );
  }

  if (variant === "tile") {
    return (
      // border rounded-lg p-4 shadow
      <div className="flex flex-wrap gap-4">
        {files?.map((file, index) => (
          <FileTileCard
            key={index}
            file={file}
            onRemove={() => onRemove(index)}
            progress={
              file.id && file.id in progresses ? progresses[file.id] : undefined
            }
          />
        ))}
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFileCount}
          multiple={true}
          disabled={isDisabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                "group relative grid h-28 w-28 cursor-pointer place-items-center rounded-lg border-[1.4px] border-dashed border-muted-foreground/25 p-2 text-center transition hover:bg-gray-100/35 bg-gray-100",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isDragActive && "border-muted-foreground/50",
                isDisabled && "pointer-events-none opacity-60",
                className
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center justify-center gap-1 sm:px-2">
                <Plus
                  strokeWidth={1.5}
                  size={18}
                  className="text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">Upload</p>
              </div>
            </div>
          )}
        </Dropzone>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50",
              isDisabled && "pointer-events-none opacity-60",
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <Upload
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-medium text-muted-foreground">
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <Upload
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-px">
                  <p className="font-medium text-muted-foreground">
                    Drag {`'n'`} drop files here, or click to select files
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    You can upload
                    {maxFileCount > 1
                      ? ` ${
                          maxFileCount === Infinity ? "multiple" : maxFileCount
                        }
                      files (up to ${formatBytes(maxSize)} each)`
                      : ` a file with ${formatBytes(maxSize)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="flex max-h-48 flex-col gap-4">
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={
                  file.id && file.id in progresses
                    ? progresses[file.id]
                    : undefined
                }
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: FileProxy;
  onRemove: () => void;
  progress?: number;
}

function FileTileCard({ file, progress, onRemove }: FileCardProps) {
  if (file.type.startsWith("image/"))
    return (
      <div
        className={cn(
          "relative group h-28 w-28 grid place-items-center  rounded-lg border-[1.4px] border-dashed border-muted-foreground/25 p-2 text-center transition hover:bg-muted/25 bg-muted",
          file.status === "error" && "border-red-500"
        )}
      >
        <div className="w-full h-full relative">
          <Image
            src={file.preview || file.url || ""}
            alt={file.name}
            width={100}
            height={100}
            className={cn(
              "object-contain w-full h-full",
              file.status === "uploading" && "opacity-50"
            )}
          />
          <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black/30 justify-center items-center gap-3">
            <Button
              type="button"
              size={"icon"}
              variant={"outline"}
              className="rounded-full shadow-md h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemove();
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
        {file.status === "uploading" ? (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <CircularProgress
              aria-label="File upload progress"
              size="sm"
              value={progress}
            />
          </div>
        ) : null}
      </div>
    );

  return (
    <div
      className={cn(
        "relative group h-28 w-28 grid place-items-center  rounded-lg border-[1.4px] border-dashed border-muted-foreground/25 p-2 text-center transition hover:bg-muted/25 bg-muted",
        file.status === "error" && "border-red-500"
      )}
    >
      <div className="w-full h-full relative">
        <div className="flex flex-col h-full items-center justify-center gap-2 text-gray-700 text-xs">
          <File />
          {file.name}
          {file.status === "uploading" ? (
            <CircularProgress
              aria-label="File upload progress"
              size="sm"
              className="scale-75"
              value={progress}
            />
          ) : null}
        </div>

        <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black/30 justify-center items-center gap-3">
          <Button
            type="button"
            size={"icon"}
            variant={"outline"}
            className="rounded-full shadow-md h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove();
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="flex flex-1 gap-2.5">
        {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
}

function isFileWithPreview(file: FileProxy) {
  return "preview" in file && typeof file.preview === "string";
}

interface FilePreviewProps {
  file: FileProxy;
}

function FilePreview({ file }: FilePreviewProps) {
  if (file.type.startsWith("image/")) {
    return (
      <Image
        src={file.preview as string}
        alt={file.name}
        width={48}
        height={48}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    );
  }

  return (
    <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
  );
}
