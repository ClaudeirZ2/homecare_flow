-- ============================================================
-- HOME CARE FLOW — Dados de exemplo (seed)
-- Senha de TODOS os usuários de teste: 123456
-- (hash bcrypt gerado com `node backend/src/utils/gerarHash.js 123456`)
-- Datas relativas a hoje, para a demonstração sempre ter dados "atuais".
-- ============================================================

USE homecare_flow;

SET @senha = '$2a$10$GKn2SAV5jLvrxalEP/RA8e6GwEqZZuXSz88K94LY/2PedJlVkF0LO';

INSERT INTO usuarios (nome, email, senha_hash, tipo, telefone) VALUES
('Ana Souza',      'admin@homecareflow.com',    @senha, 'admin',   '(66) 99999-0001'),
('Carlos Mendes',  'carlos@homecareflow.com',   @senha, 'gestor',  '(66) 99999-0002'),
('Juliana Rocha',  'juliana@homecareflow.com',  @senha, 'tecnico', '(66) 99999-0003'),
('Pedro Lima',     'pedro@homecareflow.com',    @senha, 'tecnico', '(66) 99999-0004'),
('Marta Oliveira', 'marta@homecareflow.com',    @senha, 'tecnico', '(66) 99999-0005');

INSERT INTO pacientes (nome, idade, endereco, qr_code_id, responsavel_contato, latitude, longitude) VALUES
('Antônio Ferreira', 78, 'Rua das Flores, 123 - Rondonópolis/MT', 'QR-PAC-0001', 'Luiza (filha) - (66) 98888-1111', -16.4708000, -54.6356000),
('Maria Helena',     82, 'Av. Brasil, 456 - Rondonópolis/MT',     'QR-PAC-0002', 'Roberto (filho) - (66) 98888-2222', -16.4673000, -54.6372000),
('José Carvalho',    69, 'Rua Goiás, 789 - Rondonópolis/MT',      'QR-PAC-0003', 'Sandra (esposa) - (66) 98888-3333', -16.4590000, -54.6410000);

INSERT INTO profissionais (usuario_id, especialidade, valor_hora, status_disponibilidade) VALUES
(3, 'Técnica de Enfermagem', 18.50, 'disponivel'),
(4, 'Técnico de Enfermagem', 18.50, 'disponivel'),
(5, 'Cuidadora',             15.00, 'disponivel');

-- Escalas: algumas já concluídas (geram histórico e financeiro), outras para hoje e próximos dias
INSERT INTO escalas (profissional_id, paciente_id, data_prevista, turno, status) VALUES
(1, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'manha', 'concluido'),   -- id 1
(2, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'noite', 'concluido'),   -- id 2
(3, 3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'tarde', 'concluido'),   -- id 3
(1, 1, CURDATE(),                           'manha', 'agendado'),    -- id 4
(2, 2, CURDATE(),                           'noite', 'agendado'),    -- id 5
(3, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'tarde', 'agendado'),    -- id 6
(1, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '12x36', 'agendado');    -- id 7

-- Plantões finalizados das escalas concluídas
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
(1, '12/8',  72, 36.4, 97, 'Losartana 50mg às 08h', NULL, 'Paciente tranquilo, aceitou bem a alimentação.'),
(2, '13/8',  80, 36.8, 95, 'Insulina NPH 10UI às 22h', 'Leve agitação noturna às 02h, controlada.', 'Dormiu bem após as 03h.'),
(3, '11/7',  68, 36.2, 98, NULL, NULL, 'Caminhada leve no quintal acompanhada.');

-- ------------------------------------------------------------
-- Histórico dos últimos 3 a 10 dias (deixa o painel e o financeiro com dados)
-- A combinação (dia + profissional) varia a quantidade de escalas por dia.
-- ------------------------------------------------------------
INSERT INTO escalas (profissional_id, paciente_id, data_prevista, turno, status)
SELECT eq.profissional_id, eq.paciente_id, DATE_SUB(CURDATE(), INTERVAL d.n DAY), eq.turno, 'concluido'
FROM (SELECT 3 AS n UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
      UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) d
