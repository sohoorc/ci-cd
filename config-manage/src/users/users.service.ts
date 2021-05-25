import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from 'src/common/interface/result.interface';
import { KEY, SECRET } from 'src/config';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
const jwt = require('jsonwebtoken')
const crypto = require('crypto');




@Injectable()
export class UsersService {
  constructor(
    // 使用 @InjectRepository() 方法将储存库 userRepository 注入到Service中
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto
    const user = await this.userRepository.findOne({ email })
    if (user) {
      throw new HttpException({ message: `已存在邮箱为 ${email} 的用户`, code: HttpStatus.BAD_REQUEST, result: false }, HttpStatus.BAD_REQUEST)
    }
    const newUser = new UserEntity();
    newUser.email = email;
    newUser.name = name;
    const hmac = crypto.createHmac('sha256', KEY);
    hmac.update(password);
    newUser.password = hmac.digest('hex')
    const userInfo = await this.userRepository.save(newUser)

    return { name, email, token: this.generateJWT(userInfo) }
  }

  /**
 * JWT生成
 * @param user 
 * @returns 
 */
  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      exp: exp.getTime() / 1000,  // jwt过期时间
    }, SECRET);
  };

  async login(loginInfo: LoginUserDto): Promise<Result> {
    const { email, password } = loginInfo
    const hmac = crypto.createHmac('sha256', KEY);
    hmac.update(password);
    const user = await this.userRepository.findOne({ email, password: hmac.digest('hex') })
    if (!user) {
      throw new HttpException({ message: '用户名或密码有误', code: HttpStatus.BAD_REQUEST, result: false }, HttpStatus.BAD_REQUEST)
    }
    return { result: true, code: HttpStatus.OK, message: 'ok', data: { email, name: user.name, token: this.generateJWT(user) } }
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ id })
  }

  update(updateUserDto: UpdateUserDto) {
    return `This action updates a #$ user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
