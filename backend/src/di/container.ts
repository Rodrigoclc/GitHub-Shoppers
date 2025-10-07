import { AuthService } from '../services/AuthService';
import { AuthController } from '../controllers/AuthController';
import { UserRepository } from '../repository/UserRepository';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

export {
  userRepository,
  authService,
  authController,
};