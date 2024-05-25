# Back-end Challenge - Dictionary

## Introdução

Este é um teste para demonstrar suas habilidades como Desenvolvedor Back-end. O objetivo do projeto é criar uma API para listar palavras em inglês, utilizando a API Free Dictionary API como base. A aplicação deve permitir o gerenciamento das palavras visualizadas pelo usuário.

## Tecnologias Utilizadas

- NestJS
- TypeORM
- PostgreSQL
- JWT (JSON Web Token) para autenticação
- Configuração de ambiente com `@nestjs/config`

## Casos de Uso

1. **Autenticação:**
   - **Cadastro:** O usuário pode se registrar com nome, email e senha.
   - **Login:** O usuário pode fazer login com email e senha para obter um token JWT.

2. **Palavras do Dicionário:**
   - **Listar Palavras:** Listar palavras do dicionário com paginação e suporte à busca.
   - **Detalhes da Palavra:** Exibir detalhes de uma palavra específica.
   - **Histórico de Visualizações:** Guardar e visualizar o histórico de palavras visualizadas.
   - **Favoritar Palavras:** Guardar e visualizar palavras favoritas.
   - **Remover Favoritas:** Remover palavras da lista de favoritas.

## Instalação

### Pré-requisitos

- Node.js (>= 12.x)
- PostgreSQL

### Passos

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <NOME_DO_REPOSITORIO>
   criar um banco de dados postgres chamado codesh
   criar um arquivo .env na raiz do projeto com essas palavras "JWT_SECRET=Chapeco2022"
   npm install
   npm start
   npm run test
   Abrir o postman http://localhost:3000/auth/signup para começar a testar com essa primeira rota post

