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
  }

  function actualizarIconos() {
    var headerMap = document.querySelector('header-map');
    if (!headerMap) return;

    var btn = headerMap.querySelector('#modoOscuro');
    var btnDrop = headerMap.querySelector('#modoOscuroDrop');

    var esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';

    [btn, btnDrop].forEach(function(b) {
      if (!b) return;
      var sol = b.querySelector('.icon-sol');
      var luna = b.querySelector('.icon-luna');
      if (sol) sol.style.display = esOscuro ? 'none' : 'block';
      if (luna) luna.style.display = esOscuro ? 'block' : 'none';
    });
  }

  function esperarYConfigurar(intentos) {
    intentos = intentos || 0;
    if (intentos > 100) return;

    var headerMap = document.querySelector('header-map');
    if (!headerMap) {
      setTimeout(function() { esperarYConfigurar(intentos + 1); }, 100);
      return;
    }

    var btn = headerMap.querySelector('#modoOscuro');
    if (!btn) {
      setTimeout(function() { esperarYConfigurar(intentos + 1); }, 100);
      return;
    }

    actualizarIconos();

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var actual = document.documentElement.getAttribute('data-theme');
      var nuevo = actual === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nuevo);
      document.documentElement.style.colorScheme = nuevo;
      localStorage.setItem('modoOscuro', nuevo === 'dark' ? 'true' : 'false');
      actualizarIconos();
    });

    var btnDrop = headerMap.querySelector('#modoOscuroDrop');
    if (btnDrop) {
      btnDrop.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var actual = document.documentElement.getAttribute('data-theme');
        var nuevo = actual === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nuevo);
        document.documentElement.style.colorScheme = nuevo;
        localStorage.setItem('modoOscuro', nuevo === 'dark' ? 'true' : 'false');
        actualizarIconos();
      });
    }
  }

  inicializarTema();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(esperarYConfigurar, 500);
    });
  } else {
    setTimeout(esperarYConfigurar, 500);
  }
})();
