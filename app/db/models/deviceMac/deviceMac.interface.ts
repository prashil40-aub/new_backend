interface IDeviceMac {
  deviceId?: number | null;
  serial?: number | null;
  macAddress?: string | null;
  deviceName?: string | null;
  meters?: Array<object> | null;
  inverters?: Array<object> | null;
  useForEnergyCalculation?: string | null;
  isDeleted?: boolean | null;
}

export type { IDeviceMac };
