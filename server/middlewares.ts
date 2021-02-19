import { Request, Response, NextFunction } from 'express';

export function checkUser(req: Request, res: Response, next: NextFunction): void {
    const bearerToken = req.get('Authorization');
    console.log(bearerToken);
    next();
}