const ClientsModels = require('../models/ClientsModels');

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

// Crear cliente
async function createClient(req, res, next) {
	try {
		console.log('Datos recibidos:', req.body);
		const newClient = await ClientsModels.createClient(req.body);
		res.status(201).json({
			success: true,
			message: 'Cliente registrado exitosamente',
			client: newClient
		});
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

module.exports = { getClients, getClientById, createClient, updateClient, deleteClient, loginClient };