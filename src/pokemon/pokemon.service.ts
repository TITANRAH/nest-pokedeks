import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    // para poder insertar en la bd debo instanciar la forma y asi es la forma
    // // inyectando el modelo, usando este decorador y aplicandolo en el cosntructor de este servicio
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return {
        msg: 'Pokemon creado',
        pokemon: pokemon,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `El pokemon ${createPokemonDto.name} ya existe, error: ${JSON.stringify(error.keyValue)}`,
        );
      }

      console.log(error);

      throw new InternalServerErrorException('Error al guardar el pokemon');
    }
  }

  findAll() {
    const pokemons = this.pokemonModel.find();
    return pokemons;
  }

  async findOne(term: string) {
    // entity
    let pokemon: Pokemon;

    // puedo buscar en el mismo endpoint por numero
    // si esto es un numero eso es essta validacion
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // si no encontro pokemon arriba que busque por id siempre y cuando aun no haya pokemon encontrado
    // puedo biscar en el mismo endpoint por id mongo
    // mongo id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // puedo buscar en el mismo endpoint por nombre
    // name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    // si no encontro nada
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon con el término o id ${term} no encontrado`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    console.log(term);

    try {
      // busco al pokemon
      const pokemon = await this.findOne(term);

      console.log(pokemon);

      // si no encuentra lanza excepcion

      // si el nombre viene en el dto lo convierto a minusculas
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

      // actualizo el pokemon si no le mando el new no me regresara el pokemon actualizado
      await pokemon.updateOne(updatePokemonDto, { new: true });

      // regreso el pokemon actualizado en donde se mezclan los datos del pokemon y los del dto
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `El pokemon ${updatePokemonDto.name} ya existe por no, id o name verifica el error -> error: ${JSON.stringify(error.keyValue)}`,
        );
      }

      console.log(error);
      throw new InternalServerErrorException(error.message, error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);

    // await pokemon.deleteOne();

    // const result =  await this.pokemonModel.findByIdAndDelete(id)

    // cuando uso deleteone me devuelve un campo que cuenta cuantos objetos se eliminaron
    // en este caso si elimina uno dira uno pero si al darle al eliminar devuelve cero
    // eso indicaria que no elimino nada por que ya habia sido eliminado antes el objeto
    // si no validamos esto dara respuesta 200 pese a no eliminar nada
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`El pokemon con id ${id} no existe`);
    } else {
      return {
        msg: `Pokemon con id ${id} eliminado`,
      };
    }
  }
}
