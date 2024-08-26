import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

// esto define loq ue guaraddre en bd
export class CreatePokemonDto {
  @Min(1)
  @IsInt()
  @IsPositive()
  no: number;

  @MinLength(1)
  @IsString()
  name: string;
}
