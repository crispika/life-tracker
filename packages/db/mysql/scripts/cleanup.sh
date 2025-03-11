#!/bin/bash

# 数据库配置
DB_USER="root"
DB_PASS="your_password"
DB_HOST="localhost"
DB_NAME="life_tracker"

# 确认清理操作
echo "警告: 这将删除数据库 $DB_NAME 中的所有数据，但保留表结构"
read -p "是否继续? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "操作已取消"
  exit 0
fi

# 创建临时SQL文件
TEMP_SQL=$(mktemp)

# 生成清空表的SQL语句
echo "USE $DB_NAME;" > $TEMP_SQL
echo "SET FOREIGN_KEY_CHECKS = 0;" >> $TEMP_SQL

# 获取所有表并生成TRUNCATE语句
mysql -u$DB_USER -p$DB_PASS -h$DB_HOST -N -e "SHOW TABLES FROM $DB_NAME" | \
while read table; do
  echo "TRUNCATE TABLE $table;" >> $TEMP_SQL
done

echo "SET FOREIGN_KEY_CHECKS = 1;" >> $TEMP_SQL

# 执行清空操作
echo "开始清空数据库表..."
mysql -u$DB_USER -p$DB_PASS -h$DB_HOST < $TEMP_SQL

# 检查操作是否成功
if [ $? -eq 0 ]; then
  echo "数据库表已清空"
else
  echo "清空数据库表失败"
  exit 1
fi

# 删除临时文件
rm $TEMP_SQL 