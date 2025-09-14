import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { FacilityType } from '@prisma/client';

export class CreatePublicFacilityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FacilityType)
  type: FacilityType;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
