-- ============================================================
-- HOME CARE FLOW — Dados de exemplo (seed)
-- Senha de TODOS os usuários de teste: 123456
-- (hash bcrypt gerado com `node backend/src/utils/gerarHash.js 123456`)
-- As datas são relativas ao dia de hoje, assim a demonstração sempre tem dados "atuais".
-- Todos os nomes, endereços e telefones são fictícios.
-- ============================================================

USE homecare_flow;

SET @senha = '$2a$10$GKn2SAV5jLvrxalEP/RA8e6GwEqZZuXSz88K94LY/2PedJlVkF0LO';

-- ------------------------------------------------------------
-- Usuários: 1 admin, 1 gestor e 7 profissionais (técnicos e cuidadores)
-- ------------------------------------------------------------
INSERT INTO usuarios (nome, email, senha_hash, tipo, telefone) VALUES
('Ana Souza',       'admin@homecareflow.com',    @senha, 'admin',   '(66) 99999-0001'),  -- 1
('Carlos Mendes',   'carlos@homecareflow.com',   @senha, 'gestor',  '(66) 99999-0002'),  -- 2
('Juliana Rocha',   'juliana@homecareflow.com',  @senha, 'tecnico', '(66) 99999-0003'),  -- 3
('Pedro Lima',      'pedro@homecareflow.com',    @senha, 'tecnico', '(66) 99999-0004'),  -- 4
('Marta Oliveira',  'marta@homecareflow.com',    @senha, 'tecnico', '(66) 99999-0005'),  -- 5
('Rafael Souza',    'rafael@homecareflow.com',   @senha, 'tecnico', '(66) 99999-0006'),  -- 6
('Camila Duarte',   'camila@homecareflow.com',   @senha, 'tecnico', '(66) 99999-0007'),  -- 7
('Bruno Teixeira',  'bruno@homecareflow.com',    @senha, 'tecnico', '(66) 99999-0008'),  -- 8
('Larissa Nunes',   'larissa@homecareflow.com',  @senha, 'tecnico', '(66) 99999-0009');  -- 9

-- ------------------------------------------------------------
-- Pacientes (todos adultos/idosos) com o código do QR Code e a localização da casa
-- ------------------------------------------------------------
INSERT INTO pacientes (nome, idade, endereco, qr_code_id, responsavel_contato, latitude, longitude, observacoes_gerais) VALUES
('Antônio Ferreira',  78, 'Rua das Flores, 123 - Vila Aurora, Rondonópolis/MT',      'QR-PAC-0001', 'Luiza (filha) - (66) 98888-1111',   -16.4708000, -54.6356000, 'Hipertenso. Caminhada leve no período da manhã.'),
('Maria Helena',      82, 'Av. Brasil, 456 - Centro, Rondonópolis/MT',               'QR-PAC-0002', 'Roberto (filho) - (66) 98888-2222', -16.4673000, -54.6372000, 'Diabética, insulina às 22h. Acorda à noite com frequência.'),
('José Carvalho',     69, 'Rua Goiás, 789 - Jardim Guanabara, Rondonópolis/MT',      'QR-PAC-0003', 'Sandra (esposa) - (66) 98888-3333', -16.4590000, -54.6410000, 'Pós-operatório de quadril. Usa andador.'),
('Olga Martins',      85, 'Rua Fernando Correa, 1020 - Vila Birigui, Rondonópolis/MT', 'QR-PAC-0004', 'Célia (filha) - (66) 98888-4444',  -16.4752000, -54.6301000, 'Dieta pastosa. Gosta de rádio pela manhã.'),
('Francisco Alves',   74, 'Rua Rio Branco, 315 - Centro, Rondonópolis/MT',           'QR-PAC-0005', 'Márcio (filho) - (66) 98888-5555',  -16.4699000, -54.6398000, 'Recuperação de AVC. Fisioterapia às terças.'),
('Lúcia Ramos',       91, 'Av. Bandeirantes, 1450 - Vila Operária, Rondonópolis/MT', 'QR-PAC-0006', 'Denise (neta) - (66) 98888-6666',   -16.4625000, -54.6455000, 'Acamada. Mudança de decúbito a cada 2 horas.'),
('Geraldo Pires',     77, 'Rua Dom Pedro II, 88 - Jardim Atlântico, Rondonópolis/MT', 'QR-PAC-0007', 'Rosa (esposa) - (66) 98888-7777',  -16.4801000, -54.6233000, 'Mal de Parkinson. Medicação em horários fixos.'),
('Teresa Moura',      88, 'Rua Paraná, 640 - Vila Mineira, Rondonópolis/MT',         'QR-PAC-0008', 'Paulo (filho) - (66) 98888-8888',   -16.4561000, -54.6352000, 'Alzheimer em estágio inicial. Não deixar sair sozinha.'),
('Sebastião Costa',   80, 'Rua Marechal Rondon, 1200 - Centro, Rondonópolis/MT',     'QR-PAC-0009', 'Vera (filha) - (66) 98888-9999',    -16.4688000, -54.6339000, 'Oxigênio domiciliar à noite.'),
('Irene Batista',     86, 'Av. Lions Internacional, 300 - Jardim Tropical, Rondonópolis/MT', 'QR-PAC-0010', 'Hélio (filho) - (66) 98888-0000', -16.4870000, -54.6280000, 'Diabética. Controle de glicemia antes das refeições.');

