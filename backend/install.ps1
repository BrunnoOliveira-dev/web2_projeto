# Script de instalação para Windows - API da Sorveteria
# Execute este script no PowerShell como Administrador

Write-Host "🍦 Configurando API da Sorveteria Delícia no Windows..." -ForegroundColor Cyan

# Verificar se está executando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  Este script precisa ser executado como Administrador!" -ForegroundColor Yellow
    Write-Host "📋 Clique com botão direito no PowerShell e selecione 'Executar como Administrador'" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair..."
    exit 1
}

# Verificar se Chocolatey está instalado
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # Atualizar PATH
    $env:PATH = [Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH","User")
}

# Verificar se Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "📥 Instalando Node.js..." -ForegroundColor Yellow
    
    # Tentar instalar via Chocolatey
    try {
        choco install nodejs -y
        Write-Host "✅ Node.js instalado via Chocolatey!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Erro ao instalar via Chocolatey" -ForegroundColor Red
        Write-Host "📋 Instalação manual necessária:" -ForegroundColor Yellow
        Write-Host "   1. Visite: https://nodejs.org/" -ForegroundColor White
        Write-Host "   2. Baixe e execute o instalador .msi" -ForegroundColor White
        Write-Host "   3. Execute este script novamente" -ForegroundColor White
        Read-Host "Pressione Enter para sair..."
        exit 1
    }
    
    # Atualizar PATH
    $env:PATH = [Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH","User")
}

# Verificar versão do Node.js
$nodeVersion = node --version
Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green

# Verificar se MySQL está instalado
if (!(Get-Command mysql -ErrorAction SilentlyContinue)) {
    Write-Host "❌ MySQL não encontrado!" -ForegroundColor Red
    Write-Host "📥 Instalando MySQL..." -ForegroundColor Yellow
    
    try {
        choco install mysql -y
        Write-Host "✅ MySQL instalado via Chocolatey!" -ForegroundColor Green
        Write-Host "⚙️  Configurando MySQL..." -ForegroundColor Yellow
        Write-Host "📋 Próximos passos para MySQL:" -ForegroundColor Yellow
        Write-Host "   1. Inicie o serviço MySQL no Services.msc" -ForegroundColor White
        Write-Host "   2. Configure a senha do root" -ForegroundColor White
        Write-Host "   3. Execute: mysql -u root -p < banco.sql" -ForegroundColor White
    }
    catch {
        Write-Host "❌ Erro ao instalar MySQL via Chocolatey" -ForegroundColor Red
        Write-Host "📋 Instalação manual necessária:" -ForegroundColor Yellow
        Write-Host "   1. Visite: https://dev.mysql.com/downloads/installer/" -ForegroundColor White
        Write-Host "   2. Baixe o MySQL Installer" -ForegroundColor White
        Write-Host "   3. Execute o instalador e siga as instruções" -ForegroundColor White
    }
}

# Instalar dependências do projeto
Write-Host "📦 Instalando dependências do projeto..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    npm install
    Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo package.json não encontrado!" -ForegroundColor Red
    Write-Host "📋 Certifique-se de estar na pasta backend/" -ForegroundColor Yellow
}

# Verificar se o arquivo .env existe
if (!(Test-Path ".env")) {
    Write-Host "⚙️  Criando arquivo .env..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Arquivo .env.example não encontrado" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Instalação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Configure o arquivo .env com suas credenciais do MySQL" -ForegroundColor White
Write-Host "   2. Execute o script banco.sql no seu MySQL" -ForegroundColor White
Write-Host "   3. Inicie o servidor com: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Para testar: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Comandos úteis no Windows:" -ForegroundColor Yellow
Write-Host "   - Iniciar MySQL: net start mysql" -ForegroundColor White
Write-Host "   - Parar MySQL: net stop mysql" -ForegroundColor White
Write-Host "   - Status dos serviços: services.msc" -ForegroundColor White

Read-Host "Pressione Enter para finalizar..."