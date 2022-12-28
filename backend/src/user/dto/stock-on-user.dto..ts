import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

//Bug in Swagger -> not in Swagger UI!
export class StockOnUserDto {

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  pricePerUnit: number;

  @IsDateString()
  @ApiProperty()
  date?: Date;
}
