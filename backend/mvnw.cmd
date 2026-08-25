@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@ECHO OFF
@SETLOCAL EnableExtensions EnableDelayedExpansion

@REM Ensure System32 is in PATH for findstr, powershell, etc.
IF NOT DEFINED SystemRoot SET "SystemRoot=C:\Windows"
SET "PATH=%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;%PATH%"

SET "BASE_DIR=%~dp0"
IF "%BASE_DIR:~-1%"=="\" SET "BASE_DIR=%BASE_DIR:~0,-1%"

SET "WRAPPER_DIR=%BASE_DIR%\.mvn\wrapper"
SET "WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar"
SET "WRAPPER_PROPS=%WRAPPER_DIR%\maven-wrapper.properties"

IF NOT EXIST "%WRAPPER_DIR%" (
    MKDIR "%WRAPPER_DIR%"
)

@REM Distribution configuration
SET "MAVEN_VERSION=3.9.6"
SET "MAVEN_DIST_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%-bin"
SET "MAVEN_HOME="

@REM Check if maven is already extracted in user profile dists
IF EXIST "%MAVEN_DIST_DIR%" (
    FOR /D %%D IN ("%MAVEN_DIST_DIR%\*") DO (
        IF EXIST "%%D\bin\mvn.cmd" (
            SET "MAVEN_HOME=%%D"
        )
    )
)

@REM If Maven home is found, execute mvn.cmd directly
IF DEFINED MAVEN_HOME (
    IF EXIST "!MAVEN_HOME!\bin\mvn.cmd" (
        "!MAVEN_HOME!\bin\mvn.cmd" %*
        EXIT /B !ERRORLEVEL!
    )
)

@REM Download and extract Apache Maven distribution if not present
ECHO [mvnw] Apache Maven %MAVEN_VERSION% is being prepared...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference = 'Stop'; " ^
  "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; " ^
  "$zipUrl = 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip'; " ^
  "$distDir = Join-Path $env:USERPROFILE '.m2\wrapper\dists\apache-maven-3.9.6-bin'; " ^
  "$targetDir = Join-Path $distDir 'apache-maven-3.9.6'; " ^
  "$zipFile = Join-Path $distDir 'apache-maven-3.9.6-bin.zip'; " ^
  "if (!(Test-Path $distDir)) { New-Item -ItemType Directory -Path $distDir -Force | Out-Null }; " ^
  "if (!(Test-Path (Join-Path $targetDir 'bin\mvn.cmd'))) { " ^
  "    Write-Host '[mvnw] Downloading Apache Maven 3.9.6...'; " ^
  "    (New-Object Net.WebClient).DownloadFile($zipUrl, $zipFile); " ^
  "    Write-Host '[mvnw] Extracting Maven...'; " ^
  "    Add-Type -AssemblyName System.IO.Compression.FileSystem; " ^
  "    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $distDir); " ^
  "    if (Test-Path $zipFile) { Remove-Item $zipFile -Force }; " ^
  "    Write-Host '[mvnw] Maven 3.9.6 ready.'; " ^
  "}"

@REM Also download the valid executable Maven Wrapper JAR with MavenWrapperMain for compatibility
IF NOT EXIST "%WRAPPER_JAR%" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "$ErrorActionPreference = 'SilentlyContinue'; " ^
      "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; " ^
      "$jarUrl = 'https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar'; " ^
      "(New-Object Net.WebClient).DownloadFile($jarUrl, '%WRAPPER_JAR%')"
)

@REM Search for extracted maven home
IF EXIST "%MAVEN_DIST_DIR%" (
    FOR /D %%D IN ("%MAVEN_DIST_DIR%\*") DO (
        IF EXIST "%%D\bin\mvn.cmd" (
            SET "MAVEN_HOME=%%D"
        )
    )
)

IF DEFINED MAVEN_HOME (
    IF EXIST "!MAVEN_HOME!\bin\mvn.cmd" (
        "!MAVEN_HOME!\bin\mvn.cmd" %*
        EXIT /B !ERRORLEVEL!
    )
)

@REM Fallback using wrapper jar with classpath
IF EXIST "%WRAPPER_JAR%" (
    java -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%BASE_DIR%" org.apache.maven.wrapper.MavenWrapperMain %*
    EXIT /B !ERRORLEVEL!
)

ECHO [mvnw] Error: Unable to start Maven.
EXIT /B 1
