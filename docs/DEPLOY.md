# Publicando o Home Care Flow na nuvem

Para a apresentação não depender do meu computador, publiquei as três partes do sistema em
serviços gratuitos:

| Parte | Serviço | Endereço (exemplo) |
|---|---|---|
| Banco MySQL | **Aiven** | `mysql-xxxx.aivencloud.com:12345` |
| API Node.js | **Render** | `https://homecare-flow-api.onrender.com` |
| Frontend React | **Vercel** | `https://homecare-flow.vercel.app` |

A ordem importa, porque cada parte precisa do endereço da anterior:
**banco → API → frontend → voltar na API para liberar o CORS.**

---

## 1. Banco de dados no Aiven

1. Crie a conta em https://aiven.io (dá para entrar com o GitHub).
2. **Create service → MySQL → plano Free**. Escolha uma região próxima e crie o serviço.
   Ele leva uns minutos para ficar "Running".
3. Na página do serviço, aba **Overview → Connection information**, anote:
   **Host**, **Port**, **User** (`avnadmin`) e **Password**.
4. Baixe o **CA certificate** (botão "Download" ao lado de CA certificate). O arquivo é o `ca.pem`.

### Criar as tabelas no Aiven a partir do meu PC
1. Na pasta `backend`, crie um arquivo **`.env.nuvem`** (ele não vai para o GitHub) com:
   ```
   DB_HOST=host-do-aiven
   DB_PORT=porta-do-aiven
   DB_USER=avnadmin
   DB_PASSWORD='senha-do-aiven'
   DB_NAME=homecare_flow
   DB_SSL=true
   DB_CA_CERT="cole aqui o conteúdo do ca.pem"
   ```
   O `DB_CA_CERT` pode ficar em várias linhas, desde que esteja entre aspas duplas.
2. No terminal, dentro de `backend`:
   ```bash
   npm run db:setup:nuvem
   ```
   Tem que aparecer "Banco pronto!". O mesmo `schema.sql` e o mesmo `seed.sql` do meu PC agora estão na nuvem.

> Para "zerar" a demonstração antes de apresentar, é só rodar esse comando de novo.

---

## 2. API no Render

1. Crie a conta em https://render.com com o **GitHub**.
2. **New → Blueprint**. Escolha o repositório `homecare_flow`. O Render lê o arquivo
   [`render.yaml`](../render.yaml) e já configura quase tudo: pasta `backend`, `npm install`,
   `npm start`, Node 20 e fuso de Brasília.
3. Ele vai pedir as variáveis secretas. Preencha com os dados do Aiven:

   | Variável | Valor |
   |---|---|
   | `DB_HOST` | host do Aiven |
   | `DB_PORT` | porta do Aiven |
   | `DB_USER` | `avnadmin` |
   | `DB_PASSWORD` | senha do Aiven (sem aspas aqui) |
   | `DB_CA_CERT` | conteúdo do `ca.pem` (pode colar com as quebras de linha) |
   | `CORS_ORIGIN` | por enquanto deixe vazio, preencho no passo 4 |

   O `JWT_SECRET` o Render gera sozinho.
4. Clique em **Apply**. Quando terminar, abra o endereço do serviço (ex.:
   `https://homecare-flow-api.onrender.com`). Tem que aparecer:
   `{"status":"online","projeto":"Home Care Flow API"}`.
5. Em **Logs**, deve aparecer **"Conectado ao MySQL com sucesso"**.

> No plano grátis a API dorme depois de 15 minutos sem uso, e o primeiro acesso leva até 1 minuto.
> **No dia da apresentação, abro o link da API uns 5 minutos antes.**

---

## 3. Frontend na Vercel

1. Entre em https://vercel.com com o **GitHub**.
2. **Add New → Project → Import** o repositório `homecare_flow`.
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (ele detecta sozinho)
   - **Environment Variables:**

     | Nome | Valor |
     |---|---|
     | `VITE_API_URL` | `https://SEU-SERVICO.onrender.com/api` (com o `/api` no final) |
     | `VITE_MOSTRAR_DEMO` | `true` (mostra os usuários de teste na tela de login) |
4. **Deploy**. No final aparece o link, por exemplo `https://homecare-flow.vercel.app`.

O arquivo [`frontend/vercel.json`](../frontend/vercel.json) faz as rotas do React (como `/escalas`)
funcionarem ao atualizar a página.

---

## 4. Liberar o CORS na API

Voltando no Render → serviço → **Environment**:
- `CORS_ORIGIN` = link da Vercel, **sem barra no final** (ex.: `https://homecare-flow.vercel.app`)

Salve. O Render reinicia a API sozinho. Assim só o meu site consegue chamar a API pelo navegador.

---

## Checklist do dia da apresentação
- [ ] 5 minutos antes: abrir o link da API para "acordar" o Render.
- [ ] Abrir o link da Vercel e fazer login como admin.
- [ ] Se quiser a demonstração zerada: `npm run db:setup:nuvem` antes de sair de casa.
- [ ] Plano B: projeto rodando local no notebook e/ou vídeo da demonstração.

## Problemas comuns
| Sintoma | Causa provável | Solução |
|---|---|---|
| "Sem conexão com o servidor" no login | API dormindo ou `VITE_API_URL` errado | Abrir o link da API e esperar; conferir se terminou com `/api` |
| Erro de CORS no console do navegador | `CORS_ORIGIN` diferente do link da Vercel | Copiar o link exato, sem `/` no final |
| Log do Render: "Access denied" | Usuário ou senha do Aiven errados | Conferir `DB_USER`/`DB_PASSWORD` |
| Log do Render: erro de certificado | `DB_CA_CERT` incompleto | Colar o `ca.pem` inteiro, com BEGIN e END |
| Página 404 ao atualizar `/escalas` | Root Directory errado na Vercel | Root Directory = `frontend` |
