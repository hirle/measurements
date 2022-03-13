import { ApiVersionInterface } from '@measures/interface';

export default class Api {

    static GetVersion(): Promise<ApiVersionInterface> {
        return fetch('/api/version')
            .then(Api.checkStatus);
    }

    private static checkStatus(response: Response): Promise<any> {
        if (response.ok) {
            return response.status === 204 ? Promise.resolve() : response.json();
        } else {
            const errorMessage = [response.status, response.statusText, response.body ? response.body.toString() : null].join(':');
            throw new Error(errorMessage);
        }
    }
}
