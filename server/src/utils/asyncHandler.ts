import { NextFunction, Request, Response } from "express"

type requestHandlerType = (req: Request, res: Response, next?: NextFunction) => Promise<any>

const asyncHandler = (requestHandler: requestHandlerType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch(err => next(err))
    }
}

export default asyncHandler;