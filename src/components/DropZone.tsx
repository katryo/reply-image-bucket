import { useDropzone } from "react-dropzone";
import React, { useCallback } from "react";
import { Box, Image } from "@chakra-ui/react";

export const DropZone = ({
  handleFileDropped,
  imageSrc,
}: {
  handleFileDropped: (file: File) => void;
  imageSrc: string;
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      handleFileDropped(file);
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()}>
      <Box backgroundColor="blue" width={700} minHeight={200}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        {imageSrc !== "" && <Image objectFit="cover" src={imageSrc} />}
      </Box>
    </div>
  );
};
