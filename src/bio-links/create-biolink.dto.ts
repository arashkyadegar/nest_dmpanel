import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

import { CreateLinkDto } from 'src/links/create-link.dto';
import { CreateMapDto } from 'src/maps/create-map.dto';
import { CreateSuperLinkDto } from 'src/super-links/create-superlink.dto';
import { CreateImageDto } from 'src/images/create-image.dto';

export class CreateBioLinkDto {
  @IsString()
  @Length(3, 10)
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMapDto)
  map: CreateMapDto;

  @IsString()
  userId: ObjectId;

  @Length(3, 50)
  link: string;

  @IsOptional()
  @IsUrl()
  video: string;

  @Length(3, 50)
  @IsString()
  title: string;

  @Length(10, 400)
  desc: string;

  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  links: CreateLinkDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateSuperLinkDto)
  superLinks: CreateSuperLinkDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  slider: CreateImageDto[];

  @IsOptional()
  @IsDate()
  createdAt: Date | undefined;

  @IsOptional()
  @IsDate()
  updatedAt: Date | undefined;
}

export class UpdateBioLinkDto extends CreateBioLinkDto {
  @IsString()
  id: string;
}
