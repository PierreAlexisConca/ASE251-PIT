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
