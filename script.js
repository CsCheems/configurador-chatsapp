// Parámetros de la URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const configJson = urlParams.get("configJson") || "";

const widgetUrl = urlParams.get("widgetUrl") || "";
const mostrarAvatar = document.getElementById('toggle-mostarAvatar');
const mostrarTiempo = document.getElementById('toggle-mostrarTiempo');
const mostrarInsignias = document.getElementById('toggle-mostarInsigneas');
const permitirImagenes = document.getElementById('toggle-mostarImagenes');
const permitirComandos = document.getElementById('toggle-excluirComandos');
const fontSize = document.getElementById('tamañoFuente');
const ignoredUsers = document.getElementById('usuariosIgnorados');
const host = document.getElementById('hostInput');
const port = document.getElementById('portInput');
const btnWidgetUrl = document.getElementById('btnWidgetUrl');
const widgetUrlInput = document.getElementById('widgetUrlInput');


fetch('./config/config.json')
  .then(response => response.json())
  .then(config => {
    applyDefaultSettings(config);
    loadFromURL(config);
    generarUrlWidget(config);

    document.getElementById('btnWidgetUrl').addEventListener('click', () => {
      generarUrlWidget(config);
    });
  })
  .catch(error => {
    console.error("Error cargando config.json:", error);
  });

function applyDefaultSettings(config) {
  config.config.forEach(item => {
    const input = document.getElementById(`toggle-${item.id}`) || document.getElementById(item.id);
    if (!input) return;

    if (item.type === "checkbox") {
      input.checked = item.value ?? item.defaultValue ?? false;
    } else if (item.type === "number" || item.type === "text" || item.type === "color") {
      input.value = item.value ?? item.defaultValue ?? "";
    }
  });
}

// Aplicar desde la URL
function loadFromURL(config) {
  const urlParams = new URLSearchParams(window.location.search);
  config.config.forEach(item => {
    const input = document.getElementById(`toggle-${item.id}`) || document.getElementById(item.id);
    if (!input || !urlParams.has(item.id)) return;

    if (item.type === "checkbox") {
      input.checked = urlParams.get(item.id) === 'true';
    } else {
      input.value = urlParams.get(item.id);
    }
  });
}

// Generar la URL del widget
function generarUrlWidget(config) {
  const baseUrl = "https://cscheems.github.io/Chatsapp/";
  const params = new URLSearchParams();

  config.config.forEach(item => {
    const el = document.getElementById(`toggle-${item.id}`) || document.getElementById(item.id);
    if (!el) return;
    const value = item.type === "checkbox" ? el.checked : el.value;
    params.set(item.id, value);
  });

  const finalUrl = `${baseUrl}?${params.toString()}`;
  document.getElementById("widgetUrlInput").value = finalUrl;
}

function copiarUrl() {
  const input = document.getElementById("widgetUrlInput");
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);
}
