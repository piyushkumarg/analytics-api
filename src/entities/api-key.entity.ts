import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({ tableName: 'api_keys', timestamps: true })
export class ApiKey extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;
  @Column({ type: DataType.STRING, unique: true })
  key: string;

  @Column({ type: DataType.STRING, allowNull: false })
  app_name: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id: string;

  @BelongsTo(() => User)
  user: User;
}
