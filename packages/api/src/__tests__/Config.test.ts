import path from 'path';
import fs from 'node:fs/promises';
import { processArgv } from '../Config';
import defaultConfig from '../default.config.json';
import {TmpDir} from 'temp-file';

describe('Config', ()=>{
  
  it('should return default config', () => {
   expect(processArgv(['node','index.js'])).toEqual(defaultConfig);
  });

  it('should read provided file', () => {
    const sampleConfig = {
      "http-port": 12080,
      database: {
        type: "sqlite",
        config: {
          filename: ":memory:"
        },
        sensors: [],
        measurements: [],
        recorders: []
      } 
    };

    const tempDir = new TmpDir();

    return tempDir.createTempDir()
      .then(tempDir =>{
        const sampleConfigFilePath = path.resolve(tempDir, 'sample.config.json');
        return fs.writeFile(sampleConfigFilePath, JSON.stringify(sampleConfig))
          .then( () => Promise.resolve(sampleConfigFilePath));
      })
      .then( sampleConfigFilePath => {
        expect(processArgv(['node','index.js', '--config', sampleConfigFilePath ])).toEqual(sampleConfig);
      })
      .finally( () =>tempDir.cleanup());
  });

  it('should throw an exception when unwanted numbers of parameters', () => {

    const argvsWithbadNumbersOfCharacters: string[][] = [
      [],
      ['node'],
      ['node','1','2','3','4','5'],
    ];

    argvsWithbadNumbersOfCharacters.forEach( argvWithbadNumbersOfCharacters => {
      expect( ()=> processArgv(argvWithbadNumbersOfCharacters)).toThrowError('Bad argument');
    });
  });

  it('should throw an exception when unknown options is given', () => {
    expect( ()=> processArgv(['node', '1', 'not a valid option','path'])).toThrowError('Bad argument');
  });

  it('should throw an exception when option as no argument', () => {
    expect( ()=> processArgv(['node', '1', '2'])).toThrowError('Missing argument: ./path/to/config.json');
  });

});