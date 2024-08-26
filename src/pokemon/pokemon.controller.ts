import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  // PARA ENVIAR 200 EN VEZ DE 201 USAMOS HTTPCODE
  // @HttpCode(HttpStatus.OK)
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  // para cada verbo cuando se necesite debo crear un dto dto es como espero que sean los paramtros
  // en este caso limit offset es lo que necesito registra
  // hay que hacer que las propiedades del dto sean opcionales por que no siempre vendran
  // se o paso al servicio para que el servicio haga la logica de paginacion
  // tuve que modificar el main asi

  // transform: true,
  // transformOptions: {
  //   enableImplicitConversion: true,
  // },

  // para que conviritera los datos de string a number de los querysparameters de la url
  // ya que siempre son string los queryparameter
  findAll(@Query() paginationDto: PaginationDto) {
    console.log({ paginationDto });

    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
