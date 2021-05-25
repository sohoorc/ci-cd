/**
 * token鉴权中间件
 */
import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { SECRET } from "src/config";
import { UsersService } from "src/users/users.service";
const jwt = require('jsonwebtoken')

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) { }
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (authHeader) {
      try {
        const token:string = authHeader.split(' ')[1]
        const decode:any = jwt.verify(token, SECRET)
        const user = await this.userService.findOne(decode.id)
        if(!user) {
          throw new Error("没找到用户");
        }
      } catch (error) {
        throw new HttpException({ message: '传入的token有误', code: HttpStatus.FORBIDDEN, result: false }, HttpStatus.FORBIDDEN)
      }
      next()
    } else {
      throw new HttpException({ message: '请传入用户token', code: HttpStatus.FORBIDDEN, result: false }, HttpStatus.FORBIDDEN)
    }
  }
}