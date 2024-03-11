const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 3000;

const buildShPath = path.resolve(process.cwd(), './shell/build.sh');

console.log(buildShPath, 'buildShPath~~');

// 设置一个 secret，这个 secret 应该与你在 GitHub webhook 配置中设置的 secret 相匹配
const webhookSecret = 'your_webhook_secret';

app.use(express.json());

// 处理 GitHub webhook 的 POST 请求
app.post('/github-webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const event = req.headers['x-github-event'];
  const id = req.headers['x-github-delivery'];
  const calculatedSignature = createHmac(
    'sha256',
    webhookSecret,
    JSON.stringify(req.body)
  );

  console.log(signature, 'signature');
  console.log(event, 'event');
  console.log(id, 'id');
  console.log(calculatedSignature, 'calculatedSignature');

  if (!signature || !event || signature !== `sha256=${calculatedSignature}`) {
    // 如果签名不匹配或缺少必要的头信息，则返回 403 Forbidden
    res.status(403).send('Forbidden');
  } else {
    // 如果签名匹配且事件类型是你想要的（例如 push），则处理请求
    if (event === 'push') {
      // 在这里处理 push 事件
      res.send('Webhook received and processed successfully');
    } else {
      // 如果事件类型不是你所期望的，可以返回适当的响应
      res.status(400).send('Invalid event type');
    }
  }
});

// 创建一个 HMAC 签名，用于验证请求是否来自 GitHub
function createHmac(algorithm, secret, payload) {
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(payload);
  return hmac.digest('hex');
}

app.get('/auto-build', async (req, res) => {
  // 执行脚本
  exec(`sh ${buildShPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`执行 shell 脚本时出现错误: ${err}`);
      return;
    }
    console.log(`执行结果: ${stdout}`);
    res.send('构建完成');
  });
});

// 启动 Express 服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
