# Arquitetura e Modelo de Dados

## Relacionamentos
- usuarios 1—1 profissionais (`profissionais.usuario_id` único)
- profissionais 1—N escalas N—1 pacientes
- escalas 1—1 plantoes (`plantoes.escala_id` único: uma escala gera no máximo um plantão)
- plantoes 1—N prontuarios
- profissionais 1—N pagamentos (único por profissional + mês)

## Fluxo principal
1. O gestor cria a **escala** (paciente + profissional + data + turno). A API bloqueia o mesmo profissional duas vezes no mesmo dia e turno.
2. O profissional faz o **check-in** por GPS ou QR Code. Isso cria o **plantão**, a escala passa a `em_andamento` e o profissional a `em_plantao`. Tudo acontece em uma transação.
   - QR Code: o código informado precisa ser igual ao `qr_code_id` do paciente da escala.
3. O profissional registra o **prontuário** do plantão (sinais vitais validados por faixa).
4. No **check-out**, o plantão fica `finalizado`, a escala `concluido` e o profissional volta a `disponivel`.
5. No fim do mês, o **relatório** soma as horas finalizadas × valor/hora e grava em `pagamentos`. Um fechamento já pago não é recalculado.

## Regras de exclusão
- **Escala:** exclusão física, permitida só se ainda não houver plantão. Depois disso, use o status `cancelado`.
- **Paciente / Profissional:** exclusão lógica (`ativo = FALSE`). As escalas `agendado` deles passam a `cancelado`. O profissional desativado perde o login.

## Segurança
- Senhas com bcrypt; autenticação JWT (o token leva `id`, `tipo` e `profissional_id`).
- Autorização na API: `somenteGestao` (admin/gestor) para escrita; técnico filtrado pelo próprio `profissional_id`.
- SQL sempre parametrizado (`?`); erros do MySQL traduzidos em mensagens amigáveis, sem expor detalhes internos.

## Convenções
- Backend em camadas: routes → middlewares → controllers (validação/regras) → models (SQL)
- Frontend: pages (telas) → components (reutilizáveis, por módulo + `ui/`) → services (API)
- Feedback ao usuário via `ToastContext` (`useToast().sucesso/erro`)
- Datas `DATE` trafegam como texto `AAAA-MM-DD` (`dateStrings: ['DATE']`) para evitar erro de fuso horário
