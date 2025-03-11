#!/bin/bash

# 数据库配置
DB_USER="root"
DB_PASS="your_password"
DB_HOST="localhost"
DB_NAME="life_tracker"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 创建日志目录
mkdir -p logs

# 日志文件
LOG_FILE="logs/setup_$(date +%Y%m%d_%H%M%S).log"

# 执行SQL文件的函数
execute_sql() {
  local file=$1
  echo -e "${YELLOW}执行: $file${NC}"
  
  mysql -u$DB_USER -p$DB_PASS -h$DB_HOST < $file 2>> $LOG_FILE
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}成功: $file${NC}"
    return 0
  else
    echo -e "${RED}失败: $file - 查看日志 $LOG_FILE${NC}"
    return 1
  fi
}

# 开始安装
echo "===== 开始数据库设置 $(date) =====" | tee -a $LOG_FILE

# 创建数据库结构
echo "创建数据库结构..." | tee -a $LOG_FILE

# 按顺序执行SQL文件
execute_sql mysql/schema/01_init.sql || exit 1
execute_sql mysql/schema/04_stored_procedures.sql || exit 1
execute_sql mysql/schema/03_add_triggers.sql || exit 1
execute_sql mysql/schema/02_add_indexes.sql || exit 1

# 导入种子数据
echo "导入种子数据..." | tee -a $LOG_FILE
execute_sql mysql/seeds/00_states.sql || exit 1
execute_sql mysql/seeds/01_users.sql || exit 1
execute_sql mysql/seeds/02_goals.sql || exit 1
execute_sql mysql/seeds/03_projects.sql || exit 1

echo -e "${GREEN}数据库设置完成!${NC}" | tee -a $LOG_FILE
echo "===== 结束数据库设置 $(date) =====" | tee -a $LOG_FILE