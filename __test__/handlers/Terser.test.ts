import Terser from '@/handlers/Terser';
import { Options } from '@/types/type';
import { TestLoadPlugin } from './CommonLoadPlugin';

describe('Terser', () => {
  const options: Options = {
    input: '',
    output: '',
    module: 'umd',
    banner: '',
  };
  TestLoadPlugin({
    name: 'test Terser load plugin',
    options,
    ConcreteObserver: Terser,
    unloadOptions: {
      terser: false,
    },
    loadOptions: { terser: true },
  });
});
