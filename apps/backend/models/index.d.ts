import { Sequelize, Model, DataTypes } from 'sequelize';

export const sequelize: Sequelize;
export const SequelizeType: typeof Sequelize;

export interface Models {
  [key: string]: typeof Model;
}

export const models: Models;

export class User extends Model {
  id: number;
  email: string;
  password: string;
  tenantId: number;
  role: string;
}

export class Job extends Model {
  id: number;
  title: string;
  description: string;
  companyId: number;
}

export class Match extends Model {
  id: number;
  candidateId: number;
  jobId: number;
  status: string;
}