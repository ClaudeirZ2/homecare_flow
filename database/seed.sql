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

INSERT INTO pacientes (nome, idade, endereco, qr_code_id, responsavel_contato) VALUES
('Antônio Ferreira', 78, 'Rua das Flores, 123 - Rondonópolis/MT', 'QR-PAC-0001', 'Luiza (filha) - (66) 98888-1111'),
('Maria Helena',     82, 'Av. Brasil, 456 - Rondonópolis/MT',     'QR-PAC-0002', 'Roberto (filho) - (66) 98888-2222'),
('José Carvalho',    69, 'Rua Goiás, 789 - Rondonópolis/MT',      'QR-PAC-0003', 'Sandra (esposa) - (66) 98888-3333');

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
