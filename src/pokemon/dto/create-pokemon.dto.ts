import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @Min(1)
  @IsInt()
  @IsPositive()
  no: number;

  @MinLength(1)
  @IsString()
  name: string;
}
