export const getExtension = (fileName: string) => {
  const dotIdx = fileName.lastIndexOf(".");
  if (dotIdx === -1) {
    return "";
  }
  return fileName.substring(dotIdx + 1);
};
