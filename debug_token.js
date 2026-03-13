const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

async function debugToken() {
    try {
        // Buscar todos los tokens de activación activos
        console.log('=== DEBUG TOKENS DE ACTIVACIÓN ===');
        
        const [allClients] = await db.query(
            'SELECT idCliente, mail, nombre, is_active, activation_token, activation_token_expires FROM cliente ORDER BY idCliente DESC'
        );
        
        console.log('\n📋 TODOS LOS CLIENTES:');
        allClients.forEach(client => {
            console.log(`ID: ${client.idCliente} | Email: ${client.mail} | Activo: ${client.is_active} | Token: ${client.activation_token ? client.activation_token.substring(0, 8) + '...' : 'NULL'} | Expira: ${client.activation_token_expires}`);
        });
        
        // Buscar específicamente tokens no expirados
        const [activeTokens] = await db.query(
            'SELECT idCliente, mail, nombre, activation_token, activation_token_expires FROM cliente WHERE activation_token IS NOT NULL AND activation_token_expires > NOW()'
        );
        
        console.log('\n TOKENS VÁLIDOS (NO EXPIRADOS):');
        if (activeTokens.length === 0) {
            console.log('No hay tokens válidos actualmente');
        } else {
            activeTokens.forEach(client => {
                console.log(`ID: ${client.idCliente} | Email: ${client.mail} | Token: ${client.activation_token} | Expira: ${client.activation_token_expires}`);
            });
        }
        
        // Buscar tokens expirados
        const [expiredTokens] = await db.query(
            'SELECT idCliente, mail, nombre, activation_token, activation_token_expires FROM cliente WHERE activation_token IS NOT NULL AND activation_token_expires <= NOW()'
        );
        
        console.log('\n⏰ TOKENS EXPIRADOS:');
        if (expiredTokens.length === 0) {
            console.log('No hay tokens expirados');
        } else {
            expiredTokens.forEach(client => {
                console.log(`ID: ${client.idCliente} | Email: ${client.mail} | Token: ${client.activation_token} | Expiró: ${client.activation_token_expires}`);
            });
        }
        
        // Verificar el token específico que estamos debugeando
        const specificToken = '0ae43084-b82c-4726-abcc-d7ad6ef6d4c0';
        console.log(`\n🎯 BUSCANDO TOKEN ESPECÍFICO: ${specificToken}`);
        
        const [specificResult] = await db.query(
            'SELECT * FROM cliente WHERE activation_token = ?',
            [specificToken]
        );
        
        if (specificResult.length === 0) {
            console.log('❌ Token específico NO encontrado');
        } else {
            console.log('✅ Token específico encontrado:');
            console.log(specificResult[0]);
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error en debug:', error);
        process.exit(1);
    }
}

debugToken();