@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set MAVEN_CMD=C:\Users\param\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd

if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" %*
) else (
    where mvn >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        call mvn %*
    ) else (
        echo [ERROR] Maven not found. Please ensure Maven is installed or located in your path.
        exit /b 1
    )
)
