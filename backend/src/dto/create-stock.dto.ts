import { IsString, IsInt, IsPositive } from 'class-validator';

export class CreateStockDto {
  @IsString()
  code: string;

  @IsInt()
  @IsPositive()
  amount: number;

  @IsInt()
  userId: number;
}