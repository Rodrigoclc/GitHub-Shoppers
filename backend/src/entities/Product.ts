import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Purchase } from "./Purchase";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: 0 })
  current_quantity!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relações
  @ManyToOne(() => User, (user) => user.products)
  user!: User;

  @OneToMany(() => Purchase, (purchase) => purchase.product)
  purchases!: Purchase[];
}
