@echo off
title PMS Backend (Spring Boot 8080)
echo ===================================================
echo  Starting Project Monitoring System Backend...
echo  Port: 8080
echo ===================================================
cd /d "%~dp0backend"

if exist "mvnw.cmd" (
    echo Using Maven Wrapper (mvnw.cmd)...
    call mvnw.cmd spring-boot:run
) else (
    echo Using system Maven...
    mvn spring-boot:run
)

pause
