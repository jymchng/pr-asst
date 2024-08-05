import { tags } from 'typia';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { appConstants } from '../../core/app.constants';

export type Fill = {
  order_id: bigint & tags.Type<'uint64'>;
  fill_price: number & tags.Type<'double'>;
  fill_quantity: number & tags.Type<'double'>;
  side: 'BUY' | 'SELL';
  exchange: string;
  symbol: string;
  fees: number & tags.Type<'double'>;
  timestamp: Date & tags.Format<'date-time'>;
};

@Entity({
  name: appConstants.databaseRelated.tables.fills,
  synchronize: true,
})
export class FillEntity {
  @Column('integer', { nullable: false })
  order_id!: number;

  @Column('double', { nullable: false })
  fill_price!: number;

  @Column('double', { nullable: false })
  fill_quantity!: number;

  @Column('text', { nullable: false })
  side!: 'BUY' | 'SELL';

  @Column('text', { nullable: false })
  exchange!: string;

  @Column('text', { nullable: false })
  symbol!: string;

  @Column('double', { nullable: false })
  fees!: number;

  @PrimaryColumn('datetime', { nullable: false })
  timestamp!: Date;
}
