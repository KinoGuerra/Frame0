export async function authenticateFrame0(
  supabaseUrl: string,
  serviceRoleKey: string,
  usuario: string,
  password: string,
  roles: string[]
) {
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Falta configurar Supabase en la Edge Function.");
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/iniciar_sesion_frame0`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ p_usuario: usuario.trim(), p_password: password.trim() })
  });
  if (!response.ok) throw new Error("No se pudo validar la sesión.");
  const users = await response.json();
  const user = Array.isArray(users) ? users[0] : null;
  if (!user || !roles.includes(String(user.rol || ""))) throw new Error("Credenciales o rol no válidos.");
  return user;
}
