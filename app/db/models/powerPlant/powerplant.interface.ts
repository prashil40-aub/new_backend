interface IPowerplant {
  plantName?: string | null;
  state?: string | null;
  district?: string | null;
  city?: string | null;
  plantCapacity?: number | null;
  isDeleted?: boolean | false;
}

export type { IPowerplant };
