import { ApiVersionInterface } from '@measures/restapiinterface';
import * as SemVer from 'semver';
import Supplier from './patterns/Supplier';

export default class GetVersion implements Supplier<ApiVersionInterface> {

    private version: string;

    public constructor(version:string) {
        this.version = version;
    }

    public get() : ApiVersionInterface {
        if( SemVer.valid(this.version) ) {
            const semVer : SemVer.SemVer = SemVer.parse(this.version);
            const returned : ApiVersionInterface = {
                version: this.version,
                major: SemVer.major(semVer),
                minor: SemVer.minor(semVer),
                patch: SemVer.patch(semVer)
            };
            return returned;
        } else {
            throw new Error('Illegal state: can read version');
        }
    }
}