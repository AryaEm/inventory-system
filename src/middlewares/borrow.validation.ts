import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

const addBorrowValidate = Joi.object({
    user_id: Joi.number().min(0).required(),
    item_id: Joi.number().min(0).required(),
    quantity: Joi.number().min(1).required(),
    borrow_date: Joi.date().required(),
    return_date: Joi.date().required(),
    user: Joi.required()
})

const addReturnValidate = Joi.object({
    borrowId: Joi.date().required(),
    return_date: Joi.date().required(),
    user: Joi.required()
})

const addReportValidate = Joi.object({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    group_by: Joi.string().required(),
    user: Joi.required()
})

const addAnalysisValidate = Joi.object({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    user: Joi.required()
})

export const borrowValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addBorrowValidate.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const returnValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addReturnValidate.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const reportValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addReportValidate.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const analysisValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addAnalysisValidate.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}
