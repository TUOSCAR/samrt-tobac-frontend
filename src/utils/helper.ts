/**
 * 生成随机ID
 * @returns 随机ID
 */
export const generateRandomId = (): number => {
  return Math.floor(Math.random() * 10000) + 1000;
}; 