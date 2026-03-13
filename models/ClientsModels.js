
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Test rápido de bcrypt al cargar el módulo
(async () => {
	try {
		const testPassword = 'test123';
		const testHash = await bcrypt.hash(testPassword, 10);
	} catch (error) {
		console.error('❌ Error con bcrypt:', error);
	}
})();

// Modelo: obtener todos los clientes
async function getAllClients() {
	const [rows] = await db.query('SELECT idCliente, mail, pass, dni, nombre, apellido, telefono, direccion FROM cliente');
	return rows;
}

// Obtener cliente por ID
async function getClientById(id) {
	const [rows] = await db.query('SELECT idCliente, mail, pass, dni, nombre, apellido, telefono, direccion FROM cliente WHERE idCliente = ?', [id]);
	return rows[0];
}

// Crear cliente con activación por email
async function createClient(data) {
	const { mail, pass, dni, nombre, apellido, telefono, direccion } = data;
	// Campos opcionales (frontend ya no envía dni/telefono/direccion)
	// Si la DB exige NOT NULL, usar cadena vacía como valor por defecto
	const safeDni = typeof dni !== 'undefined' && dni !== null && String(dni).trim() !== '' ? dni : '';
	const safeTelefono = typeof telefono !== 'undefined' && telefono !== null && String(telefono).trim() !== '' ? telefono : '';
	const safeDireccion = typeof direccion !== 'undefined' && direccion !== null && String(direccion).trim() !== '' ? direccion : '';
	const { v4: uuidv4 } = require('uuid');
	
	console.log('Contraseña original:', pass);
	
	// Encriptar la contraseña antes de guardarla
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(pass, saltRounds);
	
	// Generar token de activación y fecha de expiración
	const activationToken = uuidv4();
	const tokenExpiration = new Date();
	tokenExpiration.setHours(tokenExpiration.getHours() + 24); // Expira en 24 horas
	
	console.log('Contraseña encriptada:', hashedPassword);
	console.log('Token de activación:', activationToken);
	
	const [result] = await db.query(
		`INSERT INTO cliente 
		(mail, pass, dni, nombre, apellido, telefono, direccion, is_active, activation_token, activation_token_expires) 
		VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, ?, ?)`,
		[mail, hashedPassword, safeDni, nombre, apellido, safeTelefono, safeDireccion, activationToken, tokenExpiration]
	);
	
	// No devolver la contraseña hasheada en la respuesta
	return { 
		idCliente: result.insertId, 
		mail,
		dni: safeDni,
		nombre,
		apellido,
		telefono: safeTelefono,
		direccion: safeDireccion,
		is_active: false,
		activation_token: activationToken,
		requires_activation: true
	};
}

// Actualizar cliente
async function updateClient(id, data) {
	const { mail, pass, dni, nombre, apellido, telefono, direccion } = data;
	
	let hashedPassword = pass;
	// Si se envía una nueva contraseña, encriptarla
	if (pass && pass.trim() !== '') {
		const saltRounds = 10;
		hashedPassword = await bcrypt.hash(pass, saltRounds);
	}
	
	await db.query(
		'UPDATE cliente SET mail=?, pass=?, dni=?, nombre=?, apellido=?, telefono=?, direccion=? WHERE idCliente=?',
		[mail, hashedPassword, dni, nombre, apellido, telefono, direccion, id]
	);
	const { pass: _, ...clientWithoutPassword } = data;
	return { idCliente: id, ...clientWithoutPassword };
}

// Obtener cliente por email para login
async function getClientByEmail(email) {
	const [rows] = await db.query('SELECT idCliente, mail, pass, dni, nombre, apellido, telefono, direccion, is_active FROM cliente WHERE mail = ?', [email]);
	return rows[0];
}

// Verificar contraseña
async function verifyPassword(plainPassword, hashedPassword) {
	return await bcrypt.compare(plainPassword, hashedPassword);
}

// Activar cuenta con token
async function activateAccount(token) {
	try {
		console.log('Buscando token:', token);
		
		// Primero buscar el token sin verificar expiración para debug
		const [allTokens] = await db.query(
			'SELECT idCliente, mail, nombre, is_active, activation_token, activation_token_expires FROM cliente WHERE activation_token = ?',
			[token]
		);
		
		console.log('Tokens encontrados:', allTokens);
		
		// Buscar el token y verificar que no haya expirado
		const [rows] = await db.query(
			'SELECT * FROM cliente WHERE activation_token = ? AND activation_token_expires > NOW()',
			[token]
		);
		
		console.log('Tokens válidos (no expirados):', rows);
		
		if (rows.length === 0) {
			// Si encontró el token pero está expirado
			if (allTokens.length > 0) {
				return { 
					success: false, 
					error: 'Token expirado',
					debug: { tokenFound: true, expired: true, tokenData: allTokens[0] }
				};
			} else {
				return { 
					success: false, 
					error: 'Token no encontrado',
					debug: { tokenFound: false, expired: false }
				};
			}
		}
		
		const client = rows[0];
		
		// Verificar si ya está activo
		if (client.is_active) {
			return { 
				success: false, 
				error: 'Cuenta ya activa',
				message: 'Esta cuenta ya ha sido activada previamente.'
			};
		}
		
		// Activar la cuenta
		await db.query(
			'UPDATE cliente SET is_active = TRUE, activation_token = NULL, activation_token_expires = NULL WHERE idCliente = ?',
			[client.idCliente]
		);
		
		return { 
			success: true, 
			message: 'Cuenta activada exitosamente',
			client: {
				idCliente: client.idCliente,
				mail: client.mail,
				nombre: client.nombre,
				apellido: client.apellido
			}
		};
		
	} catch (error) {
		console.error('Error activando cuenta:', error);
		return { 
			success: false, 
			error: 'Error interno',
			message: 'Ocurrió un error al activar la cuenta.'
		};
	}
}

// Eliminar cliente
async function deleteClient(id) {
	await db.query('DELETE FROM cliente WHERE idCliente=?', [id]);
	return { idCliente: id };
}

module.exports = { getAllClients, getClientById, createClient, updateClient, deleteClient, getClientByEmail, verifyPassword, activateAccount };
