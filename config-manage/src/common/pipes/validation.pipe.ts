import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata)
    return value
  }
}