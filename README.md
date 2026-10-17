# Home Care Flow — Tecnologia e cuidado em harmonia

Projeto Final — Aranduê / Recode Pro AI
Stack: **MySQL + Node.js (Express) + ReactJS (Vite)**

## 1. Proposta

**Problema:** a gestão de equipes de cuidado domiciliar ainda é manual. O ponto é anotado em papel, o que abre espaço para fraudes e perdas. As anotações de cada plantão ficam ilegíveis e sem padrão. O pagamento dos profissionais é combinado pelo WhatsApp, sem registro das horas realmente trabalhadas.

**ODS principal — ODS 8 (Trabalho Decente e Crescimento Econômico):** o sistema formaliza a jornada dos técnicos e cuidadores. O check-in e o check-out são registrados com GPS ou QR Code, e o pagamento é calculado sobre as horas reais (horas × valor/hora), com status pendente/pago rastreável.
**ODS complementar — ODS 10 (Redução das Desigualdades):** dá transparência e previsibilidade de renda a uma categoria majoritariamente informal.

**Público-alvo:** técnicos de enfermagem e cuidadores (adultos), gestores e pequenas agências de cuidado domiciliar.

**Impacto esperado:**
- fim das fraudes e perdas de ponto;
- pagamento justo e auditável;
- histórico de atendimento padronizado;
- profissionalização do setor.

> **Sobre o tema:** o edital restringe projetos de saúde; este tema foi **autorizado pelos gestores do curso**. O foco da solução é a **gestão do trabalho** dos profissionais (escalas, jornada, pagamento), e não diagnóstico ou tratamento. Pacientes cadastrados devem ter 18 anos ou mais.

## 2. Como rodar

Pré-requisitos: Node.js 18+ e MySQL 8 rodando.

### 1) Backend + banco
```bash
cd backend
cp .env.example .env      # preencha DB_PASSWORD e JWT_SECRET
npm install
npm run db:setup          # cria o banco homecare_flow e popula com dados de exemplo
npm run dev               # API em http://localhost:5000
```
> `db:setup` **apaga e recria** o banco `homecare_flow`. Use-o sempre que quiser voltar aos dados de demonstração.
> Alternativa manual: `mysql -u root -p < ../database/schema.sql` e depois `seed.sql`.

### 2) Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:3000
```
Para apontar para outra API, crie `frontend/.env` com `VITE_API_URL=http://.../api`.

### Usuários de teste (senha `123456`)
| Perfil | E-mail | O que vê |
|---|---|---|
| Admin | admin@homecareflow.com | tudo, incluindo financeiro |
| Gestor | carlos@homecareflow.com | tudo, incluindo financeiro |
| Técnica | juliana@homecareflow.com | só as próprias escalas e plantões |
| Técnico | pedro@homecareflow.com | idem |

Código de QR das residências no seed: `QR-PAC-0001`, `QR-PAC-0002` e `QR-PAC-0003`.

## 3. Arquitetura

```
React (pages → components → services/axios)
   ↓ HTTP + JWT (Authorization: Bearer)
Express (routes → middlewares → controllers → models)
   ↓ SQL parametrizado (mysql2, transações)
MySQL (7 tabelas relacionais)
```
Detalhes do modelo de dados e regras: [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## 4. Módulos

| Módulo | API | Tela | Operações |
|---|---|---|---|
| **Escalas** | `/api/escalas` | Escalas | **CRUD completo** + filtros (status/data) + conflito de turno |
| **Pacientes** | `/api/pacientes` | Pacientes | **CRUD completo** (exclusão lógica) + busca |
| **Profissionais** | `/api/profissionais` | Cuidadores | **CRUD completo**, e o cadastro já cria o login do técnico |
| Plantões | `/api/plantoes` | Plantões | check-in GPS ou QR Code, check-out, histórico |
| Prontuário | `/api/prontuarios` | Prontuários | registrar e consultar o histórico do paciente |
| Financeiro | `/api/pagamentos` | Relatórios | fechamento mensal, marcar como pago, exportar CSV |
| Autenticação | `/api/auth` | Login | login, `/me`, cadastro (somente admin) |

### Permissões
- **admin/gestor:** criam, editam e excluem escalas, pacientes e profissionais, e acessam o financeiro.
- **técnico:** lê os cadastros e vê apenas as próprias escalas e plantões. Faz check-in e check-out e registra prontuário só dos plantões dele. As regras valem na API, e não só na tela.

## 5. Roteiro sugerido para a apresentação
1. Entre como **admin** e mostre a Visão Geral (cards, agenda de hoje, escalas por status).
2. Faça o **CRUD de Escalas** inteiro pela tela: criar, editar, filtrar e excluir. Tente criar uma escala duplicada para mostrar a validação de conflito.
3. Em Pacientes e Cuidadores, cadastre um profissional novo.
4. Saia e entre como **juliana** (técnica). O menu fica sem o financeiro, e ela vê só as escalas dela.
5. Em Plantões, faça o check-in por QR Code (`QR-PAC-0001`), registre o prontuário e depois faça o check-out.
6. Volte como admin. Em Relatórios, mostre o fechamento do mês, marque um pagamento como pago e exporte o CSV.

## 6. Roadmap de evolução
1. Leitura do QR Code pela câmera (ex.: `html5-qrcode`) e validação de raio GPS até a residência.
2. Gráfico de horas por mês no dashboard (Recharts).
3. Exportação do relatório em PDF.
4. Troca de senha e recuperação de acesso.
5. Testes automatizados da API (Jest + Supertest).
6. Deploy (ex.: Railway/Render para a API e o MySQL, Vercel para o front).

## 7. Pontos de atenção
- Dados de prontuário são sensíveis (LGPD). Mantenha o JWT, nunca suba o `.env` e use apenas dados fictícios na apresentação.
- Exclusões de pacientes e profissionais são **lógicas** (`ativo = FALSE`), para preservar o histórico de plantões e pagamentos.
