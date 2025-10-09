import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/environment';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: config.nodeEnv === 'production' 
    ? ['https://git-hub-shoppers.vercel.app']
    : ['http://localhost:5173', 'https://git-hub-shoppers.vercel.app', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

app.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Powered-By', 'GitHub-Shoppers-API');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'GitHub Shoppers API',
    version: '1.0.0',
    status: 'Online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      itens: '/api/itens',
      compras: '/api/compras'
    },
    documentation: 'https://github.com/your-repo/github-shoppers-backend'
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
