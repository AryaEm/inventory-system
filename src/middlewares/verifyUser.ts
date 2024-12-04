import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

const addUserValidate = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().valid('Admin', 'Siswa').required(),
})

const editUserValidate = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().min(4).optional(),
    role: Joi.string().valid('Admin', 'Siswa').optional(),
    user: Joi.required()
    
})


export const verifyAddUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addUserValidate.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyeditUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = editUserValidate.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}
