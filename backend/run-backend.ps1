# PowerShell 5.1 Launcher for Java Spring Boot Backend
$ErrorActionPreference = "Stop"

$PSScriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

Write-Host "Starting Java Spring Boot Backend (Clean Build)..." -ForegroundColor Green
& ".\mvnw.cmd" clean spring-boot:run
