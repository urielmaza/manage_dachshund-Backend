const ClientsModels = require('../models/ClientsModels');
const emailService = require('../services/emailService');

// Obtener todos los clientes
async function getClients(req, res, next) {
	try {
		const clients = await ClientsModels.getAllClients();
		res.json(clients);
	} catch (error) {
		next(error);
	}
}

// Obtener cliente por ID
async function getClientById(req, res, next) {
	try {
		const client = await ClientsModels.getClientById(req.params.id);
		if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
		res.json(client);
	} catch (error) {
		next(error);
	}
}

// Crear cliente con activación por email
async function createClient(req, res, next) {
	try {
		console.log('Datos recibidos:', req.body);
		const newClient = await ClientsModels.createClient(req.body);
		
		// Enviar email de activación
		const emailResult = await emailService.sendActivationEmail(
			newClient.mail, 
			`${newClient.nombre} ${newClient.apellido}`,
			newClient.activation_token
		);
		
		if (emailResult.success) {
			res.status(201).json({
				success: true,
				message: 'Cuenta creada exitosamente. Revisa tu email para activar tu cuenta.',
				client: newClient,
				email_sent: true
			});
		} else {
			// Si falla el email, eliminar la cuenta creada
			await ClientsModels.deleteClient(newClient.idCliente);
			res.status(500).json({
				success: false,
				error: 'Error enviando email de activación',
				message: 'No se pudo enviar el email de activación. Inténtalo nuevamente.',
				email_error: emailResult.error
			});
		}
	} catch (error) {
		console.error('Error al crear cliente:', error);
		
		// Manejo específico para email duplicado
		if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('mail')) {
			return res.status(400).json({ 
				success: false,
				error: 'Email ya registrado',
				message: 'Ya existe un usuario registrado con ese email. Por favor, use un email diferente o inicie sesión.'
			});
		}
		
		// Manejo específico para DNI duplicado
		if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('dni')) {
			return res.status(400).json({ 
				success: false,
				error: 'DNI ya registrado',
				message: 'Ya existe un usuario registrado con ese DNI.'
			});
		}
		
		// Error genérico
		res.status(500).json({ 
			success: false,
			error: 'Error interno del servidor',
			message: 'Ocurrió un error al procesar el registro. Inténtelo nuevamente.'
		});
	}
}

// Actualizar cliente
async function updateClient(req, res, next) {
	try {
		const updated = await ClientsModels.updateClient(req.params.id, req.body);
		res.json(updated);
	} catch (error) {
		next(error);
	}
}

// Eliminar cliente
async function deleteClient(req, res, next) {
	try {
		await ClientsModels.deleteClient(req.params.id);
		res.json({ message: 'Cliente eliminado' });
	} catch (error) {
		next(error);
	}
}

// Login de cliente
async function loginClient(req, res, next) {
	try {
		const { email, password } = req.body;
		
		// Validar campos requeridos
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				error: 'Campos requeridos faltantes',
				message: 'Email y contraseña son requeridos'
			});
		}
		
		// Buscar cliente por email
		const client = await ClientsModels.getClientByEmail(email);
		if (!client) {
			return res.status(401).json({
				success: false,
				error: 'Credenciales inválidas',
				message: 'Email o contraseña incorrectos'
			});
		}
		
		// Verificar si la cuenta está activa
		if (!client.is_active) {
			return res.status(401).json({
				success: false,
				error: 'Cuenta no activada',
				message: 'Tu cuenta no ha sido activada. Revisa tu email y haz clic en el enlace de activación.'
			});
		}
		
		// Verificar contraseña
		const isValidPassword = await ClientsModels.verifyPassword(password, client.pass);
		if (!isValidPassword) {
			return res.status(401).json({
				success: false,
				error: 'Credenciales inválidas',
				message: 'Email o contraseña incorrectos'
			});
		}
		
		// Login exitoso - no devolver la contraseña
		const { pass: _, ...clientWithoutPassword } = client;
		res.json({
			success: true,
			message: 'Login exitoso',
			client: clientWithoutPassword
		});
		
	} catch (error) {
		console.error('Error en login:', error);
		res.status(500).json({
			success: false,
			error: 'Error interno del servidor',
			message: 'Ocurrió un error al procesar el login'
		});
	}
}

// Activar cuenta
async function activateAccount(req, res, next) {
	try {
		const { token } = req.params;
		
		if (!token) {
			return res.status(400).json({
				success: false,
				error: 'Token requerido',
				message: 'El token de activación es requerido'
			});
		}
		
		const result = await ClientsModels.activateAccount(token);
		
		if (result.success) {
			res.json({
				success: true,
				message: result.message,
				client: result.client
			});
		} else {
			res.status(400).json({
				success: false,
				error: result.error,
				message: result.message
			});
		}
		
	} catch (error) {
		console.error('Error en activación:', error);
		res.status(500).json({
			success: false,
			error: 'Error interno del servidor',
			message: 'Ocurrió un error al activar la cuenta'
		});
	}
}

module.exports = { getClients, getClientById, createClient, updateClient, deleteClient, loginClient, activateAccount };