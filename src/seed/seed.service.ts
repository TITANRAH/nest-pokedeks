import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { brotliDecompress } from 'zlib';

@Injectable()
export class SeedService {
  // asi llamo a axios
  private readonly axios: AxiosInstance = axios;

  constructor(private readonly pokemonService: PokemonService) {}
  async executedSeed() {
    // borro todos los pokemones
    await this.pokemonService.deleteAll();

    // hago la peticion a la api
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    console.log(data);

    // recorro los resultados
    // cada resultado es {name: <nombrepokemon>, url: <urlpokemon>}
    // enctonces como se que vienen asi los datos puedo destructurarlos
    // luego exporto el servivcio desde el modulo
    // e importo el modulo que exporta el servicio lo importo aca y puedo usar el create
    // // que solicita un modelo asi
    // export class CreatePokemonDto {
    //   @Min(1)
    //   @IsInt()
    //   @IsPositive()
    //   no: number;

    //   @MinLength(1)
    //   @IsString()
    //   name: string;
    // }

    // esto usamos usando promisses.all pero suarmos insertmany
    // const insertPromisesArray = [];
    data.results.forEach(({ name, url }) => {
      console.log({ name, url });
      // tomo la url y la divido en segmentos
      const segment = url.split('/');

      // console.log(segment)
      // tomo el penultimo segment
      const no: number = +segment[segment.length - 2];
      console.log({ name, no });
      // asi obtengo un {name: Pokemon, no: numero}

      // inserto en la bd con el name que es el nombre del pokemon y que salio del parametro name al destructurar y recorrer la data y el no que es el numero del pokemon
      // await this.pokemonService.create({ name, no });

      // esta es una forma pero suaremos otra
      // insertPromisesArray.push(this.pokemonService.create({ name, no }));

      pokemonToInsert.push({ name, no });
    });
    // ocupamos esto con insertPromisesArray pero ocuparemos otra cosa
    // await Promise.all(insertPromisesArray);

    await this.pokemonService.insertMany(pokemonToInsert);
    return {
      msg: `Seed ejecutado con exito, se insertaron ${data.results.length} pokemones`,
    };
  }
}


// en definitiva usamos insertmany, hicimos la exportacion e importacion de modulos 
// y creamos en el servicio de pokemon 2 servicios nuevos 

// 1. para hacer la eliminacion de la data en la bd y usarla aqui esa funcion al principip de la insercion del seed 
// 2. y otra para usar el insertMany que me permite enviar un arreglo de data a la bd que seria insertMany 

// y en el servicio de seed usamos el insertMany para insertar la data en la bd
// y usamos el metodo deleteAll para eliminar la data de la bd antes de insertar la nueva data

// y en el controlador de seed usamos el metodo executedSeed para ejecutar el seed

// y en el modulo de seed exportamos el servicio y lo importamos en el modulo de app y lo usamos en el controlador de seed

// creamos un arreglo que definimos como     const pokemonToInsert: { name: string; no: number }[] = []; 

// fuera del foreeach, y en el foreach lo llenamos asi 

// data.results.forEach(({ name, url }) => {

//   const segment = url.split('/');

//   const no: number = +segment[segment.length - 2];


//   pokemonToInsert.push({ name, no });

// luego fuera del foreach llamamos a la funcio insertMany del servicio de pokemones y le pasamos el arreglo 
// definido en el parametro y el parametro dice que recibira un arreglo de pokemonos de tipo CreatePokemonDto 
// por loq ue recibe nuestro arreglo y hace la insericion