let currentId = Date.now();
export const generateId = () => {
  return currentId++;
};
