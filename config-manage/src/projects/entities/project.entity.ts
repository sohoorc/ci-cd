import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  config: string
}