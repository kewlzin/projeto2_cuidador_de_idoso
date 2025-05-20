# CuidarBem - Backend

## Sobre o Projeto
API REST para a plataforma CuidarBem, fornecendo endpoints para gerenciamento de usuários, agendamentos e perfis de profissionais de saúde.

## Tecnologias Utilizadas
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT para autenticação
- Bcrypt para criptografia
- Jest para testes

## Pré-requisitos
- Node.js (versão 16 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências
```bash
cd backend
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cuidarbem"
JWT_SECRET="seu_jwt_secret"
PORT=3000
```

4. Execute as migrações do banco de dados
```bash
npx prisma migrate dev
```

5. Inicie o projeto
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto
```
backend/
├── src/
│   ├── controllers/    # Controladores das rotas
│   ├── middlewares/    # Middlewares da aplicação
│   ├── models/        # Modelos do Prisma
│   ├── routes/        # Definição das rotas
│   ├── services/      # Lógica de negócios
│   ├── utils/         # Funções utilitárias
│   └── app.ts         # Configuração do Express
├── prisma/            # Schema e migrações do Prisma
└── tests/             # Testes automatizados
```

## Endpoints Principais

### Autenticação
- POST `/api/users/register` - Registro de usuário
- POST `/api/users/login` - Login de usuário
- GET `/api/users/profile` - Obter perfil do usuário

### Agendamentos
- POST `/api/appointments` - Criar agendamento
- GET `/api/appointments` - Listar agendamentos
- PUT `/api/appointments/:id` - Atualizar agendamento
- DELETE `/api/appointments/:id` - Cancelar agendamento

### Profissionais
- GET `/api/professionals` - Listar profissionais
- GET `/api/professionals/:id` - Obter detalhes do profissional
- PUT `/api/professionals/:id` - Atualizar perfil profissional

## Scripts Disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto
- `npm start` - Inicia o servidor em produção
- `npm run test` - Executa os testes
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:migrate` - Executa as migrações do banco

## Banco de Dados
O projeto utiliza PostgreSQL como banco de dados principal. O schema é gerenciado pelo Prisma ORM e pode ser encontrado em `prisma/schema.prisma`.

## Segurança
- Autenticação via JWT
- Senhas criptografadas com bcrypt
- Validação de dados com Zod
- Proteção contra ataques comuns (helmet)
- Rate limiting para prevenir abusos

## Contribuição
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença
Este projeto está sob a licença MIT. 