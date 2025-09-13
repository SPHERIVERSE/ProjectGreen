import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from '@prisma/client';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Title of the civic report', example: 'Illegal dumping in my neighborhood' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Description of the issue', required: false, example: 'A large pile of trash has been left at the corner of Green St and Elm Ave.' })
  description?: string;

  @IsNotEmpty()
  @IsEnum(ReportType)
  @ApiProperty({ enum: ReportType, description: 'Type of the civic report', example: 'illegal_dumping' })
  type: ReportType;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Latitude of the report location', example: 12.9716 })
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Longitude of the report location', example: 77.5946 })
  longitude: number;
}
