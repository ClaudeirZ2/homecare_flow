# Colinha da apresentação: Home Care Flow

**Tempo total sugerido: ~10 minutos** (ajuste ao tempo que a banca der).
As falas abaixo são um guia: leia algumas vezes e depois fale **com as suas palavras**.
Não precisa decorar.

| Bloco | Tempo |
|---|---|
| 1. Abertura e problema | 1 min 30 |
| 2. ODS, público e impacto | 1 min 30 |
| 3. Demonstração ao vivo | 5 min |
| 4. Como foi construído (técnico) | 1 min 30 |
| 5. Próximos passos e encerramento | 30 s |

---

**Links:** site https://homecare-flow.vercel.app · API https://homecare-flow.onrender.com

## Antes de começar (checklist)
- [ ] **5 min antes:** abrir o link da API no navegador para "acordar" o Render.
- [ ] Abrir o site, já **na tela de login**, com o zoom do navegador em 110% ou 125% para o projetor.
- [ ] Deixar uma **segunda aba** aberta em `docs/telas` ou no vídeo (plano B se a internet cair).
- [ ] Ter à mão: `admin@homecareflow.com`, `juliana@homecareflow.com`, senha `123456`, QR `QR-PAC-0001`.
- [ ] Respirar. Você conhece o sistema melhor que qualquer pessoa na sala.

---

## 1. Abertura e problema (1 min 30)

> "Boa tarde! Meu nome é **[seu nome]** e o meu projeto é o **Home Care Flow**: tecnologia e cuidado em harmonia."

> "Para começar, uma pergunta: vocês já pensaram em como funciona o dia a dia de um **cuidador** ou
> **técnico de enfermagem** que atende pacientes em casa?"

> "Muitas equipes de home care ainda trabalham assim:
> - o **ponto é anotado num papel**, o que dá margem para erro e até fraude de horário;
> - as **anotações do plantão** ficam num caderno, cada um escreve de um jeito;
> - e o **pagamento é combinado pelo WhatsApp**: no fim do mês, ninguém tem certeza de quantas horas foram trabalhadas."

> "Quem mais perde com isso é o profissional, que não consegue **comprovar o próprio trabalho**."

💡 *Dica: fale devagar e olhe para a banca, não para a tela.*

---

## 2. ODS, público e impacto (1 min 30)

> "O projeto está alinhado principalmente à **ODS 8, Trabalho Decente e Crescimento Econômico**.
> O sistema **formaliza a jornada** desses profissionais:
> - a entrada e a saída são registradas com **GPS ou QR Code da casa do paciente**;
> - o **pagamento é calculado automaticamente** pelas horas reais trabalhadas."

> "Ele também conversa com a **ODS 10, Redução das Desigualdades**, porque é uma categoria muito
> informal, e ter o registro das horas dá **transparência e segurança de renda**."

> "O **público** são os cuidadores e técnicos adultos, e os gestores de pequenas agências de home care."

> "O **impacto** que eu espero:
> - fim do ponto em papel;
> - pagamento justo e que dá para conferir;
> - histórico padronizado;
> - mais profissionalização para o setor."

> *(Se perguntarem sobre a restrição de saúde)* "Eu pedi autorização aos gestores do curso para esse
> tema, e ela foi concedida. O foco é a **gestão do trabalho**, e não diagnóstico ou tratamento."

---

## 3. Demonstração ao vivo (5 min)

### 3.1 Login como gestora (30 s)
**Clique:** login com `admin@homecareflow.com` / `123456`.
> "O sistema tem **três perfis**, e cada pessoa vê só o que precisa:
> - o **administrador** vê tudo, inclusive a auditoria;
> - o **gestor** cuida da operação, mas não exclui cadastros;
> - o **técnico** vê só o próprio trabalho: os pacientes dele, as escalas dele e os ganhos dele."

### 3.2 Visão Geral (50 s)
**Mostre:** os cards, o gráfico, os **pontos de atenção** e a **atividade recente**.
> "Aqui é o painel da gestora:
> - os **indicadores do dia** e o gráfico de **escalas previstas versus plantões realizados**;
> - os **pontos de atenção**: o sistema mostra sozinho que um check-in foi feito a 2,4 km da casa
>   do paciente e que um plantão terminou sem prontuário;
> - e embaixo a **atividade recente**, que é a auditoria: quem fez o quê e quando. Isso é importante para a LGPD."

### 3.3 CRUD de Escalas (1 min 30) ⭐ requisito obrigatório
1. **Nova escala:** escolha paciente, profissional, uma data futura e o turno, depois **Criar**.
   > "Esse é o **CRUD completo** que o edital pede. Aqui eu **crio**..."
2. Mostre a escala na lista e use o **filtro** de status.
   > "...**listo e filtro**..."
3. Clique no **lápis** e troque o turno, depois **Salvar**.
   > "...**edito**..."
4. Tente criar **outra escala igual** (mesmo profissional, data e turno).
   > "E o sistema **não deixa** escalar a mesma pessoa duas vezes no mesmo turno. Essa regra está na API."
