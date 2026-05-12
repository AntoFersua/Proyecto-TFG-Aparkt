class HeaderMap extends HTMLElement {

    connectedCallback() {
        this.render();
        this.initJS();
    }

    render() {
        this.innerHTML = `
        
        <style>

        *{
            box-sizing:border-box;
        }

        header {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);

            width: calc(100% - 20px);
            max-width: 800px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 6px 10px;

            background: rgba(255, 255, 255, 0.96);

            border: 1px solid rgba(92, 122, 72, 0.15);

            border-radius: 12px;

            backdrop-filter: blur(12px);

            box-shadow:
                0 2px 10px rgba(0,0,0,0.06),
                0 1px 4px rgba(0,0,0,0.03);

            z-index: 9999;

            font-family: "Inter", sans-serif;
            gap: 8px;
        }

        .logoHeader {
            display: flex;
            align-items: center;
            flex-shrink: 0;
        }

        .logoHeader img {
            height: 28px;
            object-fit: contain;
        }

        .buscador {
            flex: 1;
            display: flex;
            align-items: center;
            min-width: 0;
        }

        .buscador form {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 4px;
        }

        .buscador input[type="text"] {
            flex: 1;
            min-width: 0;
            height: 28px;
            padding: 0 10px;
            font-size: 13px;
            border: 1.5px solid rgba(92, 122, 72, 0.25);
            border-radius: 14px;
            outline: none;
            font-family: inherit;
            color: #333;
            background: #fafafa;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .buscador input[type="text"]::placeholder {
            color: #999;
        }

        .buscador input[type="text"]:focus {
            border-color: #5c7a48;
            box-shadow: 0 1px 6px rgba(92, 122, 72, 0.12);
            background: #fff;
        }

        .buscador input[type="submit"] {
            height: 28px;
            padding: 0 10px;
            font-size: 12px;
            font-weight: 600;
            border: none;
            border-radius: 14px;
            background: #5c7a48;
            color: white;
            cursor: pointer;
            font-family: inherit;
            box-shadow: 0 1px 3px rgba(92, 122, 72, 0.15);
            transition: all 0.2s ease;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .buscador input[type="submit"]:hover {
            background: #4e683d;
        }

        #headerDerecha {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
        }

        .menu-container {
            position: relative;
        }

        .menu-btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 8px;
            background: #f0f0f0;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .menu-btn:hover {
            background: #e0e0e0;
        }

        .menu-btn svg {
            width: 16px;
            height: 16px;
            stroke: #666;
            fill: none;
        }

        .menu-dropdown {
            position: absolute;
            top: calc(100% + 6px);
            right: 0;
            background: white;
            border: 1px solid rgba(92, 122, 72, 0.15);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            min-width: 140px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.2s ease;
            z-index: 10000;
        }

        .menu-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .menu-dropdown a {
            display: block;
            padding: 10px 14px;
            text-decoration: none;
            color: #333;
            font-size: 13px;
            transition: background 0.15s ease;
        }

        .menu-dropdown a:first-child {
            border-radius: 7px 7px 0 0;
        }

        .menu-dropdown a:last-child {
            border-radius: 0 0 7px 7px;
        }

        .menu-dropdown a:hover {
            background: #f5f5f5;
            color: #5c7a48;
        }

        #headerDerecha button.icon-btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 8px;
            background: #f0f0f0;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        #headerDerecha button.icon-btn:hover {
            background: #e0e0e0;
        }

        #headerDerecha button.icon-btn svg {
            width: 14px;
            height: 14px;
            stroke: #666;
            fill: none;
        }

        @media (max-width: 600px) {

            header {
                top: 8px;
                padding: 6px 8px;
                gap: 6px;
                border-radius: 10px;
            }

            .logoHeader img {
                height: 24px;
            }

            .buscador input[type="text"] {
                height: 26px;
                font-size: 12px;
                padding: 0 8px;
            }

            .buscador input[type="submit"] {
                height: 26px;
                padding: 0 8px;
                font-size: 11px;
            }

            #headerDerecha button.icon-btn,
            .menu-btn {
                width: 26px;
                height: 26px;
            }

            #headerDerecha button.icon-btn svg,
            .menu-btn svg {
                width: 12px;
                height: 12px;
            }

            .menu-dropdown {
                min-width: 120px;
            }

            .menu-dropdown a {
                padding: 8px 12px;
                font-size: 12px;
            }
        }

        </style>

        <header>

            <div class="logoHeader">
                <img src="../assets/imagotipoAparkt.webp" alt="Logo">
            </div>

            <div class="buscador">
                <form id="form-busqueda-header" method="get">
                    <input type="text" id="busqueda-header" placeholder="Dirección" data-i18n-placeholder="index.placeholderDireccion" />
                    <input type="submit" value="Buscar" data-i18n-value="index.enviar" />
                </form>
            </div>

            <div id="headerDerecha">

                <div class="menu-container">
                    <button type="button" class="menu-btn" id="menuBtn" aria-label="Menú">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div class="menu-dropdown" id="menuDropdown">
                        <a href="../index/index.html">Mapa</a>
                        <a href="../aparkt/aparkt.html">Aparkt</a>
                        <a href="../login/login.html">Log In</a>
                        <a href="../signup/signup.html">Sign Up</a>
                    </div>
                </div>

                <button type="button" class="icon-btn" id="cambiarIdioma" aria-label="Cambiar idioma">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16">
                        <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" stroke="#666" stroke-width="1.2" fill="none"/>
                        <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31" stroke="#666" stroke-width="1.2" fill="none"/>
                    </svg>
                </button>

                <button type="button" class="icon-btn" id="perfilUsuario" aria-label="Perfil de usuario">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" stroke="#666" stroke-width="1.2" fill="none"/>
                    </svg>
                </button>

                <button type="button" class="icon-btn" id="modoOscuro" aria-label="Cambiar tema">
                    <svg class="icon-sol" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <svg class="icon-luna" style="display:none" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </button>

            </div>

        </header>
        `;
    }

    initJS() {
        const formBusqueda = this.querySelector('#form-busqueda-header');
        if (formBusqueda) {
            formBusqueda.addEventListener('submit', (e) => {
                e.preventDefault();
                const inputBusqueda = this.querySelector('#busqueda-header');
                if (inputBusqueda && inputBusqueda.value.trim()) {
                    const evento = new CustomEvent('buscarDireccion', {
                        detail: { direccion: inputBusqueda.value.trim() }
                    });
                    document.dispatchEvent(evento);
                }
            });
        }

        const menuBtn = this.querySelector('#menuBtn');
        const menuDropdown = this.querySelector('#menuDropdown');
        
        if (menuBtn && menuDropdown) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                menuDropdown.classList.remove('active');
            });
        }

        const btnIdioma = this.querySelector('#cambiarIdioma');
        if (btnIdioma) {
            btnIdioma.addEventListener('click', async () => {
                await import('./ModalIdioma.js');
                const modal = document.createElement('modal-idioma');
                document.body.appendChild(modal);
            });
        }
    }
}

customElements.define(
    "header-map",
    HeaderMap
);