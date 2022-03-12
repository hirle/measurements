import Config from './Config';
import fs from 'fs';
import Logger from "./Logger";
import GetVersion from './GetVersion';
import Web from "./Web";

export function run(argv: string[]): number {
    
    const config = processArgv(argv);

    const logger: Logger = Logger.create(config.logs);
    
    const web = new Web(config);
    
    web.startOn();

    setupApiRoutes(web );
    
    logger.info('Ready!');

    return 0;
}

function setupApiRoutes( web: Web ) {
  const getVersion = GetVersion.create(process.env.npm_package_version);
  web.recordGetRoute('/api/version', getVersion);
}

function processArgv(argv: string[]): Config {
    switch( argv.length ) 
    {
      case 3: throw new Error('Missing argument: ./path/to/config.json');
      case 4: if( argv[2] === '--config' ) {
          return JSON.parse(fs.readFileSync(argv[3], 'utf8'))
        }  else {
          throw new Error('Bad argument');
        } 
      default:  
        throw new Error('Bad argument');
    }
  }