5. Clique na **lixeira** e **confirme**.
   > "...e **excluo**, com um modal de confirmação."

> "E não é só Escalas: **Pacientes** e **Cuidadores** também têm CRUD completo."
*(Se sobrar tempo, mostre o cadastro de um cuidador: ele já cria o login do profissional.)*

### 3.3b Cartão de QR Code (20 s)
**Clique:** Pacientes → ícone de QR no card do Antônio.
> "Para cada paciente o sistema gera um **cartão com QR Code** para imprimir e colar na casa.
> É ele que o cuidador vai ler com o celular na chegada."

### 3.4 Financeiro (50 s)
**Clique:** Relatórios.
> "No fim do mês, o sistema soma as **horas reais** de cada plantão e multiplica pelo valor da hora."

**Clique:** Marcar como pago → Confirmar.
> "A gestora registra o pagamento, e dá para **exportar para o Excel**."

### 3.5 Visão da técnica (1 min 30)
**Clique:** Sair. Entre com `juliana@homecareflow.com` / `123456`.
> "Agora eu sou a Juliana, técnica de enfermagem. Reparem que o menu dela é menor: ela **não vê a lista de
> cuidadores** nem o financeiro da empresa, e em **Meus pacientes** aparecem só os pacientes que ela atende.
> O painel dela também é diferente: o **Meu dia** mostra
> o plantão de hoje, as próximas escalas e **quanto ela já tem a receber no mês**.
> Ela **não vê o financeiro** da empresa, só os ganhos dela."

**Clique:** Meus ganhos.
> "Esse é o coração da ODS 8: a profissional **acompanha as próprias horas e o valor**,
> calculado automaticamente. Ela não depende de papel nem de combinado por WhatsApp."

**Clique:** Plantões → **QR Code** na escala de hoje.
> "Ela chega na casa do paciente e faz o **check-in lendo o QR Code com a câmera do celular**."
*(No notebook: use a aba **Digitar código** → `QR-PAC-0001` → Confirmar.
Se quiser impressionar: abra o site no celular e leia o cartão impresso ou mostrado na tela do notebook.)*
> "Se o código não for daquela casa, o sistema recusa."
*(Opcional: digite antes `QR-PAC-0002` para mostrar o erro.)*

**Clique:** Prontuários → escolha o plantão "em andamento" → preencha pressão, temperatura e observação → Registrar.
> "Durante o plantão ela faz o **registro padronizado**, e ele já aparece no **histórico do paciente**."

**Clique:** Plantões → **Check-out**.
> "Na saída, o **check-out**. As horas desse plantão já entram no fechamento do mês."

---

### 3.6 Bônus: o app no celular (30 s, se der tempo)
**Mostre:** o celular com o Home Care Flow **instalado na tela inicial** (ícone do coração).
> "Como o cuidador usa o celular na casa do paciente, o sistema é um **PWA**: dá para instalar como
> aplicativo, abre em tela cheia e funciona mesmo com internet ruim. No celular, as tabelas viram cartões."

*Antes da apresentação: abra o site no celular → menu ☰ → **Instalar app**
(no iPhone: Safari → Compartilhar → **Adicionar à Tela de Início**).*

## 4. Como foi construído (1 min 30)

> "Tecnicamente, usei as três tecnologias da formação:"

> "**MySQL**, com **8 tabelas relacionadas**: usuários, profissionais, pacientes, escalas, plantões,
> prontuários, pagamentos e **auditoria**, que registra quem fez o quê. Uso **chaves estrangeiras** e **transações**: no check-in, três tabelas
> mudam juntas; se uma falhar, nada é gravado."

> "**Node.js com Express**, numa **API REST** documentada com **Swagger**, organizada em camadas:
> - rotas;
> - middlewares de **login com JWT** e permissão por perfil;
> - controllers com as validações;
> - models com o SQL.

> As senhas ficam criptografadas com **bcrypt**, o login tem **limite de tentativas**
> e o backend tem **testes automatizados**."

> "**React**, todo **componentizado**: Navbar, Cards, Formulários, Botões, Tabelas, Modais e Footer são
> componentes reutilizáveis, e cada módulo tem a sua pasta."

> "E está tudo **publicado na nuvem**: o banco no Aiven, a API no Render e o site na Vercel.
> Por isso estou acessando por um link, e não pelo meu computador."

---

## 5. Próximos passos e encerramento (30 s)

> "Como próximos passos, quero:
> - ler o QR Code pela **câmera do celular**;
> - validar a **distância do GPS** até a casa do paciente;
> - transformar o sistema num **app** para os cuidadores."

> "O Home Care Flow mostra que tecnologia simples, bem aplicada, pode dar **dignidade e
> transparência** para quem cuida. Obrigado! Fico à disposição para perguntas."

---

## Perguntas prováveis da banca

