import { Router, Request, Response } from "express";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de usuários.
 *     responses:
 *       200:
 *         description: Uma lista de usuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get("/users", (req: Request, res: Response) => {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];
  res.json(users);
});

export default router;
