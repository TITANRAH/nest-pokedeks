import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response';

@Injectable()
export class SeedService {
  // asi llamo a axios
  private readonly axios: AxiosInstance = axios;
  async executedSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    console.log(data);

    // recorro los resultados
    data.results.forEach(({ name, url }) => {
      console.log({ name, url });
      // tomo la url y la divido en segmentos
      const segment = url.split('/');

      // console.log(segment)
      // tomo el penultimo segment
      const no: number = +segment[segment.length - 2];
      console.log({ name, no });
      // asi obtengo un {name: Pokemon, no: numero}
    });
    return data.results;
  }
}
