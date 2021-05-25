import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ProjectEntity } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports:[TypeOrmModule.forFeature([ProjectEntity,UserEntity]),UsersModule],
  controllers:[ProjectsController],
  providers:[ProjectsService]
})
export class ProjectsModule implements NestModule{
  // 注册中间件 用于对接口传入的token进行校验
  configure(consumer:MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('projects')
  }
}
