import { IsNotEmpty } from 'class-validator'
export class QueryProjectDto {
  @IsNotEmpty()
  prjName: string
}