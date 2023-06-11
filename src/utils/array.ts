export const convertIntArrayToStringArray = (numbers: number[]): string[] => {
  return numbers.map((num) => num.toString());
};

export const contains = <T>(array: T[], element: T): boolean => {
  return array.includes(element);
};
