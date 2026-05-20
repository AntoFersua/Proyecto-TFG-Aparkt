let translations = {};
let lang = localStorage.getItem('aparkt-lang') || 'es';

function rutaBase() {
  const base = new URL('.', import.meta.url).href;
  return base + 'assets/i18n/translations.json';
}

export async function cargarTraducciones() {
  try {
    const resp = await fetch(rutaBase());
    translations = await resp.json();
  } catch (e) {
    console.error('Error al cargar traducciones:', e);
  }
}

export function getIdiomaActual() {
  return lang;
}

export function establecerIdioma(nuevoLang) {
  lang = nuevoLang;
  localStorage.setItem('aparkt-lang', lang);
}

export function t(clave) {
  const partes = clave.split('.');
  let valor = translations[lang];
  for (const p of partes) {
    if (valor && typeof valor === 'object' && p in valor) {
      valor = valor[p];
    } else {
      return clave;
    }
  }
  return typeof valor === 'string' ? valor : clave;
}

export function aplicarTraducciones() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const clave = el.getAttribute('data-i18n');
    el.textContent = t(clave);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const clave = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(clave);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const clave = el.getAttribute('data-i18n-alt');
    el.alt = t(clave);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const clave = el.getAttribute('data-i18n-aria-label');
    el.setAttribute('aria-label', t(clave));
  });
  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    const clave = el.getAttribute('data-i18n-value');
    el.value = t(clave);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const clave = el.getAttribute('data-i18n-title');
    el.title = t(clave);
  });
  const titleEl = document.querySelector('title');
  if (titleEl && titleEl.hasAttribute('data-i18n-title')) {
    document.title = t(titleEl.getAttribute('data-i18n-title'));
  }
  const metaDesc = document.querySelector('meta[name="description"][data-i18n-meta]');
  if (metaDesc) {
    metaDesc.setAttribute('content', t(metaDesc.getAttribute('data-i18n-meta')));
  }
}

export async function cambiarIdioma(nuevoLang) {
  if (Object.keys(translations).length === 0) {
    await cargarTraducciones();
  }
  establecerIdioma(nuevoLang);
  aplicarTraducciones();
}
