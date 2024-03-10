const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();

const buildShPath = path.resolve(process.cwd(), './shell/build.sh');

console.log(buildShPath, 'buildShPath~~');

app.get('/auto-build', async (req, res) => {
  // 执行脚本
  exec(`sh ${buildShPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`执行 shell 脚本时出现错误: ${err}`);
      return;
    }
    console.log(`执行结果: ${stdout}`);
  });
  res.send('hhhhh');
});

app.listen(3000, () => {
  console.log('express start 3000');
});

/* 
编写一个sh文件
1. 进入/www/wwwroot/biye-note 目录下
2. 执行 git pull
3. 当 git pull 拉取完代码后，执行 pnpm run build
4. 结束


expree写一个接口，接口一旦被调用就执行这个脚本
*/
