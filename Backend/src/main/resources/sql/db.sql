-- =============================
-- 1. BORRADO Y CREACIÓN SEGURA
-- =============================
-- Ejecuta este bloque primero, desde la base 'master'
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'agro_db')
BEGIN
    CREATE DATABASE agro_db;
END
GO

USE master;
GO

CREATE TABLE categorias (
	id INT IDENTITY PRIMARY KEY,
	nombre VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE secciones (
	id INT IDENTITY PRIMARY KEY,
	nombre VARCHAR(100) UNIQUE NOT NULL,
	capacidad FLOAT NULL
);
CREATE TABLE productos (
	id BIGINT IDENTITY PRIMARY KEY,
	codigo VARCHAR(50),
	nombre VARCHAR(100),
	detalle VARCHAR(255),
	categoria_id INT NOT NULL,
	stock INT,
	unidad VARCHAR(50),
	seccion_id INT NOT NULL,
	status VARCHAR(50),
	
);
CREATE TABLE usuarios (
	id BIGINT IDENTITY PRIMARY KEY,
	username VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	nombre VARCHAR(150),
	rol VARCHAR(50),
	activo BIT DEFAULT 1
);
CREATE TABLE proveedores (
	id BIGINT IDENTITY PRIMARY KEY,
	nombre VARCHAR(200) UNIQUE NOT NULL,
	contacto VARCHAR(200),
	telefono VARCHAR(50),
	direccion VARCHAR(300)
);
CREATE TABLE lotes (
	id BIGINT IDENTITY PRIMARY KEY,
	producto_id BIGINT NOT NULL,
	codigo_lote VARCHAR(100),
	cantidad INT,
	unidad VARCHAR(50),
	fecha_ingreso DATETIME2 DEFAULT SYSUTCDATETIME(),
	fecha_vencimiento DATE NULL,
	proveedor VARCHAR(200),
	nota VARCHAR(255),
	
);
CREATE TABLE movimientos (
	id BIGINT IDENTITY PRIMARY KEY,
	producto_id BIGINT NOT NULL,
	usuario_id BIGINT NULL,
	tipo VARCHAR(20),
	cantidad INT NOT NULL,
	fecha DATETIME2 DEFAULT SYSUTCDATETIME(),
	nota VARCHAR(255),
	proveedor VARCHAR(200),
	documento VARCHAR(100),
	unidad VARCHAR(50),
	seccion VARCHAR(100),
	observaciones VARCHAR(500),
	
);
-- Usuario de ejemplo (cambiar contraseña en producción)
INSERT INTO usuarios (username, password, nombre, rol) VALUES ('admin', 'admin', 'Administrador', 'ADMIN');

-- =====================
-- DATOS DE EJEMPLO
-- =====================

-- Categorías adicionales
INSERT INTO categorias (nombre) VALUES 
('MAQUINARIA AGRÍCOLA'), ('SEMILLAS CERTIFICADAS'), ('PLAGUICIDAS ORGÁNICOS'), ('FUNGICIDAS ESPECIALES'),
('HERBICIDAS SELECTIVOS'), ('BIOESTIMULANTES FOLIARES'), ('MEJORADORES DE SUELO'), ('EQUIPOS DE RIEGO');

-- Usuarios
INSERT INTO usuarios  (username, password, nombre, rol) VALUES
('jlopez', 'campo2026', 'Juan López', 'ENCARGADO'),
('mvalle', 'trigo2026', 'María Valle', 'SUPERVISOR'),
('rquiroz', 'maiz2026', 'Ricardo Quiroz', 'ALMACENERO'),
('eavila', 'soja2026', 'Elena Ávila', 'USUARIO'),
('cchavez', 'papa2026', 'Carlos Chávez', 'USUARIO'),
('lreyes', 'arroz2026', 'Lucía Reyes', 'USUARIO'),
('fcastro', 'cebada2026', 'Fernando Castro', 'USUARIO'),
('dvera', 'girasol2026', 'Diana Vera', 'USUARIO'),
('gpalma', 'lenteja2026', 'Gabriel Palma', 'USUARIO'),
('srios', 'frijol2026', 'Sandra Ríos', 'USUARIO'),
('vdelgado', 'quinua2026', 'Víctor Delgado', 'USUARIO'),
('mparedes', 'triticale2026', 'Mónica Paredes', 'USUARIO');


-- Productos (usando IDs de categoria y seccion)
-- NOTA: Los IDs corresponden al orden de inserción en categorias y secciones
-- categorias: 1=GRANO, 2=INSUMO, 3=FERTILIZANTE, 4=HERRAMIENTA, 5=MAQUINARIA AGRÍCOLA, 6=SEMILLAS CERTIFICADAS, 7=PLAGUICIDAS ORGÁNICOS, 8=FUNGICIDAS ESPECIALES, 9=HERBICIDAS SELECTIVOS, 10=BIOESTIMULANTES FOLIARES, 11=MEJORADORES DE SUELO, 12=EQUIPOS DE RIEGO
-- secciones: 1=A, 2=B, 3=C, ...
INSERT INTO productos (codigo, nombre, detalle, categoria_id, stock, unidad, seccion_id, status) VALUES
('AG-100', 'Tractor John Deere 5075E', 'Tractor agrícola 75HP', 5, 3, 'unidad', 1, 'ACTIVO'),
('AG-101', 'Semilla de Maíz Híbrido', 'Bolsa 60.000 semillas', 6, 120, 'bolsa', 2, 'ACTIVO'),
('AG-102', 'Plaguicida Neem', 'Extracto natural de neem', 7, 50, 'litro', 3, 'ACTIVO'),
('AG-103', 'Fungicida Triazol', 'Control de hongos foliares', 8, 30, 'litro', 1, 'ACTIVO'),
('AG-104', 'Herbicida Selectivo', 'Para malezas de hoja ancha', 9, 40, 'litro', 2, 'ACTIVO'),
('AG-105', 'Bioestimulante Foliar', 'Mejora crecimiento vegetal', 10, 60, 'litro', 3, 'ACTIVO'),
('AG-106', 'Mejorador de Suelo', 'Aumenta retención de agua', 11, 25, 'saco', 1, 'ACTIVO'),
('AG-107', 'Aspersor de Riego', 'Aspersor circular metálico', 12, 80, 'unidad', 2, 'ACTIVO'),
('AG-108', 'Semilla de Trigo Premium', 'Bolsa 50kg', 6, 90, 'bolsa', 3, 'ACTIVO'),
('AG-109', 'Tractor Massey Ferguson 4707', 'Tractor agrícola 75HP', 5, 2, 'unidad', 1, 'ACTIVO'),
('AG-110', 'Herbicida Total', 'Control total de malezas', 9, 35, 'litro', 2, 'ACTIVO'),
('AG-111', 'Fungicida Sistémico', 'Control de oídio y roya', 8, 20, 'litro', 3, 'ACTIVO');

-- Proveedores
INSERT INTO proveedores (nombre, contacto, telefono, direccion) VALUES
('AgroInsumos S.A.', 'Pedro Gómez', '555-1234', 'Av. Agrícola 123'),
('CampoFértil Ltda.', 'Ana Torres', '555-5678', 'Calle Siembra 456'),
('Maquinarias del Valle', 'Luis Pérez', '555-9012', 'Av. Tractores 789'),
('Semillas Selectas', 'Marta Ruiz', '555-3456', 'Calle Semilla 321'),
('BioVerde', 'Jorge Salas', '555-7890', 'Av. Orgánica 654'),
('RiegoPlus', 'Patricia León', '555-2345', 'Calle Agua 987'),
('Fertilizantes Andinos', 'Raúl Castro', '555-6789', 'Av. Abono 159'),
('AgroQuímicos Sur', 'Cecilia Rivas', '555-4321', 'Calle Química 753'),
('Herramientas Pro', 'Oscar Medina', '555-8765', 'Av. Herramienta 852'),
('AgroLíder', 'Silvia Vargas', '555-2109', 'Calle Liderazgo 147'),
('Semillas del Norte', 'Iván Herrera', '555-6543', 'Av. Norte 369'),
('AgroRápido', 'Lorena Díaz', '555-0987', 'Calle Rápida 258');

-- Secciones
INSERT INTO secciones (nombre, capacidad) VALUES
('A', 1200), ('B', 950), ('C', 700), ('D', 500),
('E', 400), ('F', 350), ('G', 300), ('H', 250),
('I', 200), ('J', 150), ('K', 100), ('L', 80);

-- Lotes (asumiendo productos id 1-12)
INSERT INTO lotes (producto_id, codigo_lote, cantidad, unidad, proveedor, nota) VALUES
(1, 'L-AG100-01', 2, 'unidad', 'Maquinarias del Valle', 'Lote inicial de tractores'),
(2, 'L-AG101-01', 30, 'bolsa', 'Semillas Selectas', 'Lote de maíz híbrido'),
(3, 'L-AG102-01', 10, 'litro', 'BioVerde', 'Neem orgánico'),
(4, 'L-AG103-01', 8, 'litro', 'AgroQuímicos Sur', 'Fungicida triazol'),
(5, 'L-AG104-01', 12, 'litro', 'AgroQuímicos Sur', 'Herbicida selectivo'),
(6, 'L-AG105-01', 20, 'litro', 'BioVerde', 'Bioestimulante foliar'),
(7, 'L-AG106-01', 5, 'saco', 'Fertilizantes Andinos', 'Mejorador de suelo'),
(8, 'L-AG107-01', 40, 'unidad', 'RiegoPlus', 'Aspersores de riego'),
(9, 'L-AG108-01', 25, 'bolsa', 'Semillas del Norte', 'Trigo premium'),
(10, 'L-AG109-01', 1, 'unidad', 'Maquinarias del Valle', 'Tractor Massey Ferguson'),
(11, 'L-AG110-01', 15, 'litro', 'AgroQuímicos Sur', 'Herbicida total'),
(12, 'L-AG111-01', 7, 'litro', 'AgroQuímicos Sur', 'Fungicida sistémico');

-- Movimientos (asumiendo productos y usuarios id 1-12)
INSERT INTO movimientos (producto_id, usuario_id, tipo, cantidad, nota) VALUES
(1, 1, 'ENTRADA', 2, 'Ingreso de tractores nuevos'),
(2, 2, 'ENTRADA', 30, 'Ingreso de semillas de maíz'),
(3, 3, 'ENTRADA', 10, 'Ingreso de plaguicida neem'),
(4, 4, 'SALIDA', 2, 'Uso de fungicida en campo'),
(5, 5, 'SALIDA', 5, 'Aplicación de herbicida selectivo'),
(6, 6, 'ENTRADA', 20, 'Ingreso de bioestimulante'),
(7, 7, 'SALIDA', 3, 'Uso de mejorador de suelo'),
(8, 8, 'ENTRADA', 40, 'Ingreso de aspersores'),
(9, 9, 'SALIDA', 10, 'Entrega de trigo premium'),
(10, 10, 'ENTRADA', 1, 'Ingreso de tractor Massey Ferguson'),
(11, 11, 'SALIDA', 7, 'Aplicación de herbicida total'),
(12, 12, 'ENTRADA', 7, 'Ingreso de fungicida sistémico');

SELECT * FROM lotes
SELECT * FROM productos
SELECT * FROM secciones
SELECT * FROM movimientos
SELECT * FROM proveedores
SELECT * FROM usuarios