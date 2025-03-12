#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}从数据库生成 Prisma 模型...${NC}"

# 检查数据库连接
echo -e "${YELLOW}检查数据库连接...${NC}"
if ! mysql -h localhost -P 3306 -u root -ppassword123 -e "USE life_tracker" &>/dev/null; then
  echo -e "${RED}错误: 无法连接到数据库，请确保数据库已启动${NC}"
  exit 1
fi

# 使用 Prisma 内省数据库
echo -e "${YELLOW}执行 Prisma 内省...${NC}"
npx prisma db pull

# 生成 Prisma 客户端
echo -e "${YELLOW}生成 Prisma 客户端...${NC}"
npx prisma generate

echo -e "${GREEN}Prisma 模型和客户端生成完成!${NC}"
echo -e "${YELLOW}现在您可以在应用程序中使用 Prisma 客户端访问数据库${NC}" 