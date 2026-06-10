# ListaMercado - Deploy no EasyPanel

Este repositório está pronto para deploy no EasyPanel usando Docker Compose.

## Estrutura

- `backend`: API Node.js + SQLite
- `frontend`: React + Vite servido por Nginx
- `docker-compose.yml`: orquestração dos serviços para o EasyPanel

## Como instalar no EasyPanel

1. Crie um novo projeto no EasyPanel.
2. Escolha a opção de aplicação com **Docker Compose**.
3. Aponte para este repositório.
4. Use o arquivo `docker-compose.yml` da raiz do projeto.
5. Faça o deploy.

## Serviços

- **frontend**: expõe a porta `80` (aplicação web)
- **backend**: serviço interno na porta `3000`

O frontend encaminha chamadas de `/api/*` para o backend automaticamente.

## Persistência

O banco SQLite fica persistido em volume Docker (`backend_data`) no caminho `/app/data/market.db`.
