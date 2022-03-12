import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { ApiVersionInterface } from '@measures/interface';
import SemVer from 'semver';

export default class GetVersion {

    private version: string;

    private constructor(version:string) {
        this.version = version;
    }

    private handleRequest(_1: Request, _2: Response, _3: NextFunction) {

        if( SemVer.function.valid(this.version) ) {
            const semVer : SemVer.classes.semVer = SemVer.function.parse(this.version);
            const returned : ApiVersionInterface = {
                version: this.version,
                major: SemVer.function.major(semVer),
                minor: SemVer.function.minor(semVer),
                patch: SemVer.function.patch(semVer)
            }; 
            return returned;
        } else {
            throw new Error('Illegal state, can read version');
        }
    }

    static create(version: string): (req: Request, res: Response, next: NextFunction) => void {
        const returned = new GetVersion(version );
        return returned.handleRequest.bind(returned);
    }
}