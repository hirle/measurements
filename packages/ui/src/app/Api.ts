import { ApiVersionInterface, narrowApiVersionInterface } from '@measures/restapiinterface';
import axios, { Axios, AxiosResponse } from 'axios';

export default class Api {

  private axios: Axios;
  static readonly defaultTimeout = 3000;

  private constructor( baseURL?: string ){
    this.axios = axios.create({
      timeout: Api.defaultTimeout,
      baseURL,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    });
  }

  GetVersion(): Promise<ApiVersionInterface> {
    return this.axios.get('/api/version')
      .then( response => Api.checkStatus(response) )
      .then( data => Promise.resolve(narrowApiVersionInterface(data)));
  }

  public static create(baseURL?: string) {
    return new Api(baseURL);
  }

  private static checkStatus(response: AxiosResponse): Promise<unknown> {
    return Promise.resolve( response.status === 204 ? undefined : response.data );
  }
}
