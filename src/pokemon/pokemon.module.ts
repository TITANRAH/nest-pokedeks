import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  // todos los mmodules siempre van en imports
  imports: [
    ConfigModule,
    // esto me ayudara a haer la insersion de la bd 
    // recargo el compass y apareera la bd
    // si hay mas modelos mas entidades se pueden agregar aqui separados por coma
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
  exports: [PokemonService],
})
export class PokemonModule {}
