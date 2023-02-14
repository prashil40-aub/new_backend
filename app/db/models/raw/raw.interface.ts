interface IRawData {
  mac?: string | any | null;
  inverters?: Array<any> | any | null;
  meters?: Array<any> | any | null;
  smu?: Array<any> | any | null;
  sensors?: Array<any> | any | null;
  timestamp?: number | any | null;
  createdAt?: number | any | null;
}

export type { IRawData };
