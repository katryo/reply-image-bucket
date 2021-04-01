import {useDropzone} from 'react-dropzone';
import React, {useCallback} from 'react';
import {Box, Image as ChakraImage} from '@chakra-ui/react';

export const DropZone = ({
  handleFileDropped,
  handleImageLoad,
  imageSrc,
}: {
  handleFileDropped: (file: File) => void;
  handleImageLoad: (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void;
  imageSrc: string;
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      handleFileDropped(file);
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      // reader.onload = () => {};
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {getRootProps, getInputProps} = useDropzone({onDrop});
  return (
    <div {...getRootProps()}>
      <Box backgroundColor="gray" minHeight="10rem" color="white" p="1rem">
        <input {...getInputProps()} />
        <p>Drop an image or click here to select a file</p>
        {imageSrc !== '' && (
          <ChakraImage
            objectFit="cover"
            src={imageSrc}
            onLoad={handleImageLoad}
          />
        )}
      </Box>
    </div>
  );
};
