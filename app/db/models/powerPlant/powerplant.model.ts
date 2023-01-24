/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Document, Schema } from 'mongoose';
// import { DB } from 'app/db/database';
import { DB } from '@/db';
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
  },
  {
    timestamps: true,
  }
);

export interface IPowerPlantModel extends IPowerplant, Document {}

const PowerPlant = DB.model<IPowerPlantModel>(`PowerPlant`, powerPlantSchema);
export default PowerPlant;
