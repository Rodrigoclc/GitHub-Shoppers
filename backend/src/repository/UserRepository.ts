import database from '../database/connection';
import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { User } from '../entities/User';
import { CreateUserDto } from '../dto/CreateUserDto';

export class UserRepository implements IUserRepository {
  async create(userData: CreateUserDto & { password_hash: string }): Promise<User> {
    const query = `
      INSERT INTO usuarios (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, password_hash, role, created_at, updated_at
    `;
    
    const result = await database.query(query, [
      userData.email,
      userData.password_hash,
      userData.role || 'user'
    ]);
    
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash, role, created_at, updated_at
      FROM usuarios
      WHERE email = $1
    `;
    
    const result = await database.query(query, [email]);
    
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash, role, created_at, updated_at
      FROM usuarios
      WHERE id = $1
    `;
    
    const result = await database.query(query, [id]);
    
    return result.rows[0] || null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const query = `
      SELECT 1 FROM usuarios WHERE email = $1 LIMIT 1
    `;
    
    const result = await database.query(query, [email]);
    
    return result.rows.length > 0;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const fields = Object.keys(userData).filter(key => key !== 'id');
    const values = fields.map(field => userData[field as keyof User]);
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE usuarios
      SET ${setClause}
      WHERE id = $1
      RETURNING id, email, password_hash, role, created_at, updated_at
    `;
    
    const result = await database.query(query, [id, ...values]);
    
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM usuarios WHERE id = $1`;
    
    const result = await database.query(query, [id]);
    
    return result.rowCount > 0;
  }
}
