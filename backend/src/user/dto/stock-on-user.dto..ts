import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

//Bug in Swagger -> not in Swagger UI!
export class StockOnUserDto {
  //If user buys a stock a stock, he has to send infos about the amount and the stockId
  @ApiProperty()
  @IsNotEmpty()
  amount: number;
}
