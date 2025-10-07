import { AuthService } from '../services/AuthService';
import { AuthController } from '../controllers/AuthController';
import { UserRepository } from '../repository/UserRepository';
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repository/ProductRepository';
import { ProductController } from '../controllers/ProductController';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export {
  userRepository,
  authService,
  authController,
  productController,
  productRepository,
  productService,
};