import { ApiVersionInterface } from '@measures/apiinterface';
import SemVer from 'semver';
import Supplier from './Supplier';

export default class GetVersion implements Supplier<ApiVersionInterface> {

    private version: string;

    public constructor(version:string) {
        this.version = version;
    }

    public get() : ApiVersionInterface {
        if( SemVer.valid(this.version) ) {
            const semVer : SemVer.classes.semVer = SemVer.parse(this.version);
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