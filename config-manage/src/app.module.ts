import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { UserEntity } from './users/entities/user.entity';
import { ProjectEntity } from './projects/entities/project.entity';

@Module({
  imports: [UsersModule, ProjectsModule, TypeOrmModule.forRoot({
    "type": "mysql",
    "host": "172.16.10.58",
    "port": 3306,
    "username": "root",
    "password": "123456",
    "database": "configmanage",
    "entities": [UserEntity, ProjectEntity],
    "synchronize": true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
