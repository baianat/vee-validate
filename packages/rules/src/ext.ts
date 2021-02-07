const extValidator = (files: File | File[], extensions: string[]) => {
  if (!extensions) {
    extensions = [];
  }

  if (!files) {
    return true;
  }

  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test(file.name));
  }

  return regex.test(files.name);
};

export default extValidator;
