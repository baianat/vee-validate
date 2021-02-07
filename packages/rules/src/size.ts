import { getSingleParam } from './utils';

const sizeValidator = (files: File | File[], params: [number | string] | { size: string | number }) => {
  if (!files) {
    return true;
  }

  let size = getSingleParam(params, 'size');
  size = Number(size);
  if (isNaN(size)) {
    return false;
  }

  const nSize = size * 1024;
  if (!Array.isArray(files)) {
    return files.size <= nSize;
  }

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > nSize) {
      return false;
    }
  }

  return true;
};

export default sizeValidator;
