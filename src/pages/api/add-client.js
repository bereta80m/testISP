// src/pages/api/add-client.js

import pkg from 'node-routeros';
const { RouterOSAPI } = pkg;

export async function POST({ request }) {
  const { username, password, service, profile } = await request.json();

  // Configura la conexión al Mikrotik (o a un servidor intermedio conectado al Mikrotik)
  const client = new RouterOSAPI({
    host: "192.168.10.1",         // Elastic IP de tu servidor VPN en AWS
    user: "admin",             // Usuario configurado para API (por ejemplo, el usuario PAM 'vpnuser')
    password: "",            // Contraseña configurada para ese usuario
    port: 8728,                  // Puerto API del Mikrotik (ajústalo si es diferente)
  });

  try {
    // Conecta al dispositivo
    await client.connect();

    // Agrega un cliente PPP (secret) en el Mikrotik usando los datos recibidos
    await client.write("/ppp/secret/add", [
      `=name=${username}`,
      `=password=${password}`,
      `=service=${service || "pppoe"}`,    // Servicio por defecto: pppoe
      `=profile=${profile || "default"}`,  // Perfil por defecto: default
    ]);

    // Cierra la conexión
    client.close();
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error connecting to MikroTik:", error);
    return new Response(
      JSON.stringify({ error: "Error connecting to MikroTik" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
