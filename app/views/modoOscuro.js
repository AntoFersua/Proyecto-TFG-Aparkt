(function() {
  function inicializarTema() {
    var temaGuardado = localStorage.getItem('modoOscuro');
    var temaInicial;

    if (temaGuardado === 'true') {
      temaInicial = 'dark';
    } else if (temaGuardado === 'false') {
      temaInicial = 'light';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      temaInicial = 'dark';
    } else {
      temaInicial = 'light';
    }

    document.documentElement.setAttribute('data-theme', temaInicial);
    document.documentElement.style.colorScheme = temaInicial;
    aplicarTemaSwal(temaInicial);
  }

  function aplicarTemaSwal(tema) {
    if (typeof window.Swal !== 'undefined' && typeof window.Swal.setDefaults === 'function') {
      if (tema === 'dark') {
        window.Swal.setDefaults({
          background: '#1e2a45',
          color: '#f0f0f0',
          confirmButtonColor: '#34af72'
        });
      } else {
        window.Swal.setDefaults({
          background: '#fff',
          color: '#545454',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  }

  function actualizarIconos() {
    var esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('#modoOscuro, #modoOscuroDrop').forEach(function(b) {
      var sol = b.querySelector('.icon-sol');
      var luna = b.querySelector('.icon-luna');
      if (sol) sol.style.display = esOscuro ? 'none' : '';
      if (luna) luna.style.display = esOscuro ? '' : 'none';
    });
  }

  function toggleTema(e) {
    var actual = document.documentElement.getAttribute('data-theme');
    var nuevo = actual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nuevo);
    document.documentElement.style.colorScheme = nuevo;
    localStorage.setItem('modoOscuro', nuevo === 'dark' ? 'true' : 'false');
    aplicarTemaSwal(nuevo);
    actualizarIconos();
  }

  function enlatarBotones() {
    document.querySelectorAll('#modoOscuro, #modoOscuroDrop').forEach(function(btn) {
      if (btn._modoOscuroEnlazado) return;
      btn._modoOscuroEnlazado = true;
      btn.addEventListener('click', function(e) {
        toggleTema(e);
      });
    });
  }

  function sincronizar() {
    actualizarIconos();
    enlatarBotones();
  }

  inicializarTema();
  sincronizar();

  var observer = new MutationObserver(function(muts) {
    var btn = document.querySelector('#modoOscuro');
    if (btn) {
      sincronizar();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState !== 'loading') {
    sincronizar();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      sincronizar();
    });
  }
})();