**"Por que um projeto de saúde, se o edital não permite?"**
> "Pedi autorização aos gestores e ela foi concedida. E o foco não é a saúde em si (diagnóstico,
> tratamento); é a **gestão do trabalho** de quem cuida: escala, jornada e pagamento. Por isso a ODS 8."

**"Onde está o CRUD completo?"**
> "Em Escalas, Pacientes e Cuidadores. As quatro operações funcionam pela interface e chamam a API:
> POST para criar, GET para listar, PUT para editar e DELETE para excluir."

**"Como funciona o login / o que é JWT?"**
> "Quando a pessoa faz login, a API confere a senha com o bcrypt e devolve um **token JWT**, assinado
> com uma chave secreta. O front guarda esse token e manda em toda requisição. A API confere a
> assinatura e sabe quem é o usuário e o perfil dele, sem consultar o banco toda vez. O token expira em 8 horas."

**"Por que não apagar de verdade o paciente / profissional?"**
> "Porque eles têm **histórico**: plantões, prontuários e pagamentos. Se eu apagasse, perderia essas
> informações. Então faço a exclusão lógica: marco como inativo, cancelo as escalas futuras e bloqueio o login."

**"O que é uma transação e onde você usou?"**
> "É um bloco de comandos que **ou acontece inteiro, ou não acontece**. No check-in eu crio o plantão,
> mudo o status da escala e o do profissional. Se uma dessas etapas falhar, faço rollback e nada fica pela metade.
> Também uso no cadastro do profissional, que cria o usuário e o profissional juntos."

**"Como você garante que o técnico não vê dados de outro?"**
> "A regra está **na API**, não só na tela. O token tem o perfil e o id do profissional, e as consultas
> filtram por ele. Mesmo que alguém chame a API direto, recebe erro 403."

**"E a LGPD? São dados sensíveis."**
> "Sim, por isso o sistema tem login, senhas criptografadas, acesso por perfil e o `.env` com as senhas
> fora do GitHub. Na apresentação todos os dados são **fictícios**. Num uso real eu ainda colocaria
> termo de consentimento e registro de quem acessou cada prontuário."

**"Como o GPS impede fraude?"**
> "No check-in por GPS, a API calcula a distância até a casa do paciente com a fórmula de Haversine.
> Acima de 300 metros o check-in não é bloqueado, porque o GPS do celular às vezes erra, mas ele
> vira um **alerta** no painel da gestão. E o QR Code garante a presença: o cartão fica colado na casa."

**"Por que o técnico não vê os outros cuidadores e pacientes?"**
> "Por privacidade e pela LGPD: cada pessoa vê só o necessário. O técnico não precisa saber o salário dos
> colegas, nem ler o prontuário de um paciente que ele não atende. E a gestão não faz check-in no lugar
> do técnico, porque o check-in é a prova de que ele estava na casa. Essas regras estão na API, e eu testei
> todas elas: são 39 verificações, perfil por perfil."

**"O que é essa auditoria?"**
> "É uma tabela que guarda quem fez cada ação e quando: login, cadastro, check-in, pagamento.
> Se alguém perguntar 'quem mudou essa escala?', o sistema responde. Isso é rastreabilidade, e a LGPD cobra isso."

**"Tem testes?"**
> "Tem. O `npm test` roda testes automatizados do backend: autenticação, permissões, tratamento de
> erros e o cálculo da distância. E eu testei todas as telas de ponta a ponta no navegador."

**"Onde está a documentação da API?"**
> "Em `/api/docs`. É o Swagger: lista todas as rotas, e dá para testar direto pelo navegador."

**"Por que React com Vite e não outra coisa?"**
> "Foi o que estudamos na formação. O Vite deixa o desenvolvimento rápido, e os componentes me
> deixaram reaproveitar tabela, botão e modal em todas as telas."

**"Você usou IA?"**
> "Usei como assistente de programação, para tirar dúvidas, revisar e acelerar partes repetitivas.
> Mas as decisões do projeto, as regras de negócio e os testes são meus, e eu sei explicar cada parte."
*(Seja honesto: a banca valoriza quem domina o que entregou.)*

**"Qual foi a maior dificuldade?"**
> Escolha uma que você viveu de verdade. Sugestões do que aconteceu no projeto:
> - **fuso horário:** as datas apareciam com um dia a menos, e na nuvem o horário ficava 3 horas adiantado;
> - **regras de permissão:** garantir que o técnico só veja os dados dele;
> - **publicar na nuvem:** conectar banco, API e front em serviços diferentes (SSL, CORS).

---

## Se algo der errado na hora
| Problema | O que fazer |
|---|---|
| Site não carrega / "sem conexão" | A API está acordando: espere 1 minuto e fale da arquitetura enquanto isso |
| Internet caiu | Mostre as telas em `docs/telas` ou o vídeo, e explique o fluxo |
| GPS pede permissão | Clique em "Permitir", ou use o **QR Code** (não depende de GPS) |
| Esqueceu uma fala | Volte à tela e descreva o que ela mostra; a demonstração fala por você |