-- ------------------------------------------------------------
-- Profissionais (ligados aos usuários técnicos)
-- ------------------------------------------------------------
INSERT INTO profissionais (usuario_id, especialidade, valor_hora, status_disponibilidade) VALUES
(3, 'Técnica de Enfermagem', 18.50, 'disponivel'),  -- 1 Juliana
(4, 'Técnico de Enfermagem', 18.50, 'disponivel'),  -- 2 Pedro
(5, 'Cuidadora',             15.00, 'disponivel'),  -- 3 Marta
(6, 'Técnico de Enfermagem', 19.00, 'disponivel'),  -- 4 Rafael
(7, 'Cuidadora',             16.00, 'disponivel'),  -- 5 Camila
(8, 'Técnico de Enfermagem', 18.50, 'disponivel'),  -- 6 Bruno
(9, 'Cuidadora',             16.00, 'disponivel');  -- 7 Larissa

-- ------------------------------------------------------------
-- Escalas fixas (os IDs 1 a 7 são usados na demonstração)
-- ------------------------------------------------------------
INSERT INTO escalas (profissional_id, paciente_id, data_prevista, turno, status) VALUES
(1, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'manha', 'concluido'),   -- 1
(2, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'noite', 'concluido'),   -- 2
(3, 3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'tarde', 'concluido'),   -- 3
(1, 1, CURDATE(),                           'manha', 'agendado'),    -- 4 Juliana atende Antônio hoje
(2, 2, CURDATE(),                           'noite', 'agendado'),    -- 5 Pedro atende Maria Helena hoje
(3, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'tarde', 'agendado'),    -- 6
(1, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '12x36', 'agendado');    -- 7

-- Plantões das escalas fixas já concluídas
INSERT INTO plantoes (escala_id, profissional_id, paciente_id, checkin_hora, checkin_lat, checkin_lng, checkin_metodo,
                      checkout_hora, checkout_lat, checkout_lng, status) VALUES
(1, 1, 1, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 DAY), '07:02:00'), -16.4708, -54.6356, 'gps',
          TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 DAY), '13:05:00'), -16.4708, -54.6356, 'finalizado'),
(2, 2, 2, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '19:00:00'), -16.4673, -54.6372, 'qrcode',
          TIMESTAMP(CURDATE(), '07:00:00'),                           -16.4673, -54.6372, 'finalizado'),
(3, 3, 3, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '13:00:00'), -16.4590, -54.6410, 'gps',
          TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '19:00:00'), -16.4590, -54.6410, 'finalizado');

INSERT INTO prontuarios (plantao_id, pressao_arterial, frequencia_cardiaca, temperatura, saturacao_oxigenio,
                         medicacao_administrada, intercorrencias, observacoes) VALUES
(1, '12/8', 72, 36.4, 97, 'Losartana 50mg às 08h', NULL, 'Paciente tranquilo, aceitou bem a alimentação.'),
(2, '13/8', 80, 36.8, 95, 'Insulina NPH 10UI às 22h', 'Leve agitação noturna às 02h, controlada.', 'Dormiu bem após as 03h.'),
(3, '11/7', 68, 36.2, 98, NULL, NULL, 'Caminhada leve no quintal acompanhada.');

-- ------------------------------------------------------------
-- Equipe fixa: cada linha é "profissional atende paciente em tal turno"
-- (usada para gerar o histórico e as próximas escalas)
-- ------------------------------------------------------------
-- (o MySQL do Aiven exige chave primária em toda tabela, até nas temporárias)
CREATE TEMPORARY TABLE equipe (profissional_id INT, paciente_id INT, turno VARCHAR(10),
                               PRIMARY KEY (profissional_id, paciente_id));
INSERT INTO equipe VALUES
(1, 1, 'manha'), (2, 2, 'noite'), (3, 3, 'tarde'),
(4, 4, 'manha'), (5, 5, 'tarde'), (6, 6, 'noite'),
(7, 7, 'manha'), (4, 8, 'tarde'), (5, 9, 'manha'), (7, 10, 'tarde');

