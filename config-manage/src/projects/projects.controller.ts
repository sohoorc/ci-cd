import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Result } from 'src/common/interface/result.interface';
import { ProjectDto } from './dto/project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get('getProjectList')
  async findAll(): Promise<Result> {
    return await this.projectsService.findAll()
  }

  /**
   * 获取单个项目配置
   * @param query 
   */
  @Get('getProjectConfig')
  findProjectConfig(@Query() query: QueryProjectDto) {
    const { prjName } = query
    return this.projectsService.findProjectConfig(prjName)
  }

  @Post('setProjectConfig')
  setProjectConfig(@Body() body: ProjectDto) {
    const { name, config } = body
    return this.projectsService.setProjectConfig(name,config)
  }
}
