# ListaMercado — Guia Completo de Instalação

Este documento descreve como instalar e executar o projeto **ListaMercado** localmente e no **EasyPanel**.

## 1) Visão geral do projeto

- **Frontend:** React + Vite (`/frontend`)
- **Backend:** Node.js + Express + SQLite (`/backend`)
- **Deploy recomendado:** Docker Compose (arquivo `docker-compose.yml` na raiz)

## 2) Pré-requisitos

### Para ambiente local (sem Docker)

- Node.js **22+**
- npm **10+**

### Para ambiente com Docker / EasyPanel

- Docker
- Docker Compose
- EasyPanel (se for deploy via painel)

## 3) Instalação local (desenvolvimento)

### 3.1 Instalar dependências

```bash
cd /home/runner/work/listamercado/listamercado/davidmaiky/listamercado/backend
npm install

cd /home/runner/work/listamercado/listamercado/davidmaiky/listamercado/frontend
npm install
```

### 3.2 Iniciar backend

```bash
cd /home/runner/work/listamercado/listamercado/davidmaiky/listamercado/backend
node server.js
```

Backend padrão:
- URL: `http://localhost:3000`
- Health simples: `GET /` retorna `Market List API is running`

### 3.3 Iniciar frontend

```bash
cd /home/runner/work/listamercado/listamercado/davidmaiky/listamercado/frontend
npm run dev
```

Frontend padrão:
- URL: `http://localhost:5173`
- O Vite faz proxy de `/api` para `http://localhost:3000`

## 4) Variáveis de ambiente

### Backend

- `PORT` (opcional): porta do servidor backend (padrão: `3000`)
- `DB_PATH` (opcional): caminho absoluto do SQLite (padrão: `backend/market.db`)

Exemplo:

```bash
PORT=3001 DB_PATH=/tmp/market.db node server.js
```

### Frontend

- `VITE_API_URL` (opcional): base da API no build/runtime do frontend  
  Se não definido, usa `/api`.

Exemplo:

```bash
VITE_API_URL=https://api.seudominio.com/api npm run build
```

## 5) Deploy com Docker Compose (local ou servidor)

Na raiz do projeto:

```bash
cd /home/runner/work/listamercado/listamercado/davidmaiky/listamercado
docker compose up -d --build
```

Serviços:
- **frontend**: publica na porta `80`
- **backend**: interno na porta `3000`
- **volume persistente**: `backend_data` em `/app/data/market.db`

Parar:

```bash
docker compose down
```

Parar e remover volume (apaga banco):

```bash
docker compose down -v
```

## 6) Instalação no EasyPanel

1. Crie um novo projeto no EasyPanel.
2. Selecione a opção **Docker Compose**.
3. Conecte este repositório Git.
4. Selecione o arquivo `docker-compose.yml` na raiz.
5. Faça o deploy.

Após subir:
- A aplicação web ficará disponível no domínio configurado para o serviço `frontend`.
- O backend ficará privado na rede interna, acessado pelo frontend em `/api`.

## 7) Verificação pós-instalação

### Frontend
- Abra o domínio/URL do frontend e confirme o carregamento da interface.

### Backend
- Verifique: `GET /` deve retornar `Market List API is running`.
- Verifique se há criação/atualização de itens e categorias via interface.

### Banco de dados
- Confirme persistência reiniciando containers e verificando se os dados permanecem.

## 8) Comandos úteis de manutenção

### Frontend

```bash
cd /home/runner/work/listamercado/listamercado/davidmaiky/listamercado/frontend
npm run lint
npm run build
```

### Backend

```bash
cd /home/runner/work/listamercado/listamercado/davidmaiky/listamercado/backend
npm test
```

> Observação: atualmente o script de teste do backend é um placeholder e retorna erro por padrão (`Error: no test specified`).

## 9) Troubleshooting rápido

- **Frontend não acessa API:** confirme backend ativo na porta `3000`.
- **Erro de CORS em ambiente local:** garanta que o frontend esteja rodando com proxy (`npm run dev`) ou configure `VITE_API_URL`.
- **Dados não persistem em Docker:** verifique se o volume `backend_data` está criado e montado.
- **Porta 80 ocupada:** altere o mapeamento no `docker-compose.yml` (ex.: `"8080:80"`).
