-- ============================================================
-- HOME CARE FLOW — Schema MySQL
-- Tecnologia e cuidado em harmonia
-- ============================================================

-- ATENÇÃO: recria o banco do zero (apaga dados anteriores).
DROP DATABASE IF EXISTS homecare_flow;
CREATE DATABASE homecare_flow
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE homecare_flow;

-- ------------------------------------------------------------
-- USUARIOS: login do sistema (admin, gestor, tecnico)
-- ------------------------------------------------------------
CREATE TABLE usuarios (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nome           VARCHAR(150) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  senha_hash     VARCHAR(255) NOT NULL,
  tipo           ENUM('admin', 'gestor', 'tecnico') NOT NULL DEFAULT 'tecnico',
  telefone       VARCHAR(20),
  ativo          BOOLEAN DEFAULT TRUE,
  criado_em      DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PACIENTES: quem recebe o atendimento domiciliar
-- ------------------------------------------------------------
CREATE TABLE pacientes (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  nome                 VARCHAR(150) NOT NULL,
  idade                INT,
  endereco             VARCHAR(255),
  qr_code_id           VARCHAR(100) UNIQUE,         -- identificador do QR Code fixado na residência
  responsavel_contato  VARCHAR(150),
  observacoes_gerais   TEXT,
  ativo                BOOLEAN DEFAULT TRUE,
  criado_em            DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PROFISSIONAIS: técnicos/cuidadores vinculados a um usuário
-- ------------------------------------------------------------
CREATE TABLE profissionais (
  id                      INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id              INT NOT NULL,
  especialidade           VARCHAR(100),
  valor_hora              DECIMAL(10,2) DEFAULT 0,
  status_disponibilidade  ENUM('disponivel', 'em_plantao', 'indisponivel') DEFAULT 'disponivel',
  ativo                   BOOLEAN DEFAULT TRUE,
  criado_em               DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_profissional_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- ESCALAS: planejamento de quem atende quem, e quando
-- (CRUD principal exigido pelo projeto)
-- ------------------------------------------------------------
CREATE TABLE escalas (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  profissional_id   INT NOT NULL,
  paciente_id       INT NOT NULL,
  data_prevista     DATE NOT NULL,
  turno             ENUM('manha', 'tarde', 'noite', '12x36') NOT NULL,
  status            ENUM('agendado', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'agendado',
  observacoes       TEXT,
  criado_em         DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PLANTOES: execução real de uma escala (check-in / check-out)
-- ------------------------------------------------------------
CREATE TABLE plantoes (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  escala_id         INT NOT NULL,
  profissional_id   INT NOT NULL,
  paciente_id       INT NOT NULL,
  checkin_hora      DATETIME,
  checkin_lat       DECIMAL(10,7),
  checkin_lng       DECIMAL(10,7),
  checkin_metodo    ENUM('gps', 'qrcode'),
  checkout_hora     DATETIME,
  checkout_lat      DECIMAL(10,7),
  checkout_lng      DECIMAL(10,7),
  status            ENUM('em_andamento', 'finalizado') DEFAULT 'em_andamento',
  criado_em         DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_plantao_escala (escala_id),   -- uma escala gera no máximo um plantão
  FOREIGN KEY (escala_id) REFERENCES escalas(id) ON DELETE CASCADE,
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PRONTUARIOS: registro clínico padronizado por plantão
-- ------------------------------------------------------------
CREATE TABLE prontuarios (
  id                        INT AUTO_INCREMENT PRIMARY KEY,
  plantao_id                INT NOT NULL,
  pressao_arterial          VARCHAR(20),
  frequencia_cardiaca       INT,
  temperatura               DECIMAL(4,1),
  saturacao_oxigenio        INT,
  medicacao_administrada    TEXT,
  intercorrencias           TEXT,
  observacoes               TEXT,
  criado_em                 DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plantao_id) REFERENCES plantoes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PAGAMENTOS: fechamento financeiro mensal por profissional
-- ------------------------------------------------------------
CREATE TABLE pagamentos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  profissional_id   INT NOT NULL,
  mes_referencia    VARCHAR(7) NOT NULL,   -- formato '2026-10'
  qtd_plantoes      INT DEFAULT 0,
  valor_total       DECIMAL(10,2) DEFAULT 0,
  status            ENUM('pendente', 'pago') DEFAULT 'pendente',
  gerado_em         DATETIME DEFAULT CURRENT_TIMESTAMP,
  pago_em           DATETIME NULL,
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE,
  UNIQUE KEY uq_profissional_mes (profissional_id, mes_referencia)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Índices auxiliares para consultas frequentes
-- ------------------------------------------------------------
CREATE INDEX idx_escalas_data ON escalas(data_prevista);
CREATE INDEX idx_plantoes_profissional ON plantoes(profissional_id);
CREATE INDEX idx_pagamentos_mes ON pagamentos(mes_referencia);