CROSS JOIN (SELECT 1 AS profissional_id, 1 AS paciente_id, 'manha' AS turno
            UNION ALL SELECT 2, 2, 'noite'
            UNION ALL SELECT 3, 3, 'tarde') eq
WHERE (d.n + eq.profissional_id) % 4 <> 0;

-- Um plantão finalizado para cada escala concluída que ainda não tem plantão
INSERT INTO plantoes (escala_id, profissional_id, paciente_id, checkin_hora, checkin_lat, checkin_lng, checkin_metodo,
                      checkout_hora, checkout_lat, checkout_lng, status)
SELECT e.id, e.profissional_id, e.paciente_id,
       TIMESTAMP(e.data_prevista, CASE e.turno WHEN 'manha' THEN '07:00:00' WHEN 'tarde' THEN '13:00:00' ELSE '19:00:00' END),
       -16.4700, -54.6360, IF(e.id % 2 = 0, 'qrcode', 'gps'),
       TIMESTAMPADD(MINUTE, IF(e.turno = 'noite', 720, 360) + (e.id % 4) * 5,
                    TIMESTAMP(e.data_prevista, CASE e.turno WHEN 'manha' THEN '07:00:00' WHEN 'tarde' THEN '13:00:00' ELSE '19:00:00' END)),
       -16.4700, -54.6360, 'finalizado'
FROM escalas e
LEFT JOIN plantoes pl ON pl.escala_id = e.id
WHERE e.status = 'concluido' AND pl.id IS NULL;

-- Prontuário padrão para os plantões do histórico
INSERT INTO prontuarios (plantao_id, pressao_arterial, frequencia_cardiaca, temperatura, saturacao_oxigenio, observacoes)
SELECT pl.id, ELT(1 + pl.id % 3, '12/8', '13/8', '11/7'), 66 + pl.id % 14, 36.0 + (pl.id % 7) / 10, 95 + pl.id % 4,
       'Plantão sem intercorrências. Paciente estável.'
FROM plantoes pl
LEFT JOIN prontuarios pr ON pr.plantao_id = pl.id
WHERE pl.status = 'finalizado' AND pr.id IS NULL;

-- Distância do check-in por GPS (no histórico, todos dentro do raio da casa do paciente)
UPDATE plantoes SET checkin_distancia_m = 15 + (id % 5) * 12 WHERE checkin_metodo = 'gps';

-- Dois casos para a gestão conferir em "Pontos de atenção" (fica realista na demonstração):
-- 1) um check-in por GPS feito a 2,4 km da casa do paciente
UPDATE plantoes SET checkin_distancia_m = 2350
WHERE id = (SELECT id FROM (SELECT MIN(id) AS id FROM plantoes WHERE checkin_metodo = 'gps' AND id > 3) AS x);
-- 2) um plantão finalizado sem prontuário registrado
DELETE FROM prontuarios
WHERE plantao_id = (SELECT id FROM (SELECT MAX(id) AS id FROM plantoes WHERE status = 'finalizado' AND id > 3) AS x);

-- Algumas linhas de auditoria para a tela de "Atividade recente" não começar vazia
INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, descricao, criado_em) VALUES
(2, 'criou',   'escala',   4, 'Escala de Antônio Ferreira para Juliana Rocha (manhã)', NOW() - INTERVAL 2 DAY),
(2, 'criou',   'escala',   5, 'Escala de Maria Helena para Pedro Lima (noite)',         NOW() - INTERVAL 2 DAY),
(4, 'checkout', 'plantao', 2, 'Check-out de Pedro Lima na casa de Maria Helena',        NOW() - INTERVAL 1 DAY),
(5, 'checkout', 'plantao', 3, 'Check-out de Marta Oliveira na casa de José Carvalho',   NOW() - INTERVAL 1 DAY);
