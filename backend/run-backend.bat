@ECHO OFF
SETLOCAL EnableExtensions

SET "PATH=C:\Windows\System32;C:\Windows\System32\WindowsPowerShell\v1.0;%PATH%"

cd /d "%~dp0"
call mvnw.cmd clean spring-boot:run
PAUSE
