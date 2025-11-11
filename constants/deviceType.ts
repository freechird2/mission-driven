/**
 * @todo 키 값이 중요한 정보는 아니지만 암호화가 필요하다면 작업해야함
 */
export type DeviceType = keyof typeof DEVICE | null;
export const DEVICE_TOKEN = "DEVICE";
export const DEVICE = {
  PC: "PC",
  MOBILE: "MOBILE",
} as const;
