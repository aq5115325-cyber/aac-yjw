@echo off
chcp 65001 >nul
setlocal

echo ==========================================
echo  健身跟练项目 - GitHub 推送脚本
echo ==========================================
echo.

REM 检查 token 参数
if "%~1"=="" (
  echo [错误] 请提供 GitHub Personal Access Token
  echo.
  echo 用法: push-to-github.bat YOUR_TOKEN
  echo.
  echo 获取 token:
  echo   1. 打开 https://github.com/settings/tokens
  echo   2. Generate new token (classic)
  echo   3. 勾选 repo 权限
  echo   4. 复制生成的 token
  echo.
  pause
  exit /b 1
)

set "TOKEN=%~1"
set "REPO_URL=https://aq5115325-cyber:aac-yjw@github.com/aq5115325-cyber/aac-yjw.git"

echo [1/5] 切换到项目目录...
cd /d "E:\cc\re\project-014-fitness-website"
if errorlevel 1 (
  echo [错误] 项目目录不存在
  pause
  exit /b 1
)

echo [2/5] 配置 git 用户...
git config user.name "fitness-bot"
git config user.email "fitness@local"

echo [3/5] 配置带 token 的 remote...
git remote remove origin 2>nul
git remote add origin "https://aq5115325-cyber:%TOKEN%@github.com/aq5115325-cyber/aac-yjw.git"
if errorlevel 1 (
  echo [错误] 配置 remote 失败
  pause
  exit /b 1
)

echo [4/5] 推送到 GitHub...
git push -u origin main
if errorlevel 1 (
  echo.
  echo [错误] 推送失败
  echo 请检查:
  echo   1. Token 是否有效
  echo   2. 仓库 https://github.com/aq5115325-cyber/aac-yjw 是否已创建
  echo   3. Token 是否勾选了 repo 权限
  pause
  exit /b 1
)

echo.
echo [5/5] 清理 token 痕迹...
git remote set-url origin "https://github.com/aq5115325-cyber/aac-yjw.git"

echo.
echo ==========================================
echo  推送成功！
echo  仓库地址: https://github.com/aq5115325-cyber/aac-yjw
echo  下一步: 打开 https://vercel.com 部署
echo ==========================================
echo.
pause
