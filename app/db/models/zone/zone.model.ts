import { Document, Schema } from 'mongoose';
import { productionDB } from '@/db';
import { IZone } from './zone.interface';

const zoneSchema: Schema = new Schema<IZone>(
  {
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface IZoneModel extends IZone, Document {}

const Zone = productionDB.model<IZoneModel>(`Zone`, zoneSchema);
export default Zone;
