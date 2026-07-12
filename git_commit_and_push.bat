@echo off
echo ===================================================
echo  FIFA Nexus AI — Committing and Pushing Changes
echo ===================================================
echo.

echo [1/3] Adding files to git index...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] git add failed.
    pause
    exit /b %errorlevel%
)

echo [2/3] Committing changes...
git commit -m "Refactor and optimize smart stadium OS: add CSP headers, input sanitization, accessibility standards, and security tests"
if %errorlevel% neq 0 (
    echo [ERROR] git commit failed. (Maybe no changes to commit?)
    pause
    exit /b %errorlevel%
)

echo [3/3] Pushing changes to GitHub remote...
git push
if %errorlevel% neq 0 (
    echo [ERROR] git push failed. If this is a new branch, run 'git push --set-upstream origin main'
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo  SUCCESS: All changes committed and pushed to GitHub!
echo ===================================================
pause
