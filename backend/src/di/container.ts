import { AuthService } from '../services/AuthService';
import { AuthController } from '../controllers/AuthController';
import { UserRepository } from '../repository/UserRepository';
import { GitHubService } from '../services/GitHubService';
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repository/ProductRepository';
import { ProductController } from '../controllers/ProductController';
import { PurchaseService } from '../services/PurchaseService';
import { PurchaseRepository } from '../repository/PurchaseRepository';
import { PurchaseController } from '../controllers/PurchaseController'

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const gitHubService = new GitHubService();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);


const purchaseRepository = new PurchaseRepository();
const purchaseService = new PurchaseService(purchaseRepository, gitHubService, productRepository);
const purchaseController = new PurchaseController(purchaseService);

export {
  userRepository,
  authService,
  authController,
  productController,
  gitHubService,
  productRepository,
  productService,
  purchaseRepository,
  purchaseService,
  purchaseController
};