import { Schema, model, Document } from 'mongoose';
import { IAdmin } from './admin.interface';

const adminSchema: Schema = new Schema<IAdmin>({
  fullName: { type: String, trim: true, index: true, default: null, sparse: true },
});

export interface IAdminModel extends IAdmin, Document {}

const AdminModel = model<IAdminModel>('Admin', adminSchema);
export default AdminModel;
