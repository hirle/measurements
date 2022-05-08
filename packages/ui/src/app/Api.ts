import { ApiVersionInterface } from '@measures/apiinterface';
import axios, { AxiosResponse } from 'axios';

export default class Api {
  static GetVersion(): Promise<ApiVersionInterface> {
    return axios.get('/api/version')
      .then( response => Api.checkStatus(response) )
      .then((data) => {
        if (typeof data === 'object'
        && data !== null
        && 'version' in data
        && typeof (data as {version: unknown}).version === 'string'
        && 'major' in data
        && typeof (data as {major: unknown}).major === 'number'
        && 'minor' in data
        && typeof (data as {minor: unknown}).minor === 'number'
        && 'patch' in data) {
            return Promise.resolve(data as ApiVersionInterface);
        } else {
            throw new Error('unexpected data')
        } 
      });
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
        throw new Error(errorMessage);
      }
    }
  }
}
