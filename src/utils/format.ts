// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
