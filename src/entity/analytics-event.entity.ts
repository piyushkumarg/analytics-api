import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'analytics_events', timestamps: true })
export class AnalyticsEvent extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  event: string;

  @Column({ type: DataType.STRING })
  url: string;

  @Column({ type: DataType.STRING })
  referrer: string;

  @Column({ type: DataType.STRING })
  device: string;

  @Column({ type: DataType.STRING })
  ipAddress: string;

  @Column({ type: DataType.DATE })
  timestamp: Date;

  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @Column({ type: DataType.STRING })
  userId: string;

  @Column({ type: DataType.STRING })
  appId: string;
}
