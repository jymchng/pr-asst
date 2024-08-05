import { PartialType } from '@nestjs/mapped-types';
import { CreateFillDto } from './create-fill.dto';

export class UpdateFillDto extends PartialType(CreateFillDto) {}
