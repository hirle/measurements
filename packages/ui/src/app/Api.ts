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
    switch(true) {
      case (response.status === 204):   
        return Promise.resolve();
      case (response && response.status >=200 && response.status < 300 ):
        return Promise.resolve(response.data);
      default: {
        const errorMessage = [
          response.status,
          response.statusText,
          response.data ? response.data.toString() : null,
        ].join(':');
        return Promise.reject(new Error(errorMessage));
      }
    }
  }
}
