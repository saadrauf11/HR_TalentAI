import { Model, Sequelize } from 'sequelize';

export interface CandidateAttributes {
  id: string;
  tenantId: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
}

export class Candidate extends Model<CandidateAttributes> implements CandidateAttributes {
  public id!: string;
  public tenantId!: string;
  public name?: string;
  public email?: string;
  public phone?: string;
  public createdAt?: Date;
}

declare global {
  namespace NodeJS {
    interface Global {
      sequelize: Sequelize;
      Candidate: typeof Candidate;
    }
  }
}