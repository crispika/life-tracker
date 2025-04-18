#!/bin/bash
set -e

echo "=== 设置Docker容器执行环境的字符集 ==="

# 设置环境变量
export LANG=C.UTF-8
export LC_ALL=C.UTF-8
export LANGUAGE=C.UTF-8

# 显示当前环境字符集
echo "当前环境字符集设置:"
echo "LANG=$LANG"
echo "LC_ALL=$LC_ALL"
echo "LANGUAGE=$LANGUAGE"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
  echo -e "${GREEN}[INFO] $(date '+%Y-%m-%d %H:%M:%S') - $1${NC}"
}

log_warn() {
  echo -e "${YELLOW}[WARN] $(date '+%Y-%m-%d %H:%M:%S') - $1${NC}"
}

log_error() {
  echo -e "${RED}[ERROR] $(date '+%Y-%m-%d %H:%M:%S') - $1${NC}" >&2
}

# 执行SQL文件的函数
execute_sql() {
  local file=$1
  local description=$2
  
  log_info "开始执行: $description ($file)"
  
  if [ ! -f "$file" ]; then
    log_error "文件不存在: $file"
    return 1
  fi
  
  # 显示SQL文件的前几行和后几行
  log_info "SQL文件内容预览 ($file):"
  echo "----------------------------------------"
  head -n 5 "$file"
  echo "... [文件内容省略] ..."
  tail -n 5 "$file"
  echo "----------------------------------------"
  
  # 执行SQL文件并捕获输出
  local output
  output=$(mysql -u root -p$MYSQL_ROOT_PASSWORD 2>&1 < "$file")
  local status=$?
  
  if [ $status -eq 0 ]; then
    log_info "成功执行: $description"
    if [ ! -z "$output" ]; then
      log_info "输出: $output"
    fi
    return 0
  else
    log_error "执行失败: $description"
    log_error "错误信息: $output"
    return 1
  fi
}

# 检查目录是否存在
check_directory() {
  local dir=$1
  if [ ! -d "$dir" ]; then
    log_error "目录不存在: $dir"
    return 1
  else
    log_info "目录存在: $dir"
    log_info "目录内容:"
    ls -la "$dir"
    return 0
  fi
}

# 主执行流程
log_info "===== 开始数据库初始化过程 ====="

log_info "等待 MySQL 启动..."
until mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD --silent; do
  sleep 1
done
log_info "MySQL 已启动"

# 设置工作目录
cd /docker-entrypoint-initdb.d
log_info "当前工作目录: $(pwd)"

# 检查目录结构
log_info "检查目录结构"
check_directory "/docker-entrypoint-initdb.d" || exit 1
check_directory "/docker-entrypoint-initdb.d/schema" || exit 1
check_directory "/docker-entrypoint-initdb.d/seeds" || exit 1

# 执行数据库初始化脚本
log_info "开始执行数据库初始化脚本"

# 创建数据库
log_info "确保数据库存在"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE IF NOT EXISTS life_tracker;" || {
  log_error "创建数据库失败"
  exit 1
}

# 使用数据库
log_info "选择数据库"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "USE life_tracker;" || {
  log_error "选择数据库失败"
  exit 1
}

# 执行schema脚本
execute_sql "./schema/01_tables.sql" "创建表结构" || log_error "创建表结构失败，但继续执行"
execute_sql "./schema/04_stored_procedures.sql" "创建存储过程" || log_error "创建存储过程失败，但继续执行"
execute_sql "./schema/03_add_triggers.sql" "创建触发器" || log_error "创建触发器失败，但继续执行"
execute_sql "./schema/02_add_indexes.sql" "创建索引" || log_error "创建索引失败，但继续执行"
execute_sql "./schema/05_views.sql" "创建视图" || log_error "创建视图失败，但继续执行"

# 导入种子数据
log_info "开始导入种子数据"
execute_sql "./seeds/00_states.sql" "导入状态数据" || log_error "导入状态数据失败，但继续执行"
execute_sql "./seeds/01_users.sql" "导入用户数据" || log_error "导入用户数据失败，但继续执行"
execute_sql "./seeds/02_goals.sql" "导入目标数据" || log_error "导入目标数据失败，但继续执行"
execute_sql "./seeds/03_tasks.sql" "导入任务数据" || log_error "导入任务数据失败，但继续执行"
execute_sql "./seeds/04_worklogs.sql" "导入工作日志数据" || log_error "导入工作日志数据失败，但继续执行"
# 验证数据库结构
log_info "验证数据库结构"
echo "数据库表:"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "USE life_tracker; SHOW TABLES;"

# 验证触发器
log_info "验证触发器"
echo "触发器列表:"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "USE life_tracker; SHOW TRIGGERS;"

# 验证存储过程
log_info "验证存储过程"
echo "存储过程列表:"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "USE life_tracker; SHOW PROCEDURE STATUS WHERE Db = 'life_tracker';"

# 验证种子数据
log_info "验证种子数据"
echo "表数据统计:"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "USE life_tracker; SELECT 'USER' as Table_Name, COUNT(*) as Row_Count FROM USER UNION SELECT 'GOAL_STATE', COUNT(*) FROM GOAL_STATE UNION SELECT 'UC_GOAL', COUNT(*) FROM UC_GOAL UNION SELECT 'UC_TASK', COUNT(*) FROM UC_TASK;"

log_info "===== 数据库初始化完成！ =====" 