## 🚀 Como Executar no VS Code

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior) instalado.

### Passo 1: Abrir o projeto no VS Code
1. Extraia este arquivo `.zip`.
2. Abra a pasta `cifra-de-cesar-pirata` no **VS Code** (`Arquivo > Abrir Pasta`).

### Passo 2: Iniciar o Backend (Terminal 1)
Abra o terminal integrado no VS Code (`Ctrl + '` ou `Terminal > Novo Terminal`) e execute:
```bash
cd backend
npm install
npm start
```
Você verá a mensagem: `Backend rodando em http://localhost:3001` (o arquivo do banco `database.sqlite` será criado automaticamente).

### Passo 3: Iniciar o Frontend (Terminal 2)
Clique no ícone **`+`** no painel do terminal do VS Code para abrir um segundo terminal e execute:
```bash
cd frontend
npm install
npm run dev
```
Acesse o link exibido no terminal (geralmente `http://localhost:5173`).

---

## 🧪 Fluxo Sugerido para Teste
1. Acesse **Alistar-se** (Cadastro) e crie um usuário e senha.
2. Faça **Login** (o token JWT será armazenado e enviado automaticamente no cabeçalho `Authorization`).
3. Em **Trancar no Baú** (Criptografar), digite uma mensagem e um passo (ex: `3` ou `-5`) e clique para criptografar.
4. Assista à animação e copie a **Mensagem Criptografada** e o **Hash** usando os botões de copiar.
5. Vá em **Abrir Baú** (Descriptografar), cole a mensagem e o hash para revelar o texto original.
6. Tente descriptografar novamente com o **mesmo hash** para confirmar o bloqueio de uso único.
