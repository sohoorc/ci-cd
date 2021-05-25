import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from 'src/common/interface/result.interface';
import { NGINX_PATH } from 'src/config';
import { Repository } from 'typeorm';
import { ProjectEntity } from './entities/project.entity';
import { Project } from './interfaces/project.interface';
const fs = require('fs')
const path = require('path')

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(ProjectEntity) private readonly projectRepository: Repository<ProjectEntity>) { }

  async findAll(): Promise<Result> {
    const allProject = await this.readAllPeoject()

    return {
      code: HttpStatus.OK,
      data: allProject,
      result: true,
      message: 'ok'
    }
  }

  async readAllPeoject(): Promise<Project[]> {
    const nginxPath = path.resolve(NGINX_PATH)
    // const files = await readdir
    const dirs: any = await this.getDirNames(nginxPath)
    const allProjects: Project[] = dirs.map((item) => {
      return {
        name: item,
        path: `${nginxPath}/${item}`,
        config: ''
      }
    })
    return allProjects
  }

  getDirNames(nginxPath: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      fs.readdir(nginxPath, {}, (err, files) => {
        if (err) {
          reject(err)
          return
        }
        const dirs = []
        files.forEach(item => {
          if (fs.existsSync(`${nginxPath}/${item}/project.config.js`)) {
            dirs.push(item)
          }
        });
        resolve(dirs)
      })
    })
  }

  async findProjectConfig(prjName: string): Promise<any> {
    console.log(prjName)
    const projectPath = `${NGINX_PATH}/${prjName}/project.config.js`
    if (!fs.existsSync(projectPath)) {
      throw new HttpException({ message: '未找到该项目', code: HttpStatus.FORBIDDEN, result: false }, HttpStatus.FORBIDDEN)
    }

    const config = await this.readFile(projectPath)
    return {
      code: HttpStatus.OK,
      data: config,
      result: true,
      message: 'ok'
    }
  }

  async readFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          reject(err)
          return;
        }
        resolve(data)
      });
    })
  }

  /**
   * 写入配置项api
   * @param prjName 
   * @param config 
   * @returns 
   */
  async setProjectConfig(prjName: string, config: string): Promise<Result> {
    const projectPath = `${NGINX_PATH}/${prjName}/project.config.js`
    try {
      const writeResult = await this.writeFile(projectPath, config)
      return {
        code: HttpStatus.OK,
        result: true,
        data: null,
        message: writeResult.message
      }
    } catch (error) {
      throw new HttpException({ result: false, code: HttpStatus.FORBIDDEN, message: '配置文件写入失败' }, HttpStatus.FORBIDDEN)
    }
  }

  async writeFile(path: string, config: string): Promise<{ message: string, code: number }> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, config, (err) => {
        if (err) {
          reject(err)
          return;
        }

        resolve({ code: 1, message: '文件写入成功' })
      })
    })
  }
}
