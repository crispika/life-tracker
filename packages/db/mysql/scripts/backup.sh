#!/bin/bash

# 数据库配置
DB_USER="root"
DB_PASS="your_password"
DB_HOST="localhost"
DB_NAME="life_tracker"

# 备份目录
BACKUP_DIR="backups"
mkdir -p $BACKUP_DIR

# 备份文件名
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql"

# 执行备份
echo "开始备份数据库 $DB_NAME 到 $BACKUP_FILE..."
mysqldump -u$DB_USER -p$DB_PASS -h$DB_HOST --routines --triggers --events $DB_NAME > $BACKUP_FILE

# 检查备份是否成功
if [ $? -eq 0 ]; then
  echo "备份成功: $BACKUP_FILE"
  
  # 压缩备份文件
  gzip $BACKUP_FILE
  echo "备份文件已压缩: ${BACKUP_FILE}.gz"
  
  # 删除超过30天的备份
  find $BACKUP_DIR -name "*.gz" -type f -mtime +30 -delete
  echo "已删除超过30天的旧备份"
else
  echo "备份失败"
  exit 1
fi 