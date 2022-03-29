const rollup = require('rollup');
import type { Options } from './types/type';
import Handle from '@/Observer/HandlerSubject';
import Terser from '@/handlers/Terser';
import Uglify from '@/handlers/Uglify';
import Typescript from '@/handlers/Typescript';
import Babel from '@/handlers/Babel';
import Eval from '@/handlers/Eval';
import Default from '@/handlers/Default';

export default async function bundleStart(options: Options): Promise<undefined>;
export default async function bundleStart(options: Options, isReturnOutput: true): Promise<string>;
export default async function bundleStart(options: Options, isReturnOutput = false) {
  const subject = new Handle(options);
  try {
    // 处理默认值
    subject.attach(new Default());
    // ts
    subject.attach(new Typescript());
    // babel
    subject.attach(new Babel());
    // 压缩
    subject.attach(new Terser());
    // uglify-js 包含terser和部分babel的效果
    subject.attach(new Uglify());
    // eval混淆
    subject.attach(new Eval());

    subject.notifyUpdate();

    const rs = await rollup.rollup({
      input: options.input, // 入口文件
      plugins: subject.getPlugins(),
    });
    const { output: outputs } = await rs.write({
      name: options.libraryName, // umd 模式必须要有 name  此属性作为全局变量访问打包结果
      file: options.output,
      banner: options.banner,
      format: typeof options.module === 'string' ? options.module : 'umd',
      sourcemap: false,
    });
    if (isReturnOutput) {
      return outputs[0]?.code;
    }
  } finally {
    subject.notifyDestroy();
  }
}
