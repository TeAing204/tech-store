import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTheme, IconButton } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

const ImageUpload = React.memo(({ value = [], onChange, error }) => {
  const [files, setFiles] = useState(value);
  const theme = useTheme();
  useEffect(() => setFiles(value || []), [value]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const mapped = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      const newFiles = [...files, ...mapped];
      setFiles(newFiles);
      onChange(newFiles);
    },
    [files, onChange]
  );

  const removeFile = useCallback(
    (idOrName) => {
      const updated = files.filter(
        (f) => f.id !== idOrName && f.name !== idOrName
      );
      setFiles(updated);
      onChange(updated);
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 10,
    multiple: true,
  });

  return (
    <div className="py-2">
      <div className="mb-4 grid grid-cols-5 gap-4">
        {files.map((file) => (
          <div key={file.id || file.name} className="relative group">
            <img
              src={file.url || file.preview}
              alt={file.name || file.fileName}
              className="w-full h-32 object-cover rounded"
            />
            <IconButton
              size="small"
              onClick={() => removeFile(file.name || file.id)}
              className="!absolute top-1 right-1 bg-white shadow hidden group-hover:flex z-10"
            >
              <CloseIcon className="text-[#ffd166] bg-gray-400 rounded-sm" />
            </IconButton>
          </div>
        ))}
      </div>

      <div
        {...getRootProps()}
        className="p-10 text-center cursor-pointer rounded-lg"
        style={{
          border: "1px dashed",
          borderColor: isDragActive
            ? theme.palette.secondary.main
            : theme.palette.border.main,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Kéo thả ảnh vào đây...</p>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p>Nhấn hoặc kéo thả ảnh vào đây để upload</p>
            <AddPhotoAlternateIcon sx={{ fontSize: 70, mt: 4 }}/>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
});

export default ImageUpload;

