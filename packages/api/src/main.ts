import { run } from './Run';

try {
    run(process.argv);
} catch (err) {
    console.log(err);
    process.exit(-1);
}