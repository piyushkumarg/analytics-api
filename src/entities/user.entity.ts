import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import { ApiKey } from './api-key.entity';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, unique: true })
  google_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => ApiKey)
  api_keys: ApiKey[];
}
