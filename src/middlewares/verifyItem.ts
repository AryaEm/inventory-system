import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

const addItemValidate = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  location: Joi.string().required(),
  quantity: Joi.number().min(0).required(),
  status: Joi.string().valid('Tersedia', 'Kosong').required(),
  user: Joi.required()
})

const editItemValidate = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string().optional(),
  location: Joi.string().optional(),
  quantity: Joi.number().min(0).optional(),
  status: Joi.string().valid('Tersedia', 'Kosong').optional(),
  user: Joi.required()
})


export const verifyAddItem = (req: Request, res: Response, next: NextFunction) => {
  const { error } = addItemValidate.validate(req.body, { abortEarly: false })

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map(it => it.message).join()
    })
  }
  return next()
}

export const verifyeditItem = (req: Request, res: Response, next: NextFunction) => {
  const { error } = editItemValidate.validate(req.body, { abortEarly: false })

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map(it => it.message).join()
    })
  }
  return next()
}