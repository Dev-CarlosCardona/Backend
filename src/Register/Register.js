const { Kafeteriadb } = require('../db');
const mysql = require('mysql2');
const express = require('express');

const RegisterProduct = express.Router();
const cors = require('cors');

RegisterProduct.use(cors());
RegisterProduct.use(express.json());
RegisterProduct.use(express.urlencoded({ extended: false }));

const pool = mysql.createPool(Kafeteriadb);


RegisterProduct.get('/API/GET/ALL-PRODUCT/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            res.status(500).send('Error al obtener la conexión a la base de datos');
            return;
        }
        try {
            const sql = `SELECT * FROM productos`;
            connection.query(sql, (error, result) => {
                connection.release();

                if (error) {
                    console.error('Error en la consulta:', error);
                    res.status(500).send('Error en la consulta a la base de datos');
                } else {
                    // Devuelve un arreglo vacío si no hay resultados
                    res.status(200).json(result || []);
                }
            });
        } catch (error) {
            console.error('Error interno del servidor:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});

RegisterProduct.post('/API/POST/INSERT-PRODUCT/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor: ' + err.message,
            });
        }
        try {
            const Fecha_Creacion = req.body.Fecha_Creacion ? new Date(req.body.Fecha_Creacion) : new Date();

            const {
                Nombre_Producto,
                Referencia,
                Precio,
                Peso,
                Categoria,
                Estado_Producto,
                Cantidad,
            } = req.body;

            if (
                !Nombre_Producto || !Referencia || !Precio || !Peso || !Categoria || !Estado_Producto ||!Cantidad
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Por favor revisa los campos vacíos.',
                });
            }

            const sql = `INSERT INTO productos (
                            Nombre_Producto,
                            Referencia,
                            Precio,
                            Peso,
                            Categoria,
                            Fecha_Creacion,
                            Estado_Producto,
                            Cantidad
                        ) VALUES (?)`;

            const VALUES = [
                Nombre_Producto,
                Referencia,
                Precio,
                Peso,
                Categoria,
                Fecha_Creacion,
                Estado_Producto,
                Cantidad,
            ];

            connection.query(sql, [VALUES], (error, result) => {
                connection.release();
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error al insertar el nuevo registro: ' + error.message,
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Datos insertados correctamente',
                });
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor: ' + error.message,
            });
        }
    });
});

RegisterProduct.put('/API/PUT/UPDATE-PRODUCT/:id', (req, res) => {
    const id = req.params.id; // Obtiene el ID desde la URL
    console.log("ID recibido:", id); // Verifica que el ID no sea undefined

    const {
        Nombre_Producto,
        Referencia,
        Precio,
        Peso,
        Categoria,
        Estado_Producto,
        Cantidad,
    } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: 'ID del producto es requerido.' });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
        try {
            const sqlPutProduct = `
                UPDATE productos SET 
                    Nombre_Producto = ?,
                    Referencia = ?,
                    Precio = ?,
                    Peso = ?,
                    Categoria = ?,
                    Estado_Producto = ?,
                    Cantidad = ?
                WHERE id = ?;
            `;

            const VALUES = [
                Nombre_Producto,
                Referencia,
                Precio,
                Peso,
                Categoria,
                Estado_Producto,
                Cantidad,
                id, // Asegúrate de que el ID se pasa correctamente
            ];

            connection.query(sqlPutProduct, VALUES, (err, results) => {
                connection.release();
                if (err) {
                    console.error('Error de base de datos:', err);
                    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ success: false, message: 'No se encontró el registro para actualizar' });
                }

                return res.status(200).json({ success: true, message: 'Producto actualizado exitosamente' });
            });
        } catch (error) {
            console.error('Error en la actualización:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    });
});


RegisterProduct.delete('/API/DELETE/PRODUCT-DELETE/:id', (req, res) => {
    const id = req.params.id; // Obtén el ID desde los parámetros de la URL

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al conectar con la base de datos',
            });
        }
        try {
            const sqlDeleteProduct = `DELETE FROM productos WHERE id = ?`;

            connection.query(sqlDeleteProduct, [id], (error, results) => {
                connection.release(); // Libera la conexión

                if (error) {
                    console.error('Error al eliminar el producto:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error interno del servidor al eliminar el producto',
                    });
                }

                if (results.affectedRows === 0) {
                    // No se encontró el producto con ese ID
                    return res.status(404).json({
                        success: false,
                        message: 'No se encontró el producto para eliminar',
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Producto eliminado exitosamente',
                });
            });
        } catch (error) {
            console.error('Error interno del servidor:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    });
});

RegisterProduct.get('/API/GET/LIST/INVENTORY/STOCK/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            res.status(500).send('Error al obtener la conexión a la base de datos');
            return;
        }
        try {
            const sql = `SELECT Nombre_Producto, Referencia, Precio, Peso, Categoria FROM productos WHERE Estado_Producto = 'STOCK'`;
            connection.query(sql, (error, result) => {
                connection.release(); // Libera la conexión

                if (error) {
                    console.error('Error en la consulta:', error);
                    res.status(500).send('Error en la consulta a la base de datos');
                } else if (result.length > 0) {
                    res.status(200).json(result); // Enviar datos al cliente
                } else {
                    res.status(204).send('No hay resultados'); // Respuesta si no hay datos
                }
            });
        } catch (error) {
            console.error('Error interno del servidor:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});


module.exports = RegisterProduct;