import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuração do banco de dados
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'github_shoppers',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
};

async function runMigrations() {
  const pool = new Pool(config);
  const client = await pool.connect();
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    console.log('✅ Conectado ao banco de dados!');

    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Diretório de migrations não encontrado: ${migrationsDir}`);
    }

    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Encontradas ${migrationFiles.length} migrations`);

    for (const file of migrationFiles) {
      // Verificar se é um arquivo de migration válido
      if (!/^\d+_.+\.sql$/.test(file)) {
        console.warn(`⚠️  Nome de arquivo inválido: ${file}. Deve seguir o padrão: 001_nome_da_migration.sql`);
        continue;
      }

      const result = await client.query(
        'SELECT id FROM migrations WHERE filename = $1',
        [file]
      );

      if (result.rows.length > 0) {
        console.log(`⏭️  Migration ${file} já executada`);
        continue;
      }

      console.log(`🔄 Executando migration: ${file}`);
      
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      // Validar se o SQL não está vazio
      if (!migrationSQL.trim()) {
        throw new Error(`Arquivo de migration vazio: ${file}`);
      }

      await client.query(migrationSQL);
      await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
      console.log(`✅ Migration ${file} executada com sucesso`);
    }

    await client.query('COMMIT');
    console.log('🎉 Todas as migrations foram executadas com sucesso!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao executar migrations:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runMigrations();
}

export { runMigrations };