@echo off
REM Script de instalação para Windows - API da Sorveteria
REM Execute este script como Administrador

echo 🍦 Configurando API da Sorveteria Delícia no Windows...
echo.

REM Verificar se está executando como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Este script precisa ser executado como Administrador!
    echo 📋 Clique com botão direito e selecione "Executar como Administrador"
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instalando Node.js...
    
    REM Verificar se winget está disponível
    winget --version >nul 2>&1
    if %errorLevel% equ 0 (
        echo 📦 Instalando via winget...
        winget install OpenJS.NodeJS
    ) else (
        REM Verificar se chocolatey está disponível
        choco --version >nul 2>&1
        if %errorLevel% equ 0 (
            echo 📦 Instalando via chocolatey...
            choco install nodejs -y
        ) else (
            echo ❌ Winget e Chocolatey não encontrados!
            echo 📋 Instalação manual necessária:
            echo    1. Visite: https://nodejs.org/
            echo    2. Baixe o instalador .msi
            echo    3. Execute o instalador
            echo    4. Execute este script novamente
            pause
            exit /b 1
        )
    )
    
    REM Atualizar PATH (requer reinício do prompt)
    echo ⚠️  Reinicie o prompt de comando e execute o script novamente
    pause
    exit /b 0
)

REM Verificar versão do Node.js
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js instalado: %NODE_VERSION%

REM Verificar se MySQL está instalado
mysql --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ MySQL não encontrado!
    echo 📋 Instruções para instalar MySQL:
    echo    Opção 1 - winget: winget install Oracle.MySQL
    echo    Opção 2 - chocolatey: choco install mysql
    echo    Opção 3 - Manual: https://dev.mysql.com/downloads/installer/
    echo.
    echo ⚙️  Após instalar o MySQL:
    echo    1. Inicie o serviço MySQL no Services.msc
    echo    2. Configure a senha do root
    echo    3. Execute: mysql -u root -p ^< banco.sql
    echo.
)

REM Instalar dependências do projeto
echo 📦 Instalando dependências do projeto...
if exist "package.json" (
    npm install
    if %errorLevel% equ 0 (
        echo ✅ Dependências instaladas!
    ) else (
        echo ❌ Erro ao instalar dependências
    )
) else (
    echo ❌ Arquivo package.json não encontrado!
    echo 📋 Certifique-se de estar na pasta backend/
)

REM Verificar se o arquivo .env existe
if not exist ".env" (
    echo ⚙️  Criando arquivo .env...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ Arquivo .env criado!
    ) else (
        echo ❌ Arquivo .env.example não encontrado
    )
)

echo.
echo 🎉 Instalação concluída!
echo.
echo 📋 Próximos passos:
echo    1. Configure o arquivo .env com suas credenciais do MySQL
echo    2. Execute o script banco.sql no seu MySQL
echo    3. Inicie o servidor com: npm run dev
echo.
echo 🔍 Para testar: http://localhost:3000
echo.
echo 💡 Comandos úteis no Windows:
echo    - Iniciar MySQL: net start mysql
echo    - Parar MySQL: net stop mysql
echo    - Status dos serviços: services.msc
echo.

pause