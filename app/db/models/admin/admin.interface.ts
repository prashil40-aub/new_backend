import { Schema } from 'mongoose';

interface IAdmin {
  // id?: Schema.Types.ObjectId | string | null;
  fullName: string | null;
  organisationId?: Schema.Types.ObjectId | string | null;
  organisationIds?: Array<Schema.Types.ObjectId> | Array<string>;
  company?: string | null;
  designation?: string | null;
  phone?: string | null;
  access?: number | null;
  userType?: number | null;
  email?: string | null;
  password: string | null;
  passwordResetToken?: string | null;
  registrationDate?: string | null;
  emailVerification?: string | null;
  emailVerificationToken?: string | null;
  mobile?: string | null;
  tag?: string | null;
  subTag?: string | null;
  assignZone?: string | null;
  assignZoneId?: Schema.Types.ObjectId | string | null;
  permissions?: Record<string, unknown> | null;
  isDeleted?: boolean | null;
  deletedAt?: string | Schema.Types.Date | null;
  favPlants?: Array<unknown> | null;
  plants?: Array<unknown> | null;
  // organisationIds?: Array<any> | null;
  createdAt?: string | Schema.Types.Date | null;
  updatedAt?: string | Schema.Types.Date | null;
}
export type { IAdmin };
