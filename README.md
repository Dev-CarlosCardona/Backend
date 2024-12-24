# Prueba_Tecnica_Backend
Software inventario cafeteria backend

#en el partado .env solo se colocaria los datos de la base de datos 
Estos serian los Scripts para la creacionde la base y la tabla 
-- Crear la base de datos
CREATE DATABASE kafeteria;
CREATE TABLE productos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Producto VARCHAR(255) NOT NULL,
    Referencia VARCHAR(255),
    Precio INT NOT NULL,
    Peso INT,
    Categoria VARCHAR(255),
    Fecha_Creacion DATE,
    Estado_Producto VARCHAR(255) NOT NULL,
    Cantidad INT
);

#Adicional se iniciaria con el comando "npm run dev"
