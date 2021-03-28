import { useDropzone } from "react-dropzone";
import React, { useCallback } from "react";
import { Box, Image as ChakraImage } from "@chakra-ui/react";

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
      <Box backgroundColor="gray" minHeight="10rem" color="white" p="1rem">
        <input {...getInputProps()} />
        <p>Drop an image or click here to select a file</p>
        {imageSrc !== "" && <ChakraImage objectFit="cover" src={imageSrc} />}
      </Box>
    </div>
  );
};
