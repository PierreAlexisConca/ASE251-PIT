-- Limpio: recrea la base y tablas necesarias para el proyecto
DROP DATABASE IF EXISTS [PIT];
CREATE DATABASE [PIT];
GO
USE [PIT];
GO

-- Eliminar tablas existentes en orden seguro
DROP TABLE IF EXISTS movimientos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS categorias;

DROP TABLE IF EXISTS lotes;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS secciones;

-- Categorías (valores del enum)
CREATE TABLE categorias (
	id INT IDENTITY PRIMARY KEY,
	nombre VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO categorias (nombre) VALUES ('GRANO'), ('INSUMO'), ('FERTILIZANTE'), ('HERRAMIENTA');

-- Productos
CREATE TABLE productos (
	id BIGINT IDENTITY PRIMARY KEY,
	codigo VARCHAR(50),
	nombre VARCHAR(100),
	detalle VARCHAR(255),
	categoria VARCHAR(50),
	stock INT,
	unidad VARCHAR(50),
	seccion VARCHAR(50),
	status VARCHAR(50)
);

-- Usuarios
CREATE TABLE usuarios (
	id BIGINT IDENTITY PRIMARY KEY,
	username VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	nombre VARCHAR(150),
	rol VARCHAR(50),
	activo BIT DEFAULT 1
);
-- Usuario de ejemplo (cambiar contraseña en producción)
INSERT INTO usuarios (username, password, nombre, rol) VALUES ('admin', 'admin', 'Administrador', 'ADMIN');

-- Movimientos (referencia a productos y usuarios)
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
	CONSTRAINT FK_mov_producto FOREIGN KEY (producto_id) REFERENCES productos(id),
	CONSTRAINT FK_mov_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Proveedores (opcional, para registro y reportes)
CREATE TABLE proveedores (
	id BIGINT IDENTITY PRIMARY KEY,
	nombre VARCHAR(200) UNIQUE NOT NULL,
	contacto VARCHAR(200),
	telefono VARCHAR(50),
	direccion VARCHAR(300)
);

-- Secciones del almacén (para capacidad y filtrado)
CREATE TABLE secciones (
	id INT IDENTITY PRIMARY KEY,
	nombre VARCHAR(100) UNIQUE NOT NULL,
	capacidad FLOAT NULL
);

-- Lotes / Batches para control de vencimiento
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
	CONSTRAINT FK_lote_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
);
