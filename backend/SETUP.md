# Configuração Rápida da API

## 🚀 Instalação Automática

### Linux/macOS
Execute o script de instalação:

```bash
cd backend
./install.sh
```

### Windows
Execute um dos scripts de instalação (como Administrador):

**PowerShell:**
```powershell
cd backend
.\install.ps1
```

**Prompt de Comando:**
```cmd
cd backend
install.bat
```

**Git Bash/WSL:**
```bash
cd backend
./install.sh
```

## 📋 Instalação Manual

### 1. Instalar Node.js

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nodejs npm
```

**Fedora:**
```bash
sudo dnf install nodejs npm
```

**CentOS/RHEL:**
```bash
sudo dnf install nodejs npm
# ou para versões mais antigas:
sudo yum install nodejs npm
```

**Windows:**
```cmd
# Via winget (Windows 10+)
winget install OpenJS.NodeJS

# Via chocolatey
choco install nodejs

# Ou baixe manualmente: https://nodejs.org/
```

**macOS:**
```bash
# Via homebrew
brew install node

# Ou baixe manualmente: https://nodejs.org/
```

**Arch Linux:**
```bash
sudo pacman -S nodejs npm
```

### 2. Instalar MySQL

**Ubuntu/Debian:**
```bash
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 3. Configurar Banco de Dados

```bash
mysql -u root -p
```

```sql
CREATE DATABASE sorveteria;
exit
```

```bash
mysql -u root -p sorveteria < banco.sql
```

### 4. Instalar Dependências

```bash
npm install
```

### 5. Configurar Ambiente

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 6. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## ✅ Verificação

Acesse: http://localhost:3000

Deve retornar:
```json
{
  "message": "API da Sorveteria Hipotética está funcionando!",
  "version": "1.0.0"
}
```

## 🐛 Problemas Comuns

### Node.js não encontrado
- Reinstale o Node.js
- Verifique o PATH do sistema

### MySQL não conecta
- Verifique se o serviço está rodando: `sudo systemctl start mysql`
- Confirme usuário e senha no .env
- Teste a conexão: `mysql -u root -p`

### Porta já em uso
- Mude a porta no .env
- Ou mate o processo: `sudo lsof -ti:3000 | xargs kill -9`