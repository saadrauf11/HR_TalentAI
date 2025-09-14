import { Model, Sequelize, DataTypes } from 'sequelize';

export interface CandidateAttributes {
  id: string;
  tenantId: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
}

declare module '../models/Candidate' {
  export default function (sequelize: Sequelize, dataTypes: typeof DataTypes): Model<CandidateAttributes>;
}
