import { testConfig } from './test.config';
import { devConfig } from './dev.config';
import { Config } from './config.interface';

export let config: Config;


if (process.env.NODE_ENV == 'test') {
    config = testConfig
} else {
    config = devConfig;
}
