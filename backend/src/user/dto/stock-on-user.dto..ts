import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

//Bug in Swagger -> not in Swagger UI!
export class StockOnUserDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;
}
