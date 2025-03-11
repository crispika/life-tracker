#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 确认操作
echo -e "${YELLOW}这将重新初始化整个数据库，包括:${NC}"
echo "1. 删除并重新创建数据库"
echo "2. 创建所有表结构"
echo "3. 创建存储过程和触发器"
echo "4. 添加索引"
echo "5. 导入所有种子数据"
echo ""
read -p "是否继续? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "操作已取消"
  exit 0
fi

# 执行setup.sh
echo -e "${YELLOW}开始执行数据库设置...${NC}"
bash "$SCRIPT_DIR/setup.sh"

# 检查setup.sh是否成功
if [ $? -eq 0 ]; then
  echo -e "${GREEN}数据库初始化成功!${NC}"
  
  # 执行状态检查
  echo -e "${YELLOW}执行数据库状态检查...${NC}"
  bash "$SCRIPT_DIR/status.sh"
else
  echo -e "${RED}数据库初始化失败!${NC}"
  exit 1
fi 