#!/bin/bash

# Script de instalação da API da Sorveteria
echo "🍦 Configurando API da Sorveteria Delícia..."

# Detectar sistema operacional
detect_os() {
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        echo "windows"
    elif [[ -f /etc/fedora-release ]]; then
        echo "fedora"
    elif [[ -f /etc/redhat-release ]]; then
        echo "rhel"
    elif [[ -f /etc/debian_version ]]; then
        echo "debian"
    elif [[ -f /etc/arch-release ]]; then
        echo "arch"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)
echo "🖥️  Sistema detectado: $OS"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "📥 Instalando Node.js..."
    
    case $OS in
        "debian"|"ubuntu")
            echo "📦 Instalando Node.js no Ubuntu/Debian..."
            sudo apt update
            sudo apt install -y nodejs npm
            ;;
        "fedora")
            echo "📦 Instalando Node.js no Fedora..."
            sudo dnf install -y nodejs npm
            ;;
        "rhel")
            echo "📦 Instalando Node.js no CentOS/RHEL..."
            if command -v dnf &> /dev/null; then
                sudo dnf install -y nodejs npm
            else
                sudo yum install -y nodejs npm
            fi
            ;;
        "arch")
            echo "📦 Instalando Node.js no Arch Linux..."
            sudo pacman -S nodejs npm
            ;;
        "macos")
            echo "📦 Instalando Node.js no macOS..."
            if command -v brew &> /dev/null; then
                brew install node
            else
                echo "❌ Homebrew não encontrado!"
                echo "📋 Instale o Homebrew primeiro: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                echo "📋 Ou instale Node.js manualmente: https://nodejs.org/"
                exit 1
            fi
            ;;
        "windows")
            echo "🪟 Sistema Windows detectado!"
            echo "📋 Para instalar Node.js no Windows:"
            echo "   1. Baixe o instalador: https://nodejs.org/"
            echo "   2. Execute o instalador .msi"
            echo "   3. Ou use chocolatey: choco install nodejs"
            echo "   4. Ou use winget: winget install OpenJS.NodeJS"
            echo ""
            echo "📋 Para instalar MySQL no Windows:"
            echo "   1. Baixe o MySQL Installer: https://dev.mysql.com/downloads/installer/"
            echo "   2. Ou use chocolatey: choco install mysql"
            echo ""
            echo "⚠️  Após instalar, execute este script novamente no Git Bash ou WSL"
            exit 1
            ;;
        *)
            echo "❌ Sistema operacional não suportado automaticamente."
            echo "📋 Por favor, instale Node.js manualmente:"
            echo "   - Visite: https://nodejs.org/"
            echo "   - Ou use o gerenciador de pacotes do seu sistema"
            echo ""
            echo "💡 Sistemas suportados automaticamente:"
            echo "   - Ubuntu/Debian (apt)"
            echo "   - Fedora (dnf)"
            echo "   - CentOS/RHEL (dnf/yum)"
            echo "   - Arch Linux (pacman)"
            echo "   - macOS (brew)"
            echo "   - Windows (instruções manuais)"
            exit 1
            ;;
    esac
fi

# Verificar versão do Node.js
NODE_VERSION=$(node --version)
echo "✅ Node.js instalado: $NODE_VERSION"

# Verificar se MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL não encontrado!"
    echo "📋 Instruções para instalar MySQL por sistema:"
    
    case $OS in
        "debian"|"ubuntu")
            echo "   Ubuntu/Debian: sudo apt install mysql-server"
            ;;
        "fedora")
            echo "   Fedora: sudo dnf install mysql-server"
            ;;
        "rhel")
            echo "   CentOS/RHEL: sudo dnf install mysql-server"
            echo "   (ou: sudo yum install mysql-server)"
            ;;
        "arch")
            echo "   Arch Linux: sudo pacman -S mysql"
            ;;
        "macos")
            echo "   macOS: brew install mysql"
            ;;
        "windows")
            echo "   Windows: Baixe MySQL Installer de https://dev.mysql.com/downloads/installer/"
            echo "   Ou use: choco install mysql"
            ;;
        *)
            echo "   Visite: https://dev.mysql.com/downloads/"
            ;;
    esac
    
    echo ""
    echo "⚙️  Após instalar o MySQL:"
    if [[ "$OS" == "windows" ]]; then
        echo "   1. Inicie o serviço MySQL no Services.msc"
        echo "   2. Configure a senha do root"
        echo "   3. Execute: mysql -u root -p < banco.sql"
    else
        echo "   1. sudo systemctl start mysql"
        echo "   2. sudo mysql_secure_installation"
        echo "   3. mysql -u root -p < banco.sql"
    fi
fi

# Instalar dependências do projeto
echo "📦 Instalando dependências..."
npm install

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚙️  Criando arquivo .env..."
    cp .env.example .env 2>/dev/null || echo "❌ Arquivo .env.example não encontrado"
fi

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure o arquivo .env com suas credenciais do MySQL"
echo "   2. Execute o script banco.sql no seu MySQL"
echo "   3. Inicie o servidor com: npm run dev"
echo ""
echo "🔍 Para testar: http://localhost:3000"