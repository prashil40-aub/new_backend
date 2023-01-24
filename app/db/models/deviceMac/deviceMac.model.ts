import { Document, Schema } from 'mongoose';
import { DB } from '@/db';
import { IDeviceMac } from './deviceMac.interface';

const deviceMacSchema: Schema = new Schema<IDeviceMac>({
  deviceId: { type: Number },
  serial: { type: Number },
  macAddress: {
    type: String,
    trim: true,
    unique: true,
    index: true,
    default: null,
    sparse: true,
  },
  deviceName: { type: String, trim: true, index: true, default: null },
  meters: { type: Array<object>, default: [] },
  inverters: { type: Array<object>, default: [] },
  useForEnergyCalculation: {
    type: String,
    enum: ['inverter', 'meter', 'none'],
    default: 'meter',
  },
  isDeleted: { type: Boolean, default: false },
});

export interface IDeviceMacModel extends IDeviceMac, Document {}

const DeviceMac = DB.model<IDeviceMacModel>('DeviceMac', deviceMacSchema);
export default DeviceMac;
