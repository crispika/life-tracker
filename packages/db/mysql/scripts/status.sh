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

echo -e "${YELLOW}===== 数据库状态检查 =====${NC}"

# 检查数据库连接
echo -n "数据库连接: "
if mysql -u$DB_USER -p$DB_PASS -h$DB_HOST -e "USE $DB_NAME" &>/dev/null; then
  echo -e "${GREEN}成功${NC}"
else
  echo -e "${RED}失败${NC}"
  exit 1
fi

# 显示表信息
echo -e "\n${YELLOW}表统计:${NC}"
mysql -u$DB_USER -p$DB_PASS -h$DB_HOST -e "
  SELECT 
    table_name AS '表名', 
    table_rows AS '行数',
    ROUND(data_length/1024/1024, 2) AS '数据大小(MB)',
    ROUND(index_length/1024/1024, 2) AS '索引大小(MB)'
  FROM 
    information_schema.tables 
  WHERE 
    table_schema = '$DB_NAME'
  ORDER BY 
    table_rows DESC;
"

# 显示用户统计
echo -e "\n${YELLOW}用户统计:${NC}"
mysql -u$DB_USER -p$DB_PASS -h$DB_HOST -e "
  SELECT 
    COUNT(*) AS '用户总数' 
  FROM 
    $DB_NAME.USER;
"

# 显示目标和项目统计
echo -e "\n${YELLOW}目标和项目统计:${NC}"
mysql -u$DB_USER -p$DB_PASS -h$DB_HOST -e "
  SELECT 
    'UC_GOAL' AS '表名',
    COUNT(*) AS '记录总数',
    COUNT(DISTINCT user_id) AS '用户数'
  FROM 
    $DB_NAME.UC_GOAL
  UNION
  SELECT 
    'UC_PROJECT' AS '表名',
    COUNT(*) AS '记录总数',
    COUNT(DISTINCT user_id) AS '用户数'
  FROM 
    $DB_NAME.UC_PROJECT;
"

echo -e "\n${YELLOW}===== 状态检查完成 =====${NC}" 