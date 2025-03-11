#!/bin/bash

# 数据库配置
DB_USER="root"
DB_PASS="your_password"
DB_HOST="localhost"
DB_NAME="life_tracker"

# 检查参数
if [ $# -ne 1 ]; then
  echo "用法: $0 <备份文件>"
  echo "示例: $0 backups/life_tracker_20230101_120000.sql.gz"
  exit 1
fi

BACKUP_FILE=$1

# 检查文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
  echo "错误: 备份文件 $BACKUP_FILE 不存在"
  exit 1
fi

# 确认恢复操作
echo "警告: 这将覆盖数据库 $DB_NAME 中的所有数据"
read -p "是否继续? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "操作已取消"
  exit 0
fi

# 恢复数据库
echo "开始恢复数据库 $DB_NAME 从 $BACKUP_FILE..."

# 处理压缩文件
if [[ "$BACKUP_FILE" == *.gz ]]; then
  gunzip < "$BACKUP_FILE" | mysql -u$DB_USER -p$DB_PASS -h$DB_HOST $DB_NAME
else
  mysql -u$DB_USER -p$DB_PASS -h$DB_HOST $DB_NAME < "$BACKUP_FILE"
fi

# 检查恢复是否成功
if [ $? -eq 0 ]; then
  echo "数据库恢复成功"
else
  echo "数据库恢复失败"
  exit 1
fi 