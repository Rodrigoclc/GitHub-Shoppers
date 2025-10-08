import app from './app';
import config from './config/environment';
import database from './database/connection';

const startServer = async (): Promise<void> => {
  try {
    // Testar conexão com o banco de dados
    console.log('Testando conexão com o banco de dados...');
    await database.query('SELECT 1');
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso');

    // Iniciar servidor
    const server = app.listen(config.port, () => {
      console.log(`🚀 Servidor rodando na porta ${config.port}`);
      console.log(`Documentação da API em http://localhost:${config.port}/docs`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 Recebido sinal ${signal}. Iniciando shutdown graceful...`);
      
      server.close(async () => {
        console.log('🔌 Servidor HTTP fechado');
        
        try {
          await database.close();
          console.log('🗄️ Conexões do banco de dados fechadas');
          console.log('✅ Shutdown concluído com sucesso');
          process.exit(0);
        } catch (error) {
          console.error('❌ Erro durante o shutdown:', error);
          process.exit(1);
        }
      });

      // Forçar saída se o shutdown demorar muito
      setTimeout(() => {
        console.error('⚠️ Shutdown forçado após timeout');
        process.exit(1);
      }, 10000);
    };

    // Handlers para sinais de sistema
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handler para erros não capturados
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}

export default app;