-- Números de 0 a 40 (dias)
CREATE TEMPORARY TABLE dias (n INT PRIMARY KEY);
INSERT INTO dias (n) VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20),
  (21),(22),(23),(24),(25),(26),(27),(28),(29),(30),(31),(32),(33),(34),(35),(36),(37),(38),(39),(40);

-- Histórico de ontem até 40 dias atrás (pega também o mês passado).
-- A conta com o número do dia só serve para variar: nem todo mundo trabalha todo dia,
-- e de vez em quando uma escala foi cancelada.
INSERT INTO escalas (profissional_id, paciente_id, data_prevista, turno, status)
SELECT eq.profissional_id, eq.paciente_id, DATE_SUB(CURDATE(), INTERVAL d.n DAY), eq.turno,
       IF((d.n * eq.profissional_id + eq.paciente_id) % 17 = 0, 'cancelado', 'concluido')
FROM dias d CROSS JOIN equipe eq
WHERE d.n BETWEEN 1 AND 40
  AND NOT (eq.profissional_id <= 3 AND d.n <= 2)   -- nesses dias Juliana, Pedro e Marta já têm as escalas fixas
  AND (d.n + eq.profissional_id + eq.paciente_id) % 4 <> 0;

-- Próximos dias (de hoje até daqui a 7 dias) para o restante da equipe
-- (Juliana, Pedro e Marta já têm as escalas fixas acima)
INSERT INTO escalas (profissional_id, paciente_id, data_prevista, turno, status)
SELECT eq.profissional_id, eq.paciente_id, DATE_ADD(CURDATE(), INTERVAL d.n DAY), eq.turno, 'agendado'
FROM dias d CROSS JOIN equipe eq
WHERE d.n BETWEEN 0 AND 7 AND eq.profissional_id >= 4 AND (d.n + eq.profissional_id) % 3 <> 0;

-- Um plantão finalizado para cada escala concluída que ainda não tem plantão
INSERT INTO plantoes (escala_id, profissional_id, paciente_id, checkin_hora, checkin_lat, checkin_lng, checkin_metodo,
                      checkout_hora, checkout_lat, checkout_lng, status)
SELECT e.id, e.profissional_id, e.paciente_id,
       TIMESTAMPADD(MINUTE, e.id % 7,
         TIMESTAMP(e.data_prevista, CASE e.turno WHEN 'manha' THEN '07:00:00' WHEN 'tarde' THEN '13:00:00' ELSE '19:00:00' END)),
       pac.latitude, pac.longitude, IF(e.id % 2 = 0, 'qrcode', 'gps'),
       TIMESTAMPADD(MINUTE, IF(e.turno = 'noite', 720, 360) + (e.id % 4) * 5,
         TIMESTAMP(e.data_prevista, CASE e.turno WHEN 'manha' THEN '07:00:00' WHEN 'tarde' THEN '13:00:00' ELSE '19:00:00' END)),
       pac.latitude, pac.longitude, 'finalizado'
FROM escalas e
JOIN pacientes pac ON pac.id = e.paciente_id
LEFT JOIN plantoes pl ON pl.escala_id = e.id
WHERE e.status = 'concluido' AND pl.id IS NULL;

-- Plantões da manhã de hoje que já começaram (aparecem como "em andamento" no painel)
UPDATE escalas SET status = 'em_andamento'
WHERE data_prevista = CURDATE() AND turno = 'manha' AND profissional_id >= 4 AND status = 'agendado';

INSERT INTO plantoes (escala_id, profissional_id, paciente_id, checkin_hora, checkin_lat, checkin_lng, checkin_metodo, status)
SELECT e.id, e.profissional_id, e.paciente_id, TIMESTAMP(CURDATE(), '07:04:00'), pac.latitude, pac.longitude, 'qrcode', 'em_andamento'
FROM escalas e JOIN pacientes pac ON pac.id = e.paciente_id
WHERE e.status = 'em_andamento';

UPDATE profissionais SET status_disponibilidade = 'em_plantao'
WHERE id IN (SELECT profissional_id FROM (SELECT DISTINCT profissional_id FROM escalas WHERE status = 'em_andamento') AS x);

-- Distância do check-in por GPS (no histórico, todos perto da casa do paciente)
UPDATE plantoes SET checkin_distancia_m = 12 + (id % 6) * 11 WHERE checkin_metodo = 'gps';

