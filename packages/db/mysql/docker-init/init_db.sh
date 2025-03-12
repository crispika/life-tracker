#!/bin/bash
set -e

echo "等待 MySQL 启动..."
until mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD --silent; do
  sleep 1
done

echo "MySQL 已启动，开始初始化数据库..."

# 设置工作目录
cd /docker-entrypoint-initdb.d/..

# 执行数据库初始化脚本
mysql -u root -p$MYSQL_ROOT_PASSWORD < mysql/schema/01_init.sql
mysql -u root -p$MYSQL_ROOT_PASSWORD < mysql/schema/04_stored_procedures.sql
mysql -u root -p$MYSQL_ROOT_PASSWORD < mysql/schema/03_add_triggers.sql
mysql -u root -p$MYSQL_ROOT_PASSWORD < mysql/schema/02_add_indexes.sql

# 导入种子数据
mysql -u root -p$MYSQL_ROOT_PASSWORD < mysql/seeds/00_states.sql
mysql -u root -p$MYSQL_ROOT_PASSWORD < mysql/seeds/01_users.sql
mysql -u root -p$MYSQL_ROOT_PASSWORD < mysql/seeds/02_goals.sql
mysql -u root -p$MYSQL_ROOT_PASSWORD < mysql/seeds/03_projects.sql

echo "数据库初始化完成！" 