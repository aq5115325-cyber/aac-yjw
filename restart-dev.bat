@echo off
chcp 65001 >nul
setlocal

echo ==========================================
echo  健身跟练项目 - 清理并重启 dev server
echo ==========================================
echo.
echo 警告：此脚本会强制结束所有 node.exe 和 python.exe 进程，
echo       包括其他项目正在运行的 Node/Python 程序。
echo.
echo 按任意键继续，或按 Ctrl+C 取消。
pause >nul

echo.
echo [1/3] 关闭所有 Node.js 进程（旧的 dev server / build）...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
  echo      已关闭 node.exe
) else (
  echo      没有运行中的 node.exe
)

echo.
echo [2/3] 关闭所有 Python 进程（旧的预览服务器 http.server）...
taskkill /F /IM python.exe 2>nul
if %errorlevel% == 0 (
  echo      已关闭 python.exe
) else (
  echo      没有运行中的 python.exe
)

echo.
echo [3/3] 启动全新的 dev server...
cd /d "E:\cc\re\project-014-fitness-website"
npm run dev

echo.
echo 如果浏览器没有自动打开，请手动访问 http://localhost:5173/plan/new
pause
