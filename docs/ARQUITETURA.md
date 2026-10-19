# Arquitetura e modelo de dados

## Visão geral

```
Navegador (React)  ──HTTP/JSON + token JWT──▶  API (Node/Express)  ──SQL──▶  MySQL
   Vercel                                          Render                       Aiven
```

No meu computador as três partes rodam juntas (`localhost:3000`, `localhost:5000` e o MySQL local).
Na nuvem, cada uma fica num serviço (ver [DEPLOY.md](DEPLOY.md)).

## Backend em camadas

Uma requisição passa por estas etapas, nesta ordem:

1. **routes**: define o caminho e o método (ex.: `PUT /api/escalas/:id`).
2. **middlewares**:
   - `autenticar` confere o token JWT;
   - `somenteGestao` e `permitirTipos` conferem o perfil.
3. **controllers**: validam os dados que chegaram e aplicam as regras de negócio.
4. **models**: fazem as consultas SQL (sempre com `?`, para evitar SQL Injection).
5. **errorHandler**: se algo der errado, devolve `{ "erro": "..." }` com o status HTTP certo.

## Relacionamentos

| Relação | Tipo | Observação |
|---|---|---|
| usuarios → profissionais | 1 : 1 | `profissionais.usuario_id` é único |
| profissionais → escalas | 1 : N | |
| pacientes → escalas | 1 : N | |
| escalas → plantoes | 1 : 1 | `plantoes.escala_id` é único (uma escala gera no máximo um plantão) |
| plantoes → prontuarios | 1 : N | |
| profissionais → pagamentos | 1 : N | único por profissional + mês |
| usuarios → auditoria | 1 : N | quem fez a ação (fica `NULL` se o usuário for apagado) |

## Fluxo principal

1. O gestor cadastra **pacientes** e **profissionais**. O cadastro do profissional também cria o login dele.
2. O gestor monta a **escala** (paciente + profissional + data + turno).
   A API não deixa o mesmo profissional em duas escalas no mesmo dia e turno.
3. No dia da escala, o profissional faz o **check-in**:
   - por **GPS**: grava a latitude e a longitude;
   - ou por **QR Code**: o código precisa ser o da casa daquele paciente. Dá para ler com a câmera do celular.

   No GPS, a API calcula a **distância até a casa** (fórmula de Haversine). Acima de 300 m o check-in
   não é bloqueado, porque o GPS do celular pode errar, mas fica registrado e vira um **alerta** no painel da gestão.

   Isso cria o **plantão**, a escala passa para `em_andamento` e o profissional para `em_plantao`.
   Tudo numa **transação**.
4. Durante o plantão ele registra o **prontuário** (sinais vitais validados por faixa).
5. No **check-out**, o plantão vai para `finalizado`, a escala para `concluido` e o profissional volta a `disponivel`.
6. No fim do mês, o **financeiro** soma os minutos de cada plantão finalizado × valor da hora e grava
   em `pagamentos`. Depois de marcado como pago, o valor não muda mais.

## Regras importantes
- **Exclusão de escala:** só se ainda não tiver plantão. Depois disso, o certo é mudar o status para `cancelado`.
- **Exclusão de paciente e profissional:** é **lógica** (`ativo = FALSE`), para não perder o histórico.
  As escalas futuras deles são canceladas, e o profissional desativado perde o acesso.
- **Técnico** só vê e mexe nas próprias escalas e plantões. A regra está na API, não só na tela.
- **Técnico** só enxerga os pacientes que atende (e o prontuário deles). Não vê a lista da equipe.
- **Check-in, check-out e prontuário** só o próprio técnico registra. A gestão acompanha, mas não
  registra presença "no lugar" de ninguém.
- **Excluir/desativar** paciente ou cuidador e ver a **auditoria** são ações só do admin.

| Middleware | Quem passa | Onde uso |
|---|---|---|
| `autenticar` | qualquer pessoa logada | todas as rotas, menos o login |
| `somenteGestao` | admin e gestor | cadastros, escalas (escrita), financeiro |
| `somenteAdmin` | admin | excluir/desativar, auditoria, cadastro de usuários |
| `somenteTecnico` | técnico | check-in, check-out, prontuário, meus ganhos |
- **Check-in** só é liberado no dia da escala.

## Auditoria
Toda ação importante grava uma linha na tabela `auditoria`: login, criar/editar/excluir cadastros e escalas,
check-in, check-out, prontuário e pagamento. O registro é "fire and forget": se falhar, não atrapalha a ação
principal. A gestão vê as últimas ações em "Atividade recente".

## Segurança
- Senhas guardadas com **bcrypt** (hash, nunca o texto da senha).
- Login com **JWT**, que expira em 8h. O token leva `id`, `tipo` e `profissional_id`.
- SQL parametrizado em todas as consultas.
- Erros internos não mostram detalhes do banco.
- `.env` fora do GitHub. Na nuvem, as senhas ficam nas variáveis do Render.
- **CORS** restrito ao endereço do frontend na nuvem.
- **Limite de tentativas de login:** 10 erros a cada 15 minutos por IP (`express-rate-limit`).
- Cabeçalhos HTTP de segurança com `helmet`.
- Troca de senha exige a senha atual.

## Datas e fuso horário
- Colunas `DATE` voltam como texto `AAAA-MM-DD` (`dateStrings`), para o dia não "voltar um" na tela.
- As conexões com o MySQL usam o fuso `-03:00`, porque os servidores na nuvem usam UTC.

## Testes
- `npm test` no backend roda os testes automatizados (`node:test`, sem dependência extra).
- Os testes de ponta a ponta (navegador) cobrem login, os três CRUDs, check-in, prontuário, financeiro e os perfis.

## Convenções do código
- Nomes em português, seguindo o domínio do problema (escala, plantão, prontuário).
- Frontend: uma pasta de componentes por módulo, mais `ui/` (genéricos) e `layout/`.
- Cores e espaçamentos centralizados em `styles/variables.css`.
