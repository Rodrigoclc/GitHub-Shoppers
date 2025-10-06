import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  buyer_github_login!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relações
  @ManyToOne(() => Product, product => product.purchases)
  product!: Product;

  @ManyToOne(() => User, user => user.purchases)
  user!: User;
}