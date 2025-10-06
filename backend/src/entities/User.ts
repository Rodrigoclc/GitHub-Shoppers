import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./Product";
import { Purchase } from "./Purchase";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relações
  @OneToMany(() => Product, (product) => product.user)
  products!: Product[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases!: Purchase[];
}
