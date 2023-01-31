/* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
import { Document, Schema } from 'mongoose';
// import { DB } from 'app/db/database';
// eslint-disable-next-line import/no-cycle
import { DB, productionDB } from '@/db';
import { IPowerplant } from './powerplant.interface';

const powerPlantSchema: Schema = new Schema<IPowerplant>(
  {
    plantName: {
      type: String,
      trim: true,
      default: null,
    },

    state: {
      type: String,
      trim: true,
      default: null,
    },
    district: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    plantCapacity: {
      type: Number,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isHide: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface IPowerPlantModel extends IPowerplant, Document {}

const PowerPlant = DB.model<IPowerPlantModel>(`PowerPlant`, powerPlantSchema);
const ProdPowerPlant = productionDB.model<IPowerPlantModel>(`PowerPlant`, powerPlantSchema);
// export default PowerPlant;
// export { ProdPowerPlant };
export { ProdPowerPlant, PowerPlant };