-- ------------------------------------------------------------
-- Prontuários do histórico (textos variados, para a linha do tempo ficar realista)
-- ------------------------------------------------------------
INSERT INTO prontuarios (plantao_id, pressao_arterial, frequencia_cardiaca, temperatura, saturacao_oxigenio,
                         medicacao_administrada, intercorrencias, observacoes)
SELECT pl.id,
       ELT(1 + pl.id % 4, '12/8', '13/8', '11/7', '12/7'),
       64 + pl.id % 18,
       36.0 + (pl.id % 8) / 10,
       94 + pl.id % 5,
       ELT(1 + pl.id % 5, 'Medicação do horário administrada conforme prescrição.', 'Losartana 50mg às 08h.',
           'Insulina NPH conforme prescrição.', NULL, 'Dipirona 500mg às 14h (dor leve).'),
       IF(pl.id % 9 = 0, 'Episódio de tontura ao levantar, melhorou após repouso. Família avisada.', NULL),
       ELT(1 + pl.id % 6, 'Plantão tranquilo. Paciente estável.',
           'Aceitou bem as refeições e a hidratação.',
           'Realizada higiene e troca de roupa de cama.',
           'Paciente participou de caminhada leve acompanhada.',
           'Sono tranquilo durante o período.',
           'Conversou com a família por vídeo, ficou animado.')
FROM plantoes pl
LEFT JOIN prontuarios pr ON pr.plantao_id = pl.id
WHERE pl.status = 'finalizado' AND pr.id IS NULL;

-- ------------------------------------------------------------
-- Dois casos para a gestão conferir em "Pontos de atenção" (fica realista na demonstração):
-- ------------------------------------------------------------
-- 1) um check-in por GPS feito a 2,4 km da casa do paciente (nos últimos dias)
UPDATE plantoes SET checkin_distancia_m = 2350
WHERE id = (SELECT id FROM (
  SELECT MAX(id) AS id FROM plantoes
  WHERE checkin_metodo = 'gps' AND status = 'finalizado' AND checkin_hora >= CURDATE() - INTERVAL 6 DAY AND id > 3) AS x);
-- 2) um plantão finalizado sem prontuário registrado
DELETE FROM prontuarios
WHERE plantao_id = (SELECT id FROM (
  SELECT MAX(id) AS id FROM plantoes
  WHERE status = 'finalizado' AND checkin_metodo = 'qrcode' AND id > 3) AS x);

-- ------------------------------------------------------------
-- Pagamentos: o mês passado já foi fechado e pago (aparece no "Meus ganhos" e no financeiro)
-- ------------------------------------------------------------
INSERT INTO pagamentos (profissional_id, mes_referencia, qtd_plantoes, valor_total, status, gerado_em, pago_em)
SELECT prof.id,
       DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m'),
       COUNT(pl.id),
       ROUND(SUM(TIMESTAMPDIFF(MINUTE, pl.checkin_hora, pl.checkout_hora) / 60 * prof.valor_hora), 2),
       'pago',
       TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-01'), '09:00:00'),
       TIMESTAMP(DATE_FORMAT(CURDATE(), '%Y-%m-05'), '10:30:00')
FROM plantoes pl
JOIN profissionais prof ON prof.id = pl.profissional_id
WHERE pl.status = 'finalizado'
  AND DATE_FORMAT(pl.checkin_hora, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
GROUP BY prof.id;

-- ------------------------------------------------------------
-- Auditoria: algumas ações para a "Atividade recente" não começar vazia
-- ------------------------------------------------------------
INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, descricao, criado_em) VALUES
(1, 'pagou',    'pagamento',    1, 'Pagamento do mês anterior da equipe registrado',          NOW() - INTERVAL 3 DAY),
(2, 'criou',    'paciente',    10, 'Cadastrou a paciente Irene Batista',                      NOW() - INTERVAL 3 DAY),
(2, 'criou',    'escala',       4, 'Escala de Antônio Ferreira para Juliana Rocha (manhã)',   NOW() - INTERVAL 2 DAY),
(2, 'criou',    'escala',       5, 'Escala de Maria Helena para Pedro Lima (noite)',          NOW() - INTERVAL 2 DAY),
(2, 'editou',   'profissional', 4, 'Editou o cadastro de Rafael Souza',                       NOW() - INTERVAL 1 DAY),
(4, 'checkout', 'plantao',      2, 'Check-out de Pedro Lima na casa de Maria Helena',         NOW() - INTERVAL 14 HOUR),
(5, 'checkout', 'plantao',      3, 'Check-out de Marta Oliveira na casa de José Carvalho',    NOW() - INTERVAL 20 HOUR);

DROP TEMPORARY TABLE equipe;
DROP TEMPORARY TABLE dias;
