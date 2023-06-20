export const convertIntArrayToStringArray = (numbers: number[]): string[] => {
  return numbers.map((num) => num.toString());
};

export const contains = <T>(array: T[], element: T): boolean => {
  return array.includes(element);
};

export const getObjectsByIds = <T extends { id?: number }>(
  objects: T[],
  ids: number[]
): T[] => {
  return objects.filter((obj) => obj.id !== undefined && ids.includes(obj.id));
};

export const mergeObjectArrays = <T extends { id?: number }>(
  ...arrays: T[][]
): T[] => {
  const mergedArray: T[] = [];

  const isEqual = (e: T, element: T) => {
    return e.id === element.id;
  };

  arrays.forEach((array) => {
    array.forEach((element) => {
      if (!mergedArray.some((e) => isEqual(e, element))) {
        mergedArray.push(element);
      }
    });
  });

  return mergedArray;
};
