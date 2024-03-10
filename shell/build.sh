#!/bin/bash  
  
# 切换到目标目录  
cd /www/wwwroot/biye-note/ || { echo "无法进入目录 /www/wwwroot/biye-note"; exit 1; }  

echo "目录切换完成"

# 执行 git pull 命令  
git pull || { echo "git pull 执行失败"; exit 1; }

echo "代码拉取完成"
  
# 当 git pull 拉取完代码后，执行 pnpm run build  
pnpm run build || { echo "pnpm run build 执行失败"; exit 1; }
  
# 打印执行完毕的信息  
echo "构建成功"