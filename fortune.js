// ============================================================
// FRAME0 - FORTUNA
// Portal de participantes, pronosticos, vouchers y constatacion.
// Sin backend local: toda operacion sensible se valida en Supabase.
// ============================================================

let fortuneParticipant = null;
let fortuneData = null;
let fortuneQrScanner = null;
let fortuneLastVoucher = null;
let constatadorDeliveryPage = 1;
let adminFortunaState = { seasons: [], types: [], vouchers: [], participants: [], failedReceipts: [], editingSeasonId: "", editingTypeId: "" };
let adminConstatadoresState = { items: [], editingId: "" };

const fortuneDateFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: "America/Argentina/Buenos_Aires",
  dateStyle: "short",
  timeStyle: "short"
});

function fortuneEscape(value = "") {
  return typeof escapeHtml === "function"
    ? escapeHtml(String(value ?? ""))
    : String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function fortuneFormatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : fortuneDateFormatter.format(date);
}

function fortuneToLocalInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function fortuneErrorMessage(error, fallback = "No se pudo completar la operación.") {
  const message = String(error?.message || fallback);
  if (/duplicate key|unique/i.test(message)) return "Ese documento, jugador o registro ya está en uso.";
  if (/email rate limit/i.test(message)) return "Se alcanzó el límite de emails. Intentá nuevamente más tarde.";
  if (/invalid login/i.test(message)) return "Email o contraseña incorrectos.";
  return message;
}

function fortuneSetAuthFeedback(message = "", state = "") {
  const feedback = document.querySelector("[data-participant-auth-feedback]");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.dataset.state = state;
}

function setParticipantAuthMode(mode = "login") {
  document.querySelectorAll("[data-participant-panel]").forEach((panel) => {
    panel.classList.toggle("d-none", panel.dataset.participantPanel !== mode);
  });
  document.querySelectorAll(".fortune-auth-switch [data-participant-mode]").forEach((button) => {
    const active = button.dataset.participantMode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  fortuneSetAuthFeedback();
}

function showParticipantAuth(mode = "login") {
  setParticipantAuthMode(mode);
  const modalElement = document.querySelector("#participantAuthModal");
  if (modalElement) bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

async function getFortuneParticipantProfile() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) return null;
  const { data, error } = await supabaseClient
    .from("participantes")
    .select("id,nombre,apellido,documento,activo,created_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.activo ? data : null;
}

async function loadParticipantVouchers() {
  const baseColumns = "id,tipo_voucher_id,temporada_id,codigo,producto_nombre,costo_puntos,emitido_at,vence_at,estado,usado_at,motivo_anulacion";
  let result = await supabaseClient.from("vouchers_emitidos")
    .select(`${baseColumns},producto_descripcion`).eq("participante_id", fortuneParticipant.id).order("emitido_at", { ascending: false });
  if (["42703", "PGRST204"].includes(result.error?.code)) {
    result = await supabaseClient.from("vouchers_emitidos")
      .select(baseColumns).eq("participante_id", fortuneParticipant.id).order("emitido_at", { ascending: false });
  }
  return result;
}

async function loadFortuneData() {
  if (!fortuneParticipant?.id) throw new Error("La sesión de Fortuna no está disponible.");

  const [seasonsResult, predictionsResult, pointsResult, vouchersResult, typesResult, requestsResult, matchesResult, teamsResult] = await Promise.all([
    supabaseClient.from("temporadas_fortuna").select("id,nombre,inicia_at,finaliza_at,estado,created_at").order("inicia_at", { ascending: false }),
    supabaseClient.from("pronosticos_fortuna").select("id,temporada_id,partido_id,goles_local,goles_visitante,created_at,updated_at").eq("participante_id", fortuneParticipant.id).order("updated_at", { ascending: false }),
    supabaseClient.from("puntajes_fortuna").select("id,pronostico_id,temporada_id,puntos,goles_local_final,goles_visitante_final,evaluated_at").eq("participante_id", fortuneParticipant.id),
    loadParticipantVouchers(),
    supabaseClient.from("tipos_voucher").select("id,nombre,descripcion,costo_puntos,stock_total,vigencia_dias,activo").eq("activo", true).order("costo_puntos"),
    supabaseClient.from("solicitudes_vinculo_jugador").select("id,jugador_id,estado,motivo,created_at,reviewed_at").eq("participante_id", fortuneParticipant.id).order("created_at", { ascending: false }),
    queryCurrentMatches((hasArchiveColumn) => {
      let query = supabaseClient.from("partidos").select("id,division_id,equipo_local_id,equipo_visitante_id,fecha_hora,cancha,goles_local,goles_visitante,estado").order("fecha_hora", { ascending: true });
      if (hasArchiveColumn) query = query.eq("archivado", false);
      return query;
    }),
    supabaseClient.from("equipos").select("id,nombre,nombre_corto,abreviatura,activo").eq("activo", true).order("nombre")
  ]);

  const results = [seasonsResult, predictionsResult, pointsResult, vouchersResult, typesResult, requestsResult, matchesResult, teamsResult];
  const failed = results.find((result) => result.error);
  if (failed) throw failed.error;

  const now = Date.now();
  const seasons = seasonsResult.data || [];
  const activeSeason = seasons.find((season) => season.estado === "activa" && now >= Date.parse(season.inicia_at) && now < Date.parse(season.finaliza_at)) || null;
  const teams = teamsResult.data || [];
  const teamMap = new Map(teams.map((team) => [team.id, team]));

  fortuneData = {
    seasons,
    activeSeason,
    predictions: predictionsResult.data || [],
    points: pointsResult.data || [],
    vouchers: vouchersResult.data || [],
    types: typesResult.data || [],
    requests: requestsResult.data || [],
    matches: matchesResult.data || [],
    teams,
    teamMap
  };
  return fortuneData;
}

function fortuneTeamName(teamId) {
  const team = fortuneData?.teamMap?.get(teamId);
  return team?.nombre_corto || team?.abreviatura || team?.nombre || "Equipo";
}

function fortuneBalance() {
  const seasonId = fortuneData?.activeSeason?.id;
  if (!seasonId) return { earned: 0, spent: 0, balance: 0 };
  const earned = fortuneData.points.filter((point) => point.temporada_id === seasonId).reduce((sum, point) => sum + Number(point.puntos || 0), 0);
  const spent = fortuneData.vouchers.filter((voucher) => voucher.temporada_id === seasonId).reduce((sum, voucher) => sum + Number(voucher.costo_puntos || 0), 0);
  return { earned, spent, balance: earned - spent };
}

function renderFortuneShellHeader(title, subtitle = "") {
  const balance = fortuneBalance();
  return `
    <div class="section-toolbar admin-toolbar fortune-toolbar">
      <div>
        <p class="section-kicker section-brand mb-1">Fortuna Frame0</p>
        <h2 class="section-title mb-0">${fortuneEscape(title)}</h2>
        ${subtitle ? `<p class="fortune-toolbar-copy">${fortuneEscape(subtitle)}</p>` : ""}
      </div>
      <div class="fortune-balance-chip"><span>Saldo</span><strong>${balance.balance}</strong><small>puntos</small></div>
    </div>
  `;
}

function renderFortuneEmpty(icon, title, message) {
  return `<div class="fortune-empty"><i class="bi ${icon}" aria-hidden="true"></i><h3>${fortuneEscape(title)}</h3><p>${fortuneEscape(message)}</p></div>`;
}

function renderFortunePredictions() {
  const season = fortuneData.activeSeason;
  if (!season) {
    return `${renderFortuneShellHeader("Pronósticos")}${renderFortuneEmpty("bi-calendar-x", "No hay una campaña activa", "El administrador publicará la próxima temporada de Fortuna.")}`;
  }

  const predictions = new Map(fortuneData.predictions.filter((item) => item.temporada_id === season.id).map((item) => [item.partido_id, item]));
  const now = Date.now();
  const matches = fortuneData.matches.filter((match) => {
    if (match.estado !== "programado" || !match.fecha_hora) return false;
    return Date.parse(match.fecha_hora) < Date.parse(season.finaliza_at) && Date.parse(match.fecha_hora) > now;
  });

  const cards = matches.map((match) => {
    const prediction = predictions.get(match.id);
    const closesAt = Date.parse(match.fecha_hora) - 30 * 60 * 1000;
    const open = now < closesAt;
    return `
      <article class="fortune-slip ${open ? "" : "is-locked"}" data-prediction-card="${match.id}">
        <div class="fortune-slip-edge" aria-hidden="true"></div>
        <header>
          <div><span>${fortuneEscape(match.cancha || "Cancha a confirmar")}</span><strong>${fortuneFormatDate(match.fecha_hora)}</strong></div>
          <span class="fortune-lock-state"><i class="bi ${open ? "bi-clock" : "bi-lock-fill"}"></i>${open ? `Cierra ${fortuneFormatDate(new Date(closesAt))}` : "Pronóstico cerrado"}</span>
        </header>
        <div class="fortune-score-line">
          <div class="fortune-team fortune-team-home"><strong>${fortuneEscape(fortuneTeamName(match.equipo_local_id))}</strong><small>Local</small></div>
          <label><span class="visually-hidden">Goles local</span><input type="number" min="0" max="99" inputmode="numeric" value="${prediction?.goles_local ?? ""}" data-prediction-home ${open ? "" : "disabled"}></label>
          <span class="fortune-score-divider">:</span>
          <label><span class="visually-hidden">Goles visitante</span><input type="number" min="0" max="99" inputmode="numeric" value="${prediction?.goles_visitante ?? ""}" data-prediction-away ${open ? "" : "disabled"}></label>
          <div class="fortune-team fortune-team-away"><strong>${fortuneEscape(fortuneTeamName(match.equipo_visitante_id))}</strong><small>Visitante</small></div>
        </div>
        <footer>
          <span>${prediction ? `Guardado ${fortuneFormatDate(prediction.updated_at)}` : "Todavía no jugaste esta boleta"}</span>
          <button class="btn btn-sm btn-fortuna-action" type="button" data-save-prediction="${match.id}" ${open ? "" : "disabled"}>${prediction ? "Actualizar" : "Guardar pronóstico"}</button>
        </footer>
      </article>
    `;
  }).join("");

  return `
    ${renderFortuneShellHeader("Pronósticos", `${season.nombre} · acertá la tendencia por 2 puntos o el resultado exacto por 5.`)}
    <div class="fortune-rule-strip"><span><strong>2</strong> ganador o empate</span><span><strong>5</strong> resultado exacto</span><span><i class="bi bi-lock-fill"></i> cierre 30 minutos antes</span></div>
    <section class="fortune-slip-list">${cards || renderFortuneEmpty("bi-calendar2-week", "No hay partidos disponibles", "Volvé cuando la organización publique nuevos horarios.")}</section>
  `;
}

function fortuneVoucherStatus(voucher) {
  if (voucher.estado === "anulado") return "anulado";
  if (voucher.estado === "usado") return "usado";
  if (Date.parse(voucher.vence_at) <= Date.now()) return "vencido";
  return "vigente";
}

function renderFortuneVoucherCard(voucher, showQr = true) {
  const status = fortuneVoucherStatus(voucher);
  return `
    <article class="fortune-ticket is-${status}">
      <div class="fortune-ticket-main">
        <span class="fortune-ticket-label">Voucher personal</span>
        <h3>${fortuneEscape(voucher.producto_nombre)}</h3>
        ${voucher.producto_descripcion ? `<p>${fortuneEscape(voucher.producto_descripcion)}</p>` : ""}
        <p class="fortune-ticket-code">${fortuneEscape(voucher.codigo)}</p>
        <dl><div><dt>Emitido</dt><dd>${fortuneFormatDate(voucher.emitido_at)}</dd></div><div><dt>Vence</dt><dd>${fortuneFormatDate(voucher.vence_at)}</dd></div></dl>
        <span class="fortune-ticket-status">${status}</span>
      </div>
      ${showQr && status === "vigente" ? `<div class="fortune-ticket-qr" data-voucher-qr="${fortuneEscape(voucher.codigo)}" aria-label="Código QR del voucher"></div>` : ""}
    </article>
  `;
}

function renderFortuneVouchers() {
  const balance = fortuneBalance();
  const catalog = fortuneData.types.map((type) => `
    <article class="fortune-reward-card">
      <div class="fortune-reward-cost"><strong>${type.costo_puntos}</strong><span>puntos</span></div>
      <div><h3>${fortuneEscape(type.nombre)}</h3><p>${fortuneEscape(type.descripcion || "Premio disponible para canjear.")}</p><small>Válido ${type.vigencia_dias} días desde el canje · stock sujeto a disponibilidad</small></div>
      <button class="btn btn-fortuna-action" type="button" data-redeem-voucher="${type.id}" ${fortuneData.activeSeason && balance.balance >= type.costo_puntos ? "" : "disabled"}>Canjear</button>
    </article>
  `).join("");

  const issued = fortuneData.vouchers.map((voucher) => renderFortuneVoucherCard(voucher)).join("");
  return `
    ${renderFortuneShellHeader("Vouchers", "Canjeá tus puntos y presentá el código junto con tu documento.")}
    <section class="fortune-section-block"><div class="fortune-section-heading"><p class="section-kicker mb-1">Catálogo</p><h3>Premios disponibles</h3></div><div class="fortune-reward-grid">${catalog || renderFortuneEmpty("bi-gift", "No hay premios activos", "El catálogo se actualizará próximamente.")}</div></section>
    <section class="fortune-section-block"><div class="fortune-section-heading"><p class="section-kicker mb-1">Mis canjes</p><h3>Vouchers emitidos</h3></div><div class="fortune-ticket-grid">${issued || renderFortuneEmpty("bi-ticket-perforated", "Todavía no canjeaste", "Tus vouchers aparecerán aquí.")}</div></section>
  `;
}

function renderFortunePoints() {
  const balance = fortuneBalance();
  const pointMap = new Map(fortuneData.points.map((point) => [point.pronostico_id, point]));
  const matchMap = new Map(fortuneData.matches.map((match) => [match.id, match]));
  const rows = fortuneData.predictions.filter((prediction) => prediction.temporada_id === fortuneData.activeSeason?.id).map((prediction) => {
    const point = pointMap.get(prediction.id);
    const match = matchMap.get(prediction.partido_id);
    return `
      <tr>
        <td>${fortuneFormatDate(match?.fecha_hora)}</td>
        <td>${fortuneEscape(fortuneTeamName(match?.equipo_local_id))} vs ${fortuneEscape(fortuneTeamName(match?.equipo_visitante_id))}</td>
        <td>${prediction.goles_local} - ${prediction.goles_visitante}</td>
        <td>${point ? `${point.goles_local_final} - ${point.goles_visitante_final}` : "Pendiente"}</td>
        <td><strong>${point?.puntos ?? "-"}</strong></td>
      </tr>`;
  }).join("");
  return `
    ${renderFortuneShellHeader("Mis puntos", "El saldo pertenece a la campaña activa y vence cuando termina.")}
    <div class="fortune-ledger-summary"><div><span>Ganados</span><strong>${balance.earned}</strong></div><div><span>Canjeados</span><strong>${balance.spent}</strong></div><div class="is-balance"><span>Disponibles</span><strong>${balance.balance}</strong></div></div>
    <section class="division-table-panel"><div class="table-responsive"><table class="table frame-table mb-0"><thead><tr><th>Partido</th><th>Encuentro</th><th>Pronóstico</th><th>Final</th><th>PTS</th></tr></thead><tbody>${rows || `<tr><td colspan="5" class="admin-empty-row">Todavía no cargaste pronósticos.</td></tr>`}</tbody></table></div></section>
  `;
}

async function loadFortunePlayerOptions() {
  const [{ data: players, error: playersError }, { data: teams, error: teamsError }] = await Promise.all([
    supabaseClient.rpc("listar_jugadores_publicos", { p_equipo_ids: null }),
    supabaseClient.from("equipos").select("id,nombre,nombre_corto,activo").eq("activo", true).order("nombre")
  ]);
  if (playersError) throw playersError;
  if (teamsError) throw teamsError;
  return { players: players || [], teams: teams || [] };
}

async function renderFortuneProfile() {
  const latestRequest = fortuneData.requests[0] || null;
  let linkForm = "";
  if (!latestRequest || latestRequest.estado === "rechazada") {
    const { players, teams } = await loadFortunePlayerOptions();
    linkForm = `
      <form class="fortune-player-link-form" data-player-link-form>
        <label><span>Equipo</span><select class="form-select" data-player-link-team required><option value="">Seleccionar equipo</option>${teams.map((team) => `<option value="${team.id}">${fortuneEscape(team.nombre_corto || team.nombre)}</option>`).join("")}</select></label>
        <label><span>Jugador</span><select class="form-select" data-player-link-player required disabled><option value="">Seleccionar jugador</option>${players.map((player) => `<option value="${player.id}" data-team-id="${player.equipo_id}">${fortuneEscape(`${player.apellido}, ${player.nombre}${player.dorsal ? ` · #${player.dorsal}` : ""}`)}</option>`).join("")}</select></label>
        <button class="btn btn-fortuna-action" type="submit">Solicitar vínculo</button>
      </form>`;
  }
  const statusLabel = latestRequest ? ({ pendiente: "Pendiente de revisión", aprobada: "Jugador vinculado", rechazada: "Solicitud rechazada" })[latestRequest.estado] : "Sin vínculo";
  return `
    ${renderFortuneShellHeader("Mi cuenta")}
    <div class="fortune-profile-grid">
      <section class="fortune-profile-card"><p class="section-kicker mb-1">Titular</p><h3>${fortuneEscape(`${fortuneParticipant.nombre} ${fortuneParticipant.apellido}`)}</h3><dl><div><dt>Documento</dt><dd>${fortuneEscape(fortuneParticipant.documento)}</dd></div><div><dt>Alta</dt><dd>${fortuneFormatDate(fortuneParticipant.created_at)}</dd></div></dl><small>El documento no puede modificarse desde el portal porque identifica tus vouchers personales.</small></section>
      <section class="fortune-profile-card"><p class="section-kicker mb-1">Jugador del torneo</p><h3>${fortuneEscape(statusLabel)}</h3>${latestRequest?.motivo ? `<p>${fortuneEscape(latestRequest.motivo)}</p>` : ""}${linkForm || `<p>La solicitud fue enviada al delegado del equipo.</p>`}</section>
    </div>
  `;
}

function renderFortuneQrs() {
  if (typeof QRCode === "undefined") return;
  document.querySelectorAll("[data-voucher-qr]").forEach((container) => {
    if (container.childElementCount) return;
    new QRCode(container, { text: container.dataset.voucherQr, width: 116, height: 116, correctLevel: QRCode.CorrectLevel.M });
  });
}

async function showFortunePage(page = "predictions") {
  const shell = document.querySelector("#contentShell");
  if (!shell || !fortuneParticipant) return;
  shell.innerHTML = typeof renderProfileLoader === "function" ? renderProfileLoader("Fortuna") : "Cargando...";
  try {
    await loadFortuneData();
    if (page === "vouchers") shell.innerHTML = renderFortuneVouchers();
    else if (page === "points") shell.innerHTML = renderFortunePoints();
    else if (page === "profile") shell.innerHTML = await renderFortuneProfile();
    else shell.innerHTML = renderFortunePredictions();
    renderFortuneQrs();
  } catch (error) {
    shell.innerHTML = renderFortuneEmpty("bi-exclamation-triangle-fill", "No se pudo cargar Fortuna", fortuneErrorMessage(error));
  }
}

async function enterFortuneParticipantView(profile = fortuneParticipant) {
  fortuneParticipant = profile || await getFortuneParticipantProfile();
  if (!fortuneParticipant) {
    showParticipantAuth();
    return;
  }
  document.body.classList.add("admin-view", "fortune-view");
  document.body.classList.remove("delegate-view", "constatador-view");
  const sidebar = document.querySelector("#sidebarContent");
  sidebar.innerHTML = `
    <div class="sidebar-main admin-sidebar-main fortune-sidebar">
      <div>
        <div class="sidebar-heading"><i class="bi bi-stars"></i><h2>Fortuna</h2></div>
        <div class="sidebar-role-label">${fortuneEscape(fortuneParticipant.nombre)} · Participante</div>
        <div class="admin-actions">
          <button class="division-link" type="button" data-fortune-page="predictions"><i class="bi bi-ui-checks-grid"></i> Pronósticos</button>
          <button class="division-link" type="button" data-fortune-page="points"><i class="bi bi-coin"></i> Mis puntos</button>
          <button class="division-link" type="button" data-fortune-page="vouchers"><i class="bi bi-ticket-perforated-fill"></i> Vouchers</button>
          <button class="division-link" type="button" data-fortune-page="profile"><i class="bi bi-person-circle"></i> Mi cuenta</button>
          ${typeof renderThemeMenuButton === "function" ? renderThemeMenuButton() : ""}
        </div>
      </div>
      <button class="btn btn-ingreso w-100" type="button" data-admin-logout><i class="bi bi-box-arrow-left"></i> Salir</button>
    </div>`;
  await showFortunePage("predictions");
}

async function saveFortunePrediction(matchId) {
  const card = document.querySelector(`[data-prediction-card="${CSS.escape(matchId)}"]`);
  const homeValue = card?.querySelector("[data-prediction-home]")?.value.trim() || "";
  const awayValue = card?.querySelector("[data-prediction-away]")?.value.trim() || "";
  if (!card || !/^\d{1,2}$/.test(homeValue) || !/^\d{1,2}$/.test(awayValue)) {
    throw new Error("Ingresá un resultado válido para ambos equipos.");
  }
  const home = Number(homeValue);
  const away = Number(awayValue);
  const { error } = await supabaseClient.rpc("guardar_pronostico_fortuna", { p_partido_id: matchId, p_goles_local: home, p_goles_visitante: away });
  if (error) throw error;
  await showFortunePage("predictions");
}

async function redeemFortuneVoucher(typeId) {
  const type = fortuneData.types.find((item) => item.id === typeId);
  if (!type) return;
  const confirmed = await requestConfirmation({
    kicker: "Fortuna", title: "Confirmar canje",
    message: `Canjear ${type.costo_puntos} puntos por “${type.nombre}”. Los puntos no se reintegran si el voucher vence o es anulado.`,
    confirmLabel: "Canjear voucher", icon: "bi-ticket-perforated-fill"
  });
  if (!confirmed) return;
  const { data, error } = await supabaseClient.rpc("canjear_voucher", { p_tipo_voucher_id: typeId });
  if (error) throw error;
  fortuneLastVoucher = data;
  await showFortunePage("vouchers");
  alert("Voucher emitido. El comprobante quedó registrado para su envío por correo.");
}

// ----------------------------
// DELEGADO
// ----------------------------

async function renderDelegateFortunaRequestsView() {
  if (!delegateSettingsSession?.usuario || !delegateSettingsSession?.password) throw new Error("La sesión de delegado expiró.");
  const { data, error } = await supabaseClient.rpc("listar_solicitudes_jugador_delegado", {
    p_usuario: delegateSettingsSession.usuario,
    p_password: delegateSettingsSession.password
  });
  if (error) throw error;
  const rows = (data || []).map((request) => `
    <tr><td>${fortuneEscape(`${request.participante.apellido}, ${request.participante.nombre}`)}</td><td>${fortuneEscape(request.participante.documento)}</td><td>${fortuneEscape(`${request.jugador.apellido}, ${request.jugador.nombre}`)}</td><td>${fortuneEscape(request.jugador.dni || "-")}</td><td>${fortuneFormatDate(request.created_at)}</td><td><div class="table-actions"><button class="table-action-btn is-success" type="button" title="Aprobar" data-resolve-player-request="${request.id}" data-approve="true"><i class="bi bi-check-lg"></i></button><button class="table-action-btn is-danger" type="button" title="Rechazar" data-resolve-player-request="${request.id}" data-approve="false"><i class="bi bi-x-lg"></i></button></div></td></tr>`).join("");
  return `
    <div class="section-toolbar admin-toolbar"><div><p class="section-kicker section-brand mb-1">Fortuna</p><h2 class="section-title mb-0">Solicitudes de jugadores</h2></div></div>
    <section class="division-table-panel"><div class="division-section-heading"><p class="section-kicker mb-1">Mi equipo</p><h2>Vínculos pendientes</h2></div><div class="table-responsive"><table class="table frame-table mb-0"><thead><tr><th>Participante</th><th>Documento</th><th>Jugador</th><th>DNI ficha</th><th>Solicitud</th><th>Acciones</th></tr></thead><tbody>${rows || `<tr><td colspan="6" class="admin-empty-row">No hay solicitudes pendientes.</td></tr>`}</tbody></table></div></section>`;
}

async function resolveDelegatePlayerRequest(id, approve) {
  const confirmed = await requestConfirmation({
    kicker: "Delegado", title: approve ? "Aprobar vínculo" : "Rechazar vínculo",
    message: approve ? "La cuenta quedará identificada como este jugador." : "La persona podrá enviar una nueva solicitud.",
    confirmLabel: approve ? "Aprobar" : "Rechazar", icon: approve ? "bi-person-check-fill" : "bi-person-x-fill"
  });
  if (!confirmed) return;
  const { error } = await supabaseClient.rpc("resolver_solicitud_jugador_delegado", {
    p_usuario: delegateSettingsSession.usuario,
    p_password: delegateSettingsSession.password,
    p_solicitud_id: id,
    p_aprobar: approve,
    p_motivo: approve ? null : "Solicitud rechazada por el delegado del equipo."
  });
  if (error) throw error;
  document.querySelector("#contentShell").innerHTML = await renderDelegateFortunaRequestsView();
}

// ----------------------------
// ADMINISTRADOR
// ----------------------------

async function loadAdminFortunaState() {
  const [seasons, types, vouchers, participants, failedReceipts] = await Promise.all([
    supabaseClient.from("temporadas_fortuna").select("*").order("inicia_at", { ascending: false }),
    supabaseClient.from("tipos_voucher").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("vouchers_emitidos").select("*").order("emitido_at", { ascending: false }).limit(300),
    supabaseClient.from("participantes").select("id,nombre,apellido,documento").order("apellido"),
    supabaseClient.from("comprobantes_fortuna").select("id,codigo,destino_email,tipo,intentos,ultimo_error,created_at").eq("estado", "fallido").order("created_at", { ascending: false }).limit(100)
  ]);
  const failed = [seasons, types, vouchers, participants, failedReceipts].find((result) => result.error);
  if (failed) throw failed.error;
  adminFortunaState.seasons = seasons.data || [];
  adminFortunaState.types = types.data || [];
  adminFortunaState.vouchers = vouchers.data || [];
  adminFortunaState.participants = participants.data || [];
  adminFortunaState.failedReceipts = failedReceipts.data || [];
}

function renderAdminFortunaSeasonForm() {
  const item = adminFortunaState.seasons.find((season) => season.id === adminFortunaState.editingSeasonId) || {};
  return `<form class="fortune-admin-form" data-admin-season-form><input type="hidden" name="id" value="${item.id || ""}"><label><span>Nombre</span><input class="form-control" name="nombre" type="text" value="${fortuneEscape(item.nombre || "")}" required></label><label><span>Inicio</span><input class="form-control" name="inicia_at" type="datetime-local" value="${fortuneToLocalInput(item.inicia_at)}" required></label><label><span>Fin</span><input class="form-control" name="finaliza_at" type="datetime-local" value="${fortuneToLocalInput(item.finaliza_at)}" required></label><label><span>Estado</span><select class="form-select" name="estado"><option value="borrador" ${item.estado !== "activa" ? "selected" : ""}>Borrador</option><option value="activa" ${item.estado === "activa" ? "selected" : ""}>Activa</option></select></label><button class="btn btn-fortuna-action" type="submit"><i class="bi bi-save-fill"></i> ${item.id ? "Guardar" : "Crear campaña"}</button>${item.id ? `<button class="btn btn-outline-secondary" type="button" data-cancel-admin-fortuna-edit="season">Cancelar</button>` : ""}</form>`;
}

function renderAdminFortunaTypeForm() {
  const item = adminFortunaState.types.find((type) => type.id === adminFortunaState.editingTypeId) || {};
  return `<form class="fortune-admin-form" data-admin-voucher-type-form><input type="hidden" name="id" value="${item.id || ""}"><label><span>Producto</span><input class="form-control" name="nombre" type="text" value="${fortuneEscape(item.nombre || "")}" required></label><label class="fortune-admin-wide"><span>Descripción</span><input class="form-control" name="descripcion" type="text" value="${fortuneEscape(item.descripcion || "")}"></label><label><span>Costo en puntos</span><input class="form-control" name="costo" type="number" min="1" value="${item.costo_puntos || 1}" required></label><label><span>Stock total</span><input class="form-control" name="stock" type="number" min="0" value="${item.stock_total ?? 0}" required></label><label><span>Vigencia en días</span><input class="form-control" name="vigencia" type="number" min="1" max="3650" value="${item.vigencia_dias || 30}" required></label><button class="btn btn-fortuna-action" type="submit"><i class="bi bi-save-fill"></i> ${item.id ? "Guardar" : "Crear voucher"}</button>${item.id ? `<button class="btn btn-outline-secondary" type="button" data-cancel-admin-fortuna-edit="type">Cancelar</button>` : ""}</form>`;
}

async function renderAdminFortunaView() {
  await loadAdminFortunaState();
  const participants = new Map(adminFortunaState.participants.map((item) => [item.id, item]));
  const seasonRows = adminFortunaState.seasons.map((item) => `<tr><td>${fortuneEscape(item.nombre)}</td><td>${fortuneFormatDate(item.inicia_at)}</td><td>${fortuneFormatDate(item.finaliza_at)}</td><td><span class="fortune-status is-${item.estado}">${item.estado}</span></td><td><div class="table-actions">${item.estado !== "cerrada" ? `<button class="table-action-btn" type="button" data-edit-fortuna-season="${item.id}" title="Editar"><i class="bi bi-pencil-fill"></i></button><button class="table-action-btn is-danger" type="button" data-close-fortuna-season="${item.id}" title="Cerrar"><i class="bi bi-lock-fill"></i></button>` : ""}</div></td></tr>`).join("");
  const typeRows = adminFortunaState.types.map((item) => `<tr><td>${fortuneEscape(item.nombre)}</td><td>${item.costo_puntos}</td><td>${item.stock_total}</td><td>${item.vigencia_dias} días</td><td>${item.activo ? "Activo" : "Baja"}</td><td><div class="table-actions"><button class="table-action-btn" type="button" data-edit-voucher-type="${item.id}" title="Editar"><i class="bi bi-pencil-fill"></i></button><button class="table-action-btn ${item.activo ? "is-danger" : "is-success"}" type="button" data-toggle-voucher-type="${item.id}" data-active="${item.activo ? "false" : "true"}" title="${item.activo ? "Dar de baja" : "Reactivar"}"><i class="bi ${item.activo ? "bi-slash-circle" : "bi-arrow-counterclockwise"}"></i></button></div></td></tr>`).join("");
  const voucherRows = adminFortunaState.vouchers.map((item) => { const owner = participants.get(item.participante_id); const status = fortuneVoucherStatus(item); return `<tr><td>${fortuneEscape(item.codigo)}</td><td>${fortuneEscape(item.producto_nombre)}</td><td>${fortuneEscape(owner ? `${owner.apellido}, ${owner.nombre}` : item.participante_id)}</td><td>${item.costo_puntos}</td><td>${fortuneFormatDate(item.vence_at)}</td><td><span class="fortune-status is-${status}">${status}</span></td><td>${status === "vigente" ? `<button class="table-action-btn is-danger" type="button" data-annul-voucher="${item.id}" title="Anular"><i class="bi bi-x-octagon-fill"></i></button>` : ""}</td></tr>`; }).join("");
  const failedRows = adminFortunaState.failedReceipts.map((item) => `<tr><td>${fortuneEscape(item.codigo)}</td><td>${item.tipo === "entrega" ? "Entrega" : "Canje"}</td><td>${fortuneEscape(item.destino_email || "Sin correo")}</td><td>${item.intentos}</td><td>${fortuneEscape(item.ultimo_error || "Error de envío")}</td><td><button class="btn btn-sm btn-fortuna-action" type="button" data-retry-fortuna-receipt="${item.id}" ${item.destino_email ? "" : "disabled"}>Reintentar</button></td></tr>`).join("");
  return `
    <div class="section-toolbar admin-toolbar"><div><p class="section-kicker section-brand mb-1">Administrador</p><h2 class="section-title mb-0">Fortuna y vouchers</h2></div></div>
    <section class="fortune-admin-panel"><div class="fortune-section-heading"><p class="section-kicker mb-1">Puntos</p><h3>Campañas Fortuna</h3></div>${renderAdminFortunaSeasonForm()}<div class="table-responsive"><table class="table frame-table mb-0"><thead><tr><th>Campaña</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${seasonRows || `<tr><td colspan="5" class="admin-empty-row">No hay campañas.</td></tr>`}</tbody></table></div></section>
    <section class="fortune-admin-panel"><div class="fortune-section-heading"><p class="section-kicker mb-1">Catálogo</p><h3>Tipos de voucher</h3></div>${renderAdminFortunaTypeForm()}<div class="table-responsive"><table class="table frame-table mb-0"><thead><tr><th>Producto</th><th>Costo</th><th>Stock</th><th>Vigencia</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${typeRows || `<tr><td colspan="6" class="admin-empty-row">No hay tipos de voucher.</td></tr>`}</tbody></table></div></section>
    <section class="fortune-admin-panel"><div class="fortune-section-heading"><p class="section-kicker mb-1">Trazabilidad</p><h3>Vouchers emitidos</h3></div><div class="table-responsive"><table class="table frame-table mb-0"><thead><tr><th>Código</th><th>Producto</th><th>Titular</th><th>PTS</th><th>Vence</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${voucherRows || `<tr><td colspan="7" class="admin-empty-row">No hay vouchers emitidos.</td></tr>`}</tbody></table></div></section>
    ${failedRows ? `<section class="fortune-admin-panel"><div class="fortune-section-heading"><p class="section-kicker mb-1">Correo</p><h3>Comprobantes pendientes de revisión</h3></div><p>Verificá el estado en Resend antes de reintentar un envío fallido.</p><div class="table-responsive"><table class="table frame-table mb-0"><thead><tr><th>Voucher</th><th>Comprobante</th><th>Destino</th><th>Intentos</th><th>Error</th><th>Acción</th></tr></thead><tbody>${failedRows}</tbody></table></div></section>` : ""}`;
}

async function refreshAdminFortunaView() {
  document.querySelector("#contentShell").innerHTML = await renderAdminFortunaView();
}

async function loadAdminConstatadores() {
  const { data, error } = await supabaseClient.from("usuarios_app").select("id,nombre,apellido,documento,contacto,usuario,rol,activo").eq("rol", "constatador").order("apellido");
  if (error) throw error;
  adminConstatadoresState.items = data || [];
}

async function renderAdminConstatadoresView() {
  await loadAdminConstatadores();
  const edit = adminConstatadoresState.items.find((item) => item.id === adminConstatadoresState.editingId) || {};
  const rows = adminConstatadoresState.items.map((item) => `<tr><td>${fortuneEscape(`${item.apellido}, ${item.nombre}`)}</td><td>${fortuneEscape(item.documento)}</td><td>${fortuneEscape(item.contacto)}</td><td>${fortuneEscape(item.usuario)}</td><td>${item.activo ? "Activo" : "Baja"}</td><td><div class="table-actions"><button class="table-action-btn" type="button" data-edit-constatador="${item.id}" title="Editar"><i class="bi bi-pencil-fill"></i></button><button class="table-action-btn ${item.activo ? "is-danger" : "is-success"}" type="button" data-toggle-constatador="${item.id}" data-active="${item.activo ? "false" : "true"}" title="${item.activo ? "Dar de baja" : "Reactivar"}"><i class="bi ${item.activo ? "bi-person-dash-fill" : "bi-person-check-fill"}"></i></button></div></td></tr>`).join("");
  return `
    <div class="section-toolbar admin-toolbar"><div><p class="section-kicker section-brand mb-1">Administrador</p><h2 class="section-title mb-0">Constatadores</h2></div></div>
    <section class="fortune-admin-panel"><form class="fortune-admin-form" data-admin-constatador-form><input type="hidden" name="id" value="${edit.id || ""}"><label><span>Nombre</span><input class="form-control" name="nombre" value="${fortuneEscape(edit.nombre || "")}" required></label><label><span>Apellido</span><input class="form-control" name="apellido" value="${fortuneEscape(edit.apellido || "")}" required></label><label><span>Documento</span><input class="form-control" name="documento" value="${fortuneEscape(edit.documento || "")}" required></label><label><span>Contacto</span><input class="form-control" name="contacto" value="${fortuneEscape(edit.contacto || "")}" required></label><label><span>Usuario</span><input class="form-control" name="usuario" value="${fortuneEscape(edit.usuario || "")}" required></label><label><span>Contraseña ${edit.id ? "(opcional)" : ""}</span><input class="form-control" name="password" type="password" ${edit.id ? "" : "required"} autocomplete="new-password"></label><button class="btn btn-fortuna-action" type="submit"><i class="bi bi-save-fill"></i> ${edit.id ? "Guardar" : "Crear constatador"}</button>${edit.id ? `<button class="btn btn-outline-secondary" type="button" data-cancel-constatador-edit>Cancelar</button>` : ""}</form><div class="table-responsive"><table class="table frame-table mb-0"><thead><tr><th>Nombre</th><th>Documento</th><th>Contacto</th><th>Usuario</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${rows || `<tr><td colspan="6" class="admin-empty-row">No hay constatadores.</td></tr>`}</tbody></table></div></section>`;
}

async function refreshAdminConstatadoresView() {
  document.querySelector("#contentShell").innerHTML = await renderAdminConstatadoresView();
}

// ----------------------------
// CONSTATADOR Y QR
// ----------------------------

function renderConstatadorValidator() {
  return `
    <div class="section-toolbar admin-toolbar"><div><p class="section-kicker section-brand mb-1">Frame0</p><h2 class="section-title mb-0">Validar voucher</h2></div></div>
    <div class="constatador-layout">
      <section class="fortune-admin-panel"><div class="fortune-section-heading"><p class="section-kicker mb-1">Cámara</p><h3>Escanear QR</h3></div><div id="fortuneQrReader" class="fortune-qr-reader"></div><button class="btn btn-fortuna-action" type="button" data-start-voucher-scanner><i class="bi bi-camera-fill"></i> Abrir cámara</button><p class="fortune-helper">Permití el acceso a la cámara. Si el dispositivo no la admite, ingresá el código manualmente.</p></section>
      <section class="fortune-admin-panel"><div class="fortune-section-heading"><p class="section-kicker mb-1">Código</p><h3>Consulta manual</h3></div><form data-constatador-code-form><label class="form-label" for="constatadorVoucherCode">Código del voucher</label><input class="form-control fortune-code-input" id="constatadorVoucherCode" name="codigo" type="text" autocomplete="off" placeholder="F0-XXXX-XXXX-XXXX-XXXX-XXXX" required><button class="btn btn-fortuna-action w-100 mt-3" type="submit"><i class="bi bi-search"></i> Consultar voucher</button></form><div data-constatador-result aria-live="polite"></div></section>
    </div>`;
}

async function showConstatadorDeliveryHistory(page = 1) {
  if (!constatadorSettingsSession?.usuario || !constatadorSettingsSession?.password) throw new Error("La sesión de constatador expiró.");
  const shell = document.querySelector("#contentShell");
  shell.innerHTML = typeof renderProfileLoader === "function" ? renderProfileLoader("entregas") : "Cargando...";
  const safePage = Math.max(1, Math.trunc(Number(page) || 1));
  const { data, error } = await supabaseClient.rpc("listar_entregas_constatador", {
    p_usuario: constatadorSettingsSession.usuario,
    p_password: constatadorSettingsSession.password,
    p_pagina: safePage
  });
  if (error) throw error;
  constatadorDeliveryPage = safePage;
  const total = Number(data?.[0]?.total || 0);
  const rows = (data || []).map((item) => `<tr><td>${fortuneFormatDate(item.entregado_at)}</td><td>${fortuneEscape(item.codigo)}</td><td>${fortuneEscape(item.producto)}<small class="d-block">${fortuneEscape(item.descripcion || "")}</small></td><td>${fortuneEscape(item.titular)}<small class="d-block">${fortuneEscape(item.documento_parcial)}</small></td><td>${fortuneEscape(item.constatador)}</td><td>${fortuneEscape(item.correo_estado)}</td></tr>`).join("");
  shell.innerHTML = `
    <div class="section-toolbar admin-toolbar"><div><p class="section-kicker section-brand mb-1">Constatador</p><h2 class="section-title mb-0">Historial de entregas</h2></div></div>
    <section class="fortune-admin-panel"><p>Entregas confirmadas por todos los constatadores. El documento completo solo aparece al validar un voucher.</p>
    <p class="fortune-history-scroll-hint">Deslizá la tabla hacia los lados para ver todas las columnas.</p><div class="table-responsive" tabindex="0" aria-label="Historial de entregas, desplazamiento horizontal"><table class="table frame-table mb-0"><thead><tr><th>Fecha</th><th>Código</th><th>Premio y descripción</th><th>Titular</th><th>Constatador</th><th>Correo</th></tr></thead><tbody>${rows || `<tr><td colspan="6" class="admin-empty-row">No hay entregas registradas.</td></tr>`}</tbody></table></div>
    <div class="fortune-history-pager"><button class="btn btn-sm btn-fortuna-action" type="button" data-constatador-deliveries-page="${safePage - 1}" ${safePage === 1 ? "disabled" : ""}>Anterior</button><span>Página ${safePage}${total ? ` de ${Math.ceil(total / 50)}` : ""}</span><button class="btn btn-sm btn-fortuna-action" type="button" data-constatador-deliveries-page="${safePage + 1}" ${safePage * 50 >= total ? "disabled" : ""}>Siguiente</button></div></section>`;
}

async function enterConstatadorView() {
  document.body.classList.add("admin-view", "constatador-view");
  document.body.classList.remove("delegate-view", "fortune-view");
  const sidebar = document.querySelector("#sidebarContent");
  sidebar.innerHTML = `<div class="sidebar-main admin-sidebar-main"><div><div class="sidebar-heading"><i class="bi bi-qr-code-scan"></i><h2>Constatador</h2></div><div class="sidebar-role-label">Rol: Constatador</div><div class="admin-actions"><button class="division-link" type="button" data-constatador-home><i class="bi bi-upc-scan"></i> Validar voucher</button><button class="division-link" type="button" data-constatador-deliveries-page="1"><i class="bi bi-clock-history"></i> Historial de entregas</button>${typeof renderThemeMenuButton === "function" ? renderThemeMenuButton() : ""}</div></div><button class="btn btn-ingreso w-100" type="button" data-admin-logout><i class="bi bi-box-arrow-left"></i> Salir</button></div>`;
  document.querySelector("#contentShell").innerHTML = renderConstatadorValidator();
}

async function stopFortunaQrScanner() {
  if (!fortuneQrScanner) return;
  try {
    if (fortuneQrScanner.isScanning) await fortuneQrScanner.stop();
    await fortuneQrScanner.clear();
  } catch (error) {
    console.warn("No se pudo cerrar el lector QR:", error.message);
  } finally {
    fortuneQrScanner = null;
  }
}

async function startFortunaQrScanner() {
  if (typeof Html5Qrcode === "undefined") throw new Error("El lector QR no está disponible. Usá el código manual.");
  await stopFortunaQrScanner();
  fortuneQrScanner = new Html5Qrcode("fortuneQrReader");
  await fortuneQrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 230, height: 230 }, aspectRatio: 1 },
    async (decodedText) => {
      await stopFortunaQrScanner();
      const input = document.querySelector("#constatadorVoucherCode");
      if (input) input.value = decodedText;
      await consultConstatadorVoucher(decodedText);
    },
    () => {}
  );
}

async function consultConstatadorVoucher(code) {
  if (!constatadorSettingsSession?.usuario || !constatadorSettingsSession?.password) throw new Error("La sesión de constatador expiró.");
  const result = document.querySelector("[data-constatador-result]");
  if (result) result.innerHTML = `<div class="fortune-inline-loader"><span class="spinner-border spinner-border-sm"></span> Consultando...</div>`;
  let data;
  try {
    const response = await supabaseClient.rpc("consultar_voucher_constatador", {
      p_usuario: constatadorSettingsSession.usuario,
      p_password: constatadorSettingsSession.password,
      p_codigo: code
    });
    if (response.error) throw response.error;
    data = response.data;
  } catch (error) {
    if (result) result.innerHTML = `<div class="fortune-result-warning"><i class="bi bi-exclamation-triangle-fill"></i> ${fortuneEscape(fortuneErrorMessage(error))}</div>`;
    throw error;
  }
  fortuneLastVoucher = data;
  if (result) result.innerHTML = `
    <article class="constatador-result is-${fortuneEscape(data.estado)}">
      <span class="fortune-ticket-status">${fortuneEscape(data.estado)}</span>
      <h3>${fortuneEscape(data.producto)}</h3><p class="fortune-ticket-code">${fortuneEscape(data.codigo)}</p>
      <dl><div><dt>Titular</dt><dd>${fortuneEscape(data.titular.nombre)}</dd></div><div><dt>Documento</dt><dd>${fortuneEscape(data.titular.documento)}</dd></div><div><dt>Vence</dt><dd>${fortuneFormatDate(data.vence_at)}</dd></div></dl>
      ${data.puede_usar ? `<button class="btn btn-fortuna-action w-100" type="button" data-confirm-voucher-delivery="${data.id}"><i class="bi bi-check2-circle"></i> Confirmar entrega</button>` : `<p class="fortune-result-warning">Este voucher no puede utilizarse.</p>`}
    </article>`;
}

async function confirmConstatadorVoucher(id) {
  const confirmed = await requestConfirmation({ kicker: "Constatador", title: "Confirmar entrega", message: "Verificá el documento del titular antes de entregar el producto. Esta acción no puede deshacerse.", confirmLabel: "Confirmar entrega", icon: "bi-check2-circle" });
  if (!confirmed) return;
  const { data, error } = await supabaseClient.rpc("confirmar_entrega_voucher_constatador", {
    p_usuario: constatadorSettingsSession.usuario,
    p_password: constatadorSettingsSession.password,
    p_voucher_id: id
  });
  if (error) throw error;
  const result = document.querySelector("[data-constatador-result]");
  if (result) result.innerHTML = `<article class="constatador-result is-usado"><i class="bi bi-check-circle-fill"></i><h3>Entrega confirmada</h3><p>${fortuneEscape(data.producto)}</p><p class="fortune-ticket-code">${fortuneEscape(data.codigo)}</p><small>${fortuneFormatDate(data.usado_at)}</small><p>El comprobante quedó registrado para su envío por correo.</p></article>`;
}

// ----------------------------
// EVENTOS
// ----------------------------

document.querySelectorAll("[data-participant-mode]").forEach((button) => button.addEventListener("click", () => setParticipantAuthMode(button.dataset.participantMode)));

document.querySelector("#participantLoginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#participantLoginEmail").value.trim();
  const password = document.querySelector("#participantLoginPassword").value;
  fortuneSetAuthFeedback("Ingresando...", "loading");
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return fortuneSetAuthFeedback(fortuneErrorMessage(error), "error");
  try {
    const profile = await getFortuneParticipantProfile();
    if (!profile) throw new Error("Esta cuenta no es un participante de Fortuna.");
    bootstrap.Modal.getInstance(document.querySelector("#participantAuthModal"))?.hide();
    event.currentTarget.reset();
    await enterFortuneParticipantView(profile);
  } catch (error) {
    await supabaseClient.auth.signOut();
    fortuneSetAuthFeedback(fortuneErrorMessage(error), "error");
  }
});

document.querySelector("#participantRegisterForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const metadata = { tipo_cuenta: "participante", nombre: String(form.get("nombre") || "").trim(), apellido: String(form.get("apellido") || "").trim(), documento: String(form.get("documento") || "").trim() };
  fortuneSetAuthFeedback("Creando cuenta...", "loading");
  const redirectUrl = new URL("index.html", window.location.href).href.split("#")[0].split("?")[0];
  const { error } = await supabaseClient.auth.signUp({ email, password, options: { data: metadata, emailRedirectTo: redirectUrl } });
  if (error) return fortuneSetAuthFeedback(fortuneErrorMessage(error), "error");
  event.currentTarget.reset();
  fortuneSetAuthFeedback("Cuenta creada. Revisá tu email para confirmar el ingreso.", "success");
});

document.querySelector("#participantResetForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (form.dataset.recovery === "true") {
    const password = form.querySelector("[name='new_password']")?.value || "";
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (!error) {
      form.dataset.recovery = "false";
      form.innerHTML = `<p>Ingresá tu email y te enviaremos un enlace para elegir una nueva contraseña.</p><label class="form-label" for="participantResetEmail">Email</label><input class="form-control" id="participantResetEmail" type="email" autocomplete="email" required><button class="btn btn-login-submit w-100 mt-4" type="submit"><i class="bi bi-envelope-fill"></i> Enviar enlace</button><button class="fortune-link-button" type="button" data-participant-mode="login">Volver al ingreso</button>`;
      form.querySelector("[data-participant-mode]")?.addEventListener("click", () => setParticipantAuthMode("login"));
      window.history.replaceState({}, document.title, new URL("index.html", window.location.href).pathname);
      setParticipantAuthMode("login");
    }
    fortuneSetAuthFeedback(error ? fortuneErrorMessage(error) : "Contraseña actualizada. Ya podés ingresar.", error ? "error" : "success");
    return;
  }
  const email = document.querySelector("#participantResetEmail").value.trim();
  const redirectTo = new URL("index.html", window.location.href).href.split("#")[0].split("?")[0];
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
  fortuneSetAuthFeedback(error ? fortuneErrorMessage(error) : "Enviamos el enlace de recuperación a tu email.", error ? "error" : "success");
});

document.addEventListener("click", async (event) => {
  const target = event.target;
  const authButton = target.closest("[data-participant-auth]");
  const publicFortuneButton = target.closest("[data-fortuna-open]");
  const pageButton = target.closest("[data-fortune-page]");
  const predictionButton = target.closest("[data-save-prediction]");
  const redeemButton = target.closest("[data-redeem-voucher]");
  const requestButton = target.closest("[data-resolve-player-request]");
  const scannerButton = target.closest("[data-start-voucher-scanner]");
  const deliveryButton = target.closest("[data-confirm-voucher-delivery]");
  const constatadorHome = target.closest("[data-constatador-home]");
  const deliveryHistoryButton = target.closest("[data-constatador-deliveries-page]");
  try {
    if (authButton || publicFortuneButton) {
      const profile = await getFortuneParticipantProfile();
      if (profile) await enterFortuneParticipantView(profile); else showParticipantAuth();
      return;
    }
    if (pageButton) return await showFortunePage(pageButton.dataset.fortunePage);
    if (predictionButton) return await saveFortunePrediction(predictionButton.dataset.savePrediction);
    if (redeemButton) return await redeemFortuneVoucher(redeemButton.dataset.redeemVoucher);
    if (requestButton) return await resolveDelegatePlayerRequest(requestButton.dataset.resolvePlayerRequest, requestButton.dataset.approve === "true");
    if (scannerButton) return await startFortunaQrScanner();
    if (deliveryButton) return await confirmConstatadorVoucher(deliveryButton.dataset.confirmVoucherDelivery);
    if (constatadorHome) { await stopFortunaQrScanner(); document.querySelector("#contentShell").innerHTML = renderConstatadorValidator(); return; }
    if (deliveryHistoryButton) { await stopFortunaQrScanner(); return await showConstatadorDeliveryHistory(deliveryHistoryButton.dataset.constatadorDeliveriesPage); }

    const editSeason = target.closest("[data-edit-fortuna-season]");
    const closeSeason = target.closest("[data-close-fortuna-season]");
    const editType = target.closest("[data-edit-voucher-type]");
    const toggleType = target.closest("[data-toggle-voucher-type]");
    const annulVoucher = target.closest("[data-annul-voucher]");
    const cancelFortunaEdit = target.closest("[data-cancel-admin-fortuna-edit]");
    const editConstatador = target.closest("[data-edit-constatador]");
    const toggleConstatador = target.closest("[data-toggle-constatador]");
    const retryReceipt = target.closest("[data-retry-fortuna-receipt]");

    if (retryReceipt) {
      const confirmed = await requestConfirmation({ kicker: "Administrador", title: "Reintentar comprobante", message: "Verificá antes en Resend que el correo no se haya entregado. ¿Reintentás el envío?", confirmLabel: "Reintentar" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("reintentar_comprobante_fortuna", { p_id: retryReceipt.dataset.retryFortunaReceipt });
      if (error) throw error;
      return await refreshAdminFortunaView();
    }

    if (editSeason) { adminFortunaState.editingSeasonId = editSeason.dataset.editFortunaSeason; return await refreshAdminFortunaView(); }
    if (editType) { adminFortunaState.editingTypeId = editType.dataset.editVoucherType; return await refreshAdminFortunaView(); }
    if (cancelFortunaEdit) { if (cancelFortunaEdit.dataset.cancelAdminFortunaEdit === "season") adminFortunaState.editingSeasonId = ""; else adminFortunaState.editingTypeId = ""; return await refreshAdminFortunaView(); }
    if (closeSeason) {
      const confirmed = await requestConfirmation({ kicker: "Administrador", title: "Cerrar campaña", message: "El saldo no utilizado vencerá inmediatamente y la campaña no podrá reabrirse.", confirmLabel: "Cerrar campaña", icon: "bi-lock-fill" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("cerrar_temporada_fortuna", { p_id: closeSeason.dataset.closeFortunaSeason });
      if (error) throw error;
      return await refreshAdminFortunaView();
    }
    if (toggleType) {
      const active = toggleType.dataset.active === "true";
      const confirmed = await requestConfirmation({ kicker: "Administrador", title: active ? "Reactivar voucher" : "Dar de baja voucher", message: active ? "El producto volverá al catálogo." : "No se emitirán nuevos vouchers; los vigentes conservarán validez.", confirmLabel: active ? "Reactivar" : "Dar de baja", icon: active ? "bi-arrow-counterclockwise" : "bi-slash-circle" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("cambiar_estado_tipo_voucher", { p_id: toggleType.dataset.toggleVoucherType, p_activo: active });
      if (error) throw error;
      return await refreshAdminFortunaView();
    }
    if (annulVoucher) {
      const confirmed = await requestConfirmation({ kicker: "Administrador", title: "Anular voucher", message: "El voucher dejará de ser válido, liberará stock y no reintegrará puntos.", confirmLabel: "Anular voucher", icon: "bi-x-octagon-fill" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("anular_voucher_fortuna", { p_id: annulVoucher.dataset.annulVoucher, p_motivo: "Anulado por el administrador." });
      if (error) throw error;
      return await refreshAdminFortunaView();
    }
    if (editConstatador) { adminConstatadoresState.editingId = editConstatador.dataset.editConstatador; return await refreshAdminConstatadoresView(); }
    if (target.closest("[data-cancel-constatador-edit]")) { adminConstatadoresState.editingId = ""; return await refreshAdminConstatadoresView(); }
    if (toggleConstatador) {
      const active = toggleConstatador.dataset.active === "true";
      const confirmed = await requestConfirmation({ kicker: "Administrador", title: active ? "Reactivar constatador" : "Dar de baja constatador", message: active ? "La cuenta recuperará acceso al validador." : "La cuenta dejará de consultar y entregar vouchers.", confirmLabel: active ? "Reactivar" : "Dar de baja", icon: active ? "bi-person-check-fill" : "bi-person-dash-fill" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("cambiar_estado_usuario_admin", { p_admin_usuario: adminSettingsSession.usuario, p_admin_password: adminSettingsSession.password, p_tipo: "constatador", p_registro_id: toggleConstatador.dataset.toggleConstatador, p_activo: active });
      if (error) throw error;
      return await refreshAdminConstatadoresView();
    }
  } catch (error) {
    console.error("Error Fortuna:", error);
    if (typeof showLoginError === "function" && document.body.classList.contains("constatador-view")) showLoginError(fortuneErrorMessage(error));
    else alert(fortuneErrorMessage(error));
  }
});

document.addEventListener("change", (event) => {
  const teamSelect = event.target.closest("[data-player-link-team]");
  if (!teamSelect) return;
  const playerSelect = document.querySelector("[data-player-link-player]");
  playerSelect.value = "";
  playerSelect.disabled = !teamSelect.value;
  playerSelect.querySelectorAll("option[data-team-id]").forEach((option) => { option.hidden = option.dataset.teamId !== teamSelect.value; });
});

document.addEventListener("submit", async (event) => {
  const playerLinkForm = event.target.closest("[data-player-link-form]");
  const seasonForm = event.target.closest("[data-admin-season-form]");
  const typeForm = event.target.closest("[data-admin-voucher-type-form]");
  const constatadorForm = event.target.closest("[data-admin-constatador-form]");
  const codeForm = event.target.closest("[data-constatador-code-form]");
  if (!playerLinkForm && !seasonForm && !typeForm && !constatadorForm && !codeForm) return;
  event.preventDefault();
  try {
    if (playerLinkForm) {
      const playerId = playerLinkForm.querySelector("[data-player-link-player]").value;
      if (!playerId) throw new Error("Seleccioná tu ficha de jugador.");
      const confirmed = await requestConfirmation({ kicker: "Fortuna", title: "Solicitar vínculo", message: "El delegado del equipo verificará que la ficha te corresponda.", confirmLabel: "Enviar solicitud", icon: "bi-person-check-fill" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("solicitar_vinculo_jugador", { p_jugador_id: playerId });
      if (error) throw error;
      return await showFortunePage("profile");
    }
    if (seasonForm) {
      const form = new FormData(seasonForm);
      const confirmed = await requestConfirmation({ kicker: "Administrador", title: form.get("id") ? "Guardar campaña" : "Crear campaña", message: form.get("estado") === "activa" ? "La campaña quedará habilitada dentro del rango configurado." : "La campaña quedará como borrador.", confirmLabel: "Guardar", icon: "bi-calendar-check-fill" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("guardar_temporada_fortuna", { p_id: form.get("id") || null, p_nombre: form.get("nombre"), p_inicia_at: new Date(form.get("inicia_at")).toISOString(), p_finaliza_at: new Date(form.get("finaliza_at")).toISOString(), p_estado: form.get("estado") });
      if (error) throw error;
      adminFortunaState.editingSeasonId = "";
      return await refreshAdminFortunaView();
    }
    if (typeForm) {
      const form = new FormData(typeForm);
      const confirmed = await requestConfirmation({ kicker: "Administrador", title: form.get("id") ? "Guardar tipo de voucher" : "Crear tipo de voucher", message: "El costo y la vigencia se copiarán en cada voucher nuevo.", confirmLabel: "Guardar", icon: "bi-ticket-perforated-fill" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("guardar_tipo_voucher", { p_id: form.get("id") || null, p_nombre: form.get("nombre"), p_descripcion: form.get("descripcion"), p_costo_puntos: Number(form.get("costo")), p_stock_total: Number(form.get("stock")), p_vigencia_dias: Number(form.get("vigencia")) });
      if (error) throw error;
      adminFortunaState.editingTypeId = "";
      return await refreshAdminFortunaView();
    }
    if (constatadorForm) {
      const form = new FormData(constatadorForm);
      const confirmed = await requestConfirmation({ kicker: "Administrador", title: form.get("id") ? "Guardar constatador" : "Crear constatador", message: "La cuenta tendrá acceso únicamente al validador de vouchers.", confirmLabel: "Guardar", icon: "bi-qr-code-scan" });
      if (!confirmed) return;
      const { error } = await supabaseClient.rpc("guardar_constatador_admin", { p_admin_usuario: adminSettingsSession.usuario, p_admin_password: adminSettingsSession.password, p_usuario_id: form.get("id") || null, p_nombre: form.get("nombre"), p_apellido: form.get("apellido"), p_documento: form.get("documento"), p_contacto: form.get("contacto"), p_usuario: form.get("usuario"), p_password: form.get("password") || null });
      if (error) throw error;
      adminConstatadoresState.editingId = "";
      return await refreshAdminConstatadoresView();
    }
    if (codeForm) return await consultConstatadorVoucher(new FormData(codeForm).get("codigo"));
  } catch (error) {
    console.error("Error al guardar Fortuna:", error);
    alert(fortuneErrorMessage(error));
  }
});

supabaseClient.auth.onAuthStateChange((event) => {
  if (event !== "PASSWORD_RECOVERY") return;
  const form = document.querySelector("#participantResetForm");
  form.dataset.recovery = "true";
  form.innerHTML = `<p>Elegí una nueva contraseña para tu cuenta.</p><label><span>Nueva contraseña</span><input class="form-control" name="new_password" type="password" minlength="8" autocomplete="new-password" required></label><button class="btn btn-login-submit w-100 mt-4" type="submit">Guardar contraseña</button>`;
  showParticipantAuth("reset");
});

(async function restoreFortuneSession() {
  try {
    const profile = await getFortuneParticipantProfile();
    if (profile && /type=recovery/.test(window.location.hash) === false) await enterFortuneParticipantView(profile);
  } catch (error) {
    console.warn("No se pudo restaurar la sesión de Fortuna:", error.message);
  }
})();
