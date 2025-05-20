# CuidarBem - Frontend

## Sobre o Projeto
CuidarBem é uma plataforma que conecta cuidadores de idosos, profissionais de saúde e famílias, facilitando o cuidado domiciliar personalizado.

## Tecnologias Utilizadas
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Sonner (notificações)

## Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências
```bash
cd frontend
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto frontend com as seguintes variáveis:
```env
VITE_API_URL=http://localhost:3000
```

4. Inicie o projeto
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto
```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Contextos do React
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços e APIs
│   ├── types/         # Definições de tipos TypeScript
│   └── utils/         # Funções utilitárias
```

## Funcionalidades Principais
- Autenticação de usuários (login/registro)
- Dashboard personalizado por tipo de usuário
- Agendamento de consultas
- Perfil de usuário
- Busca de profissionais
- Sistema de notificações

## Tipos de Usuários
- Responsável por Idoso
- Cuidador/Enfermeiro
- Médico

## Scripts Disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes

## Contribuição
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença
Este projeto está sob a licença MIT.