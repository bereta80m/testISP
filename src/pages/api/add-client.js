// src/pages/api/add-client.js

// Import the module and extract RouterOSAPI (instead of RouterOSClient)
import pkg from 'node-routeros';
const { RouterOSAPI } = pkg;

export async function POST({ request }) {
  const { username, password, service, profile } = await request.json();

  // Configure the connection to your MikroTik router using RouterOSAPI
  const client = new RouterOSAPI({
    host: "152.167.228.15", // Replace with your router's IP
    user: "admin",         // Replace with your router's username
    password: "",          // Replace with your router's password
    port: 8728,            // Default API port
  });

  try {
    // Connect to the MikroTik router
    await client.connect();

    // Add a PPP client (secret) with the provided parameters.
    await client.write("/ppp/secret/add", [
      `=name=${username}`,
      `=password=${password}`,
      `=service=${service || "pppoe"}`,   // Default service: pppoe
      `=profile=${profile || "default"}`,  // Default profile: default
    ]);

    // Close the connection
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
