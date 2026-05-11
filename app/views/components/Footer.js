// Clase que define el componente personalizado "footer".
class Footer extends HTMLElement {
  constructor() {
    super();
  }

  // Método que se llama cuando el elemento se conecta al DOM.
  connectedCallback() {
    this.render();
  }

  // Método que define el contenido HTML del componente.
  render() {
    this.innerHTML = `
        <footer>
      <div class="footer-main">
        <div class="footer-section footer-brand">
          <img src="../assets/imagotipoAparkt.png" data-i18n-alt="footer.logoAlt" alt="Aparkt Logo" class="footer-logo" />
        </div>

        <div class="footer-section footer-contact">
          <h4 data-i18n="footer.contacto">Contacto</h4>
          <ul>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              info@aparkt.com
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              +34 900 123 456
            </li>
          </ul>
        </div>

        <div class="footer-section footer-social">
          <h4 data-i18n="footer.siguenos">Síguenos</h4>
          <div class="social-icons">
            <a href="#" data-i18n-aria-label="footer.instagram" aria-label="Instagram" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" data-i18n-aria-label="footer.tiktok" aria-label="TikTok" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-section footer-payments">
          <h4>Pagos seguros</h4>
          <div class="payment-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="payment-icon">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.66h6.165c2.235 0 3.955.48 5.113 1.428 1.157.948 1.632 2.342 1.416 4.148-.06.498-.19 1.115-.38 1.84a13.377 13.377 0 0 1-.52 1.68.766.766 0 0 0 .14.862c.09.084.21.126.338.126a.642.642 0 0 0 .337-.091c1.65-.77 2.87-2.002 3.428-3.693.91-2.762.53-5.452-1.058-7.084C20.194 1.55 17.496.36 14.248.36H9.038L8.94.366a.77.77 0 0 0-.764.705l-.299 5.159a.641.641 0 0 0 .632.7h1.648l-.499 8.557a.641.641 0 0 1-.63.574H7.076v.001Z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="payment-icon">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="payment-icon">
              <path d="M3.6 5.9h16.8c1.7 0 2.8.8 2.8 2.2 0 1-.6 1.7-1.6 1.9.6.2 1 .8 1 1.6 0 1.4-1.2 2.3-3 2.3H3.6V5.9zm2.7 3.5h1.8c.9 0 1.4-.4 1.4-1 0-.7-.5-1-1.4-1H6.3v2zm0 4.4h2.1c.9 0 1.6-.4 1.6-1.2 0-.7-.6-1.1-1.5-1.1H6.3v2.3zM9.4 6.2l-1.4 5.3H6.4l-1.4-5.3h1.6l.7 3.5.8-3.5h1.3zm3.8 2.5c0-1.4.9-2.5 2.6-2.5.6 0 1.2.2 1.7.4V5.2h1.4v8.3h-1.4v-.6c-.5.3-1.1.5-1.7.5-1.7 0-2.6-1.1-2.6-2.7zm4.2 0c0 .9-.4 1.4-1.1 1.4-.6 0-1-.5-1-1.4s.4-1.4 1-1.4c.7 0 1.1.5 1.1 1.4zm5.1 2.8c0-.5-.4-.6-1.3-.8-1.1-.3-1.7-.7-1.7-1.5 0-.7.6-1.2 1.7-1.2.7 0 1.4.2 2 .4v-.6c0-.8-.5-1.2-1.5-1.2-.7 0-1.3.2-1.9.4l-.3-.9c.6-.3 1.5-.5 2.4-.5 1.7 0 2.6.9 2.6 2.2v3.7h-1.4v-.6zm-1.3-1.3c.6 0 1-.3 1-.8 0-.6-.4-.9-1-.9-.6 0-1 .3-1 .9 0 .5.4.8 1 .8zm2.4-4.2h1.4v1.1h.1c.3-.5.9-.9 1.7-.9 1.5 0 2.4 1.2 2.4 2.9v4.3h-1.4V9.2c0-.9-.4-1.4-1.1-1.4-.6 0-1 .5-1 1.4v4h-1.4V5.8h-1.7z"/>
            </svg>
          </div>
        </div>

        <p class="copyright">&copy; 2026 Aparkt. Todos los derechos reservados.</p>
      </div>
    </footer>`;
  }
}

// Define el nuevo elemento personalizado "app-footer" y lo asocia con la clase footer.
customElements.define("app-footer", Footer);
