import { Document, Schema } from 'mongoose';
import { prodCloneDB } from '@/db';
import { IRawData } from './raw.interface';

const rawDataSchema: Schema = new Schema<IRawData>({
  mac: {
    type: String,
  },
  inverters: {
    type: Array<any>,
  },
  meters: {
    type: Array<any>,
  },
  smu: {
    type: Array<any>,
  },
  sensors: {
    type: Array<any>,
  },
  timestamp: {
    type: Number,
  },
  createdAt: {
    type: Number,
  },
});

export interface IRawDataModel extends IRawData, Document {}

const Raw = prodCloneDB.model<IRawDataModel>('Raw', rawDataSchema);
export default Raw;
