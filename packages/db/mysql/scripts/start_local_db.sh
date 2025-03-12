#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)

echo -e "${YELLOW}启动本地开发数据库...${NC}"

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}错误: Docker 未运行，请先启动 Docker${NC}"
  exit 1
fi

# 检查容器是否已存在
if docker ps -a | grep -q life_tracker_mysql; then
  # 检查容器是否已运行
  if docker ps | grep -q life_tracker_mysql; then
    echo -e "${GREEN}MySQL 容器已经在运行${NC}"
  else
    echo -e "${YELLOW}启动已存在的 MySQL 容器...${NC}"
    docker start life_tracker_mysql
    
    # 等待容器启动
    echo -e "${YELLOW}等待 MySQL 服务启动...${NC}"
    sleep 5
    
    # 检查健康状态
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' life_tracker_mysql)
    if [ "$HEALTH" = "healthy" ]; then
      echo -e "${GREEN}MySQL 容器已成功启动并且健康${NC}"
    else
      echo -e "${YELLOW}MySQL 容器已启动，但健康检查尚未通过，可能需要等待几秒钟...${NC}"
    fi
  fi
else
  # 首次启动，使用 docker-compose
  echo -e "${YELLOW}首次启动 MySQL 容器...${NC}"
  cd "$PROJECT_ROOT" && docker-compose up -d db
  
  # 等待容器启动并初始化
  echo -e "${YELLOW}等待 MySQL 服务启动和初始化...${NC}"
  echo -e "${YELLOW}这可能需要一些时间，特别是首次启动时...${NC}"
  
  # 等待健康检查通过
  attempt=1
  max_attempts=30
  
  while [ $attempt -le $max_attempts ]; do
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' life_tracker_mysql 2>/dev/null || echo "container_not_found")
    
    if [ "$HEALTH" = "healthy" ]; then
      echo -e "${GREEN}MySQL 容器已成功启动并且健康${NC}"
      break
    fi
    
    echo -e "${YELLOW}等待 MySQL 准备就绪... 尝试 $attempt/$max_attempts${NC}"
    sleep 2
    ((attempt++))
  done
  
  if [ $attempt -gt $max_attempts ]; then
    echo -e "${RED}MySQL 容器启动超时，请检查日志:${NC}"
    docker logs life_tracker_mysql
    exit 1
  fi
fi

echo -e "${GREEN}MySQL 数据库已准备就绪!${NC}"