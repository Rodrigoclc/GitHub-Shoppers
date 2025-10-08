import Joi from 'joi';

export const userValidation = {
  create: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email deve ter um formato válido',
        'any.required': 'Email é obrigatório'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Senha deve ter pelo menos 6 caracteres',
        'any.required': 'Senha é obrigatória'
      }),
    role: Joi.string()
      .valid('admin', 'user')
      .optional()
      .messages({
        'any.only': 'Role deve ser "admin" ou "user"'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email deve ter um formato válido',
        'any.required': 'Email é obrigatório'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Senha é obrigatória'
      })
  })
};

export const itemValidation = {
  create: Joi.object({
    nome: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required()
      .messages({
        'string.min': 'Nome do item é obrigatório',
        'string.max': 'Nome do item deve ter no máximo 255 caracteres',
        'any.required': 'Nome do item é obrigatório'
      }),
    preco: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.positive': 'Preço deve ser um valor positivo',
        'any.required': 'Preço é obrigatório'
      }),
    qtd_atual: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        'number.integer': 'Quantidade deve ser um número inteiro',
        'number.min': 'Quantidade não pode ser negativa',
        'any.required': 'Quantidade atual é obrigatória'
      })
  }),

  update: Joi.object({
    nome: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .optional()
      .messages({
        'string.min': 'Nome do item é obrigatório',
        'string.max': 'Nome do item deve ter no máximo 255 caracteres'
      }),
    preco: Joi.number()
      .positive()
      .precision(2)
      .optional()
      .messages({
        'number.positive': 'Preço deve ser um valor positivo'
      }),
    qtd_atual: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.integer': 'Quantidade deve ser um número inteiro',
        'number.min': 'Quantidade não pode ser negativa'
      })
  })
};

export const purchaseValidation = {
  create: Joi.object({
    item_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.integer': 'ID do item deve ser um número inteiro',
        'number.positive': 'ID do item deve ser um valor positivo',
        'any.required': 'ID do item é obrigatório'
      })
  })
};

export const idValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'ID deve ser um número inteiro',
      'number.positive': 'ID deve ser um valor positivo',
      'any.required': 'ID é obrigatório'
    })
});
