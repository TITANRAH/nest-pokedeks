import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response';

@Injectable()
export class SeedService {
  // asi llamo a axios
  private readonly axios: AxiosInstance = axios;
  async executedSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    data.results.forEach(({name, url}) => {
      console.log({name, url});
        const segment = url.split('/');
        
    })
    return data.results;
  }
}
