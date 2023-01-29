interface IPowerplant {
  // _id?: string | null;
  plantName?: string | null;
  state?: string | null;
  district?: string | null;
  city?: string | null;
  plantCapacity?: number | null;
  isDeleted?: boolean | false;
}

interface IPowerPlantData extends IPowerplant {
  _id?: string | null;
}

export type { IPowerplant, IPowerPlantData };
