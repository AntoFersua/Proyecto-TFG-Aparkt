class HeaderMap extends HTMLElement {

    connectedCallback() {
        this.render();
        this.initJS();
    }

    render() {
        this.innerHTML = `
        
        <style>

        header-map {
            display: block;
        }

        *{
            box-sizing:border-box;
        }

        header {
            position: absolute;
            top: 12px;
            left: 50%;
            transform: translateX(-50%);

            width: calc(100% - 20px);
            max-width: 800px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 8px 12px;

            background: rgba(255, 255, 255, 0.96);

            border: 1px solid rgba(0, 90, 96, 0.15);

            border-radius: 12px;

            backdrop-filter: blur(12px);

            box-shadow:
                0 4px 20px rgba(0,0,0,0.08),
                0 1px 4px rgba(0,0,0,0.04);

            z-index: 9999;

            font-family: "Inter", sans-serif;
            gap: 8px;

            transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .logoHeader {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            height: 100%;
        }

        .logoHeader img {
            height: 32px;
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
            height: 34px;
            padding: 0 14px;
            font-size: 15px;
            border: 1.5px solid rgba(0, 90, 96, 0.25);
            border-radius: 17px;
            outline: none;
            font-family: inherit;
            color: #333;
            background: #fafafa;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.3s ease, color 0.3s ease;
        }

        .buscador input[type="text"]::placeholder {
            color: #999;
        }

        .buscador input[type="text"]:focus {
            border-color: var(--color-azulOscuro);
            box-shadow: 0 1px 6px rgba(0, 90, 96, 0.15);
            background: #fff;
        }

        .buscador input[type="submit"] {
            height: 34px;
            padding: 0 16px;
            font-size: 14px;
            font-weight: 600;
            border: none;
            border-radius: 17px;
            background: var(--color-verde, rgb(52, 175, 114));
            color: white;
            cursor: pointer;
            font-family: inherit;
            box-shadow: 0 1px 3px var(--color-verde, rgb(52, 175, 114));
            transition: all 0.2s ease;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .buscador input[type="submit"]:hover {
            background: var(--color-verde, rgb(52, 175, 114));
        }

        #headerDerecha {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
        }

        .page-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;

            width: calc(100% - 20px);
            max-width: 800px;

            margin: 90px auto 0;

            position: relative;
            z-index: 2;

            font-family: "Inter", sans-serif;
        }

        .page-nav a {
            text-decoration: none;
            color: #555;
            font-size: 14px;
            font-weight: 500;
            padding: 10px 36px;

            background: rgba(255, 255, 255, 0.96);

            border: 1px solid rgba(0, 90, 96, 0.15);

            border-radius: 50px;

            backdrop-filter: blur(12px);

            box-shadow:
                0 2px 10px rgba(0,0,0,0.06),
                0 1px 4px rgba(0,0,0,0.03);

            transition: all 0.2s ease;
        }

        .page-nav a:hover {
            color: var(--color-azulOscuro);
            border-color: var(--color-azulOscuro);
            box-shadow:
                0 4px 14px var(--color-verde, rgb(52, 175, 114)),
                0 1px 4px var(--color-verde, rgb(52, 175, 114));
            transform: translateY(-1px);
        }

        .iconos-container {
            position: relative;
            display: none;
        }

        .iconos-btn {
            width: 40px;
            height: 40px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--color-verde, rgb(52, 175, 114)));
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }

        .iconos-btn:hover {
            background: var(--color-verde, #34af72);
            border-color: var(--color-verde, #34af72);
            box-shadow: 0 2px 8px var(--color-verde, rgb(52, 175, 114));
        }

        .iconos-btn:active {
            transform: scale(0.92);
        }

        .iconos-btn svg {
            width: 20px;
            height: 20px;
            stroke: #555;
            fill: none;
            transition: stroke 0.2s ease;
        }

        .iconos-btn:hover svg {
            stroke: white;
        }

        .iconos-dropdown {
            position: absolute;
            top: calc(100% + 6px);
            right: 0;
            transform: translateY(-8px);
            background: white;
            border: 1px solid rgba(0, 90, 96, 0.15);
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            min-width: 40px;
            width: 40px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 10000;
            display: none;
            flex-direction: column;
            align-items: center;
            padding: 6px 2px;
            gap: 4px;
        }

        .iconos-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            display: flex;
        }

        .iconos-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            display: flex;
        }

        .iconos-dropdown button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            padding: 0;
            border: 1px solid transparent;
            background: transparent;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
            color: #333;
        }

        .iconos-dropdown button:hover {
            background: rgba(52, 175, 114, 0.1);
            border-color: var(--color-verde, #34af72);
            color: var(--color-verde, #34af72);
        }

        .iconos-dropdown button svg {
            width: 16px;
            height: 16px;
            stroke: #666;
            fill: none;
            flex-shrink: 0;
            transition: stroke 0.15s ease;
        }

        .iconos-dropdown button:hover svg {
            stroke: var(--color-verde, #34af72);
        }

        .iconos-dropdown button span {
            display: none;
        }

        #headerDerecha button.icon-btn {
            width: 40px;
            height: 40px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(52, 175, 114, 0.15);
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }

        #headerDerecha button.icon-btn:hover {
            background: var(--color-verde, rgb(52, 175, 114));
            border-color: var(--color-verde, #34af72);
            box-shadow: 0 2px 8px rgba(52, 175, 114, 0.25);
        }

        #headerDerecha button.icon-btn:active {
            transform: scale(0.92);
        }

        #headerDerecha button.icon-btn svg {
            width: 20px;
            height: 20px;
            stroke: #555;
            fill: none;
            transition: stroke 0.2s ease;
        }

        #headerDerecha button.icon-btn:hover svg {
            stroke: white;
        }

        .nav-container {
            position: relative;
            display: none;
        }

        .nav-dropdown {
            position: absolute;
            bottom: calc(100% + 8px);
            left: 0;
            background: white;
            border: 1px solid rgba(0, 90, 96, 0.15);
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.12);
            min-width: 180px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(8px);
            transition: all 0.2s ease;
            z-index: 10000;
            display: none;
            flex-direction: column;
            padding: 6px;
            gap: 2px;
        }

        .nav-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            display: flex;
        }

        .nav-dropdown a {
            display: block;
            padding: 10px 14px;
            border: none;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            font-family: inherit;
            text-align: left;
            text-decoration: none;
            white-space: nowrap;
            transition: background 0.15s ease;
        }

        .nav-dropdown a:hover {
            background: rgba(52, 175, 114, 0.1);
            color: var(--color-verde, #34af72);
        }

        :host-context([data-theme="dark"]) .nav-dropdown,
        [data-theme="dark"] .nav-dropdown {
            background: #2a2a2a;
            border-color: rgba(0, 90, 96, 0.3);
        }

        :host-context([data-theme="dark"]) .nav-dropdown a,
        [data-theme="dark"] .nav-dropdown a {
            color: #e0e0e0;
        }

        :host-context([data-theme="dark"]) .nav-dropdown a:hover,
        [data-theme="dark"] .nav-dropdown a:hover {
            background: rgba(52, 175, 114, 0.15);
            color: var(--color-verde, #34af72);
        }

        :host-context([data-theme="dark"]) .nav-container .icon-btn,
        [data-theme="dark"] .nav-container .icon-btn {
            background: rgba(40, 40, 40, 0.8);
            border-color: rgba(255, 255, 255, 0.08);
        }

        :host-context([data-theme="dark"]) .nav-container .icon-btn:hover,
        [data-theme="dark"] .nav-container .icon-btn:hover {
            background: var(--color-verde, #34af72);
            border-color: var(--color-verde, #34af72);
        }

        :host-context([data-theme="dark"]) .nav-container .icon-btn svg,
        [data-theme="dark"] .nav-container .icon-btn svg {
            stroke: #ccc;
        }

        :host-context([data-theme="dark"]) .nav-container .icon-btn:hover svg,
        [data-theme="dark"] .nav-container .icon-btn:hover svg {
            stroke: white;
        }

        @media (max-width: 600px) {

            header {
                top: auto;
                bottom: max(12px, env(safe-area-inset-bottom));
                left: 12px;
                right: 12px;
                width: calc(100vw - 24px);
                transform: translate(0, 0);
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                padding: 8px 10px;
                gap: 5px;
                border-radius: 14px;
            }

            .logoHeader {
                order: 1;
                flex: 0 0 auto;
                align-items: center;
            }

            .logoHeader img {
                height: 26px;
            }

            #headerDerecha {
                order: 2;
                flex: 0 0 auto;
                align-items: center;
            }

            .buscador {
                order: 3;
                width: 100%;
                max-width: none;
                margin-top: 4px;
            }

            .buscador input[type="text"] {
                height: 40px;
                font-size: 16px;
                padding: 0 14px;
            }

            .buscador input[type="submit"] {
                height: 40px;
                padding: 0 14px;
                font-size: 13px;
            }

            #headerDerecha > button.icon-btn {
                display: none;
            }

            .page-nav {
                display: none;
            }

            .nav-container {
                display: block;
            }

            .iconos-container {
                display: block;
            }

            .iconos-dropdown {
                bottom: calc(100% + 6px);
                top: auto;
                transform: translateY(8px);
            }

            .iconos-dropdown.active {
                transform: translateY(0);
            }
        }

        /* Dark Mode */
        :host-context([data-theme="dark"]) header,
        [data-theme="dark"] header {
            background: rgba(30, 30, 30, 0.96);
            border-color: rgba(0, 90, 96, 0.3);
            box-shadow: 0 2px 10px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.15);
        }

        :host-context([data-theme="dark"]) .buscador input[type="text"],
        [data-theme="dark"] .buscador input[type="text"] {
            color: #e0e0e0;
            background: #2a2a2a;
            border-color: rgba(0, 90, 96, 0.35);
        }

        :host-context([data-theme="dark"]) .buscador input[type="text"]::placeholder,
        [data-theme="dark"] .buscador input[type="text"]::placeholder {
            color: #777;
        }

        :host-context([data-theme="dark"]) .buscador input[type="text"]:focus,
        [data-theme="dark"] .buscador input[type="text"]:focus {
            background: #333;
            border-color: var(--color-azulOscuro);
        }

        :host-context([data-theme="dark"]) .page-nav a,
        [data-theme="dark"] .page-nav a {
            background: rgba(30, 30, 30, 0.96);
            border-color: rgba(0, 90, 96, 0.3);
            box-shadow: 0 2px 10px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.15);
            color: #aaa;
        }

        :host-context([data-theme="dark"]) .page-nav a:hover,
        [data-theme="dark"] .page-nav a:hover {
            color: var(--color-verde);
            border-color: var(--color-verde);
        }

        :host-context([data-theme="dark"]) #headerDerecha button.icon-btn,
        [data-theme="dark"] #headerDerecha button.icon-btn {
            background: rgba(40, 40, 40, 0.8);
            border-color: rgba(255, 255, 255, 0.08);
        }

        :host-context([data-theme="dark"]) #headerDerecha button.icon-btn:hover,
        [data-theme="dark"] #headerDerecha button.icon-btn:hover {
            background: var(--color-verde, #34af72);
            border-color: var(--color-verde, #34af72);
        }

        :host-context([data-theme="dark"]) #headerDerecha button.icon-btn svg,
        [data-theme="dark"] #headerDerecha button.icon-btn svg {
            stroke: #ccc;
            transition: stroke 0.2s ease;
        }

        :host-context([data-theme="dark"]) #headerDerecha button.icon-btn:hover svg,
        [data-theme="dark"] #headerDerecha button.icon-btn:hover svg {
            stroke: white;
        }

        :host-context([data-theme="dark"]) .iconos-btn,
        [data-theme="dark"] .iconos-btn {
            background: rgba(40, 40, 40, 0.8);
            border-color: rgba(255, 255, 255, 0.08);
        }

        :host-context([data-theme="dark"]) .iconos-btn:hover,
        [data-theme="dark"] .iconos-btn:hover {
            background: var(--color-verde, #34af72);
            border-color: var(--color-verde, #34af72);
        }

        :host-context([data-theme="dark"]) .iconos-btn svg,
        [data-theme="dark"] .iconos-btn svg {
            stroke: #ccc;
            transition: stroke 0.2s ease;
        }

        :host-context([data-theme="dark"]) .iconos-btn:hover svg,
        [data-theme="dark"] .iconos-btn:hover svg {
            stroke: white;
        }

        :host-context([data-theme="dark"]) .iconos-dropdown,
        [data-theme="dark"] .iconos-dropdown {
            background: #2a2a2a;
            border-color: rgba(0, 90, 96, 0.3);
        }

        :host-context([data-theme="dark"]) .iconos-dropdown button,
        [data-theme="dark"] .iconos-dropdown button {
            color: #e0e0e0;
        }

        :host-context([data-theme="dark"]) .iconos-dropdown button:hover,
        [data-theme="dark"] .iconos-dropdown button:hover {
            background: rgba(52, 175, 114, 0.15);
            border-color: var(--color-verde, #34af72);
            color: var(--color-verde, #34af72);
        }

        :host-context([data-theme="dark"]) .iconos-dropdown button svg,
        [data-theme="dark"] .iconos-dropdown button svg {
            stroke: #aaa;
            transition: stroke 0.15s ease;
        }

        :host-context([data-theme="dark"]) .iconos-dropdown button:hover svg,
        [data-theme="dark"] .iconos-dropdown button:hover svg {
            stroke: var(--color-verde, #34af72);
        }

        :host-context([data-theme="dark"]) .icon-luna path,
        [data-theme="dark"] .icon-luna path {
            fill: #aaa;
        }

        @media (max-width: 600px) {
            :host-context([data-theme="dark"]) .page-nav,
            [data-theme="dark"] .page-nav {
                background: rgba(30, 30, 30, 0.92);
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }

            :host-context([data-theme="dark"]) .page-nav a,
            [data-theme="dark"] .page-nav a {
                color: #aaa;
                background: none;
                border: none;
                box-shadow: none;
            }

            :host-context([data-theme="dark"]) .page-nav a:hover,
            [data-theme="dark"] .page-nav a:hover {
                background: rgba(52, 175, 114, 0.15);
                color: var(--color-verde);
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
                    <input type="submit" value="Buscar" />
                </form>
            </div>

            <div id="headerDerecha">

                <div class="iconos-container">
                    <button type="button" class="iconos-btn" id="iconosBtn" aria-label="Iconos" title="Más opciones">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                    <div class="iconos-dropdown" id="iconosDropdown">
                        <button type="button" id="cambiarIdiomaDrop">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M2 12h20"/>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            <span>Idioma</span>
                        </button>
                        <button type="button" id="perfilUsuarioDrop">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <span>Perfil</span>
                        </button>
                        <button type="button" id="modoOscuroDrop">
                            <svg class="icon-sol" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                            <svg class="icon-luna" style="display:none" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#666"/>
                            </svg>
                            <span>Tema</span>
                        </button>
                    </div>
                </div>

                <div class="nav-container">
                    <button type="button" class="icon-btn" id="navBtn" aria-label="Menú de navegación" title="Menú">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div class="nav-dropdown" id="navDropdown"></div>
                </div>

                <button type="button" class="icon-btn" id="cambiarIdioma" aria-label="Cambiar idioma" title="Idioma">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                </button>

                <button type="button" class="icon-btn" id="perfilUsuario" aria-label="Perfil de usuario" title="Perfil">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </button>

                <button type="button" class="icon-btn" id="modoOscuro" aria-label="Cambiar tema" title="Tema">
                    <svg class="icon-sol" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                    <svg class="icon-luna" style="display:none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#666"/>
                    </svg>
                </button>

            </div>
        </header>

        <div class="page-nav" id="pageNav">
            <a href="../index/index.html">Mapa</a>
            <a href="../aparkt/aparkt.html">Aparkt</a>
            <a href="../login/login.html">Log In</a>
            <a href="../signup/signup.html">Sign Up</a>
        </div>
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

        const iconosBtn = this.querySelector('#iconosBtn');
        const iconosDropdown = this.querySelector('#iconosDropdown');
        
        if (iconosBtn && iconosDropdown) {
            iconosBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                iconosDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                iconosDropdown.classList.remove('active');
            });
        }

        const pageNav = this.querySelector('#pageNav');
        const navDropdown = this.querySelector('#navDropdown');
        if (pageNav && navDropdown) {
            pageNav.querySelectorAll('a').forEach(function(link) {
                navDropdown.appendChild(link.cloneNode(true));
            });
        }

        const navBtn = this.querySelector('#navBtn');
        if (navBtn && navDropdown) {
            navBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navDropdown.classList.toggle('active');
            });

            navDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            document.addEventListener('click', () => {
                navDropdown.classList.remove('active');
            });
        }

        const btnIdioma = this.querySelector('#cambiarIdioma');
        const btnIdiomaDrop = this.querySelector('#cambiarIdiomaDrop');
        
        const abrirModalIdioma = async () => {
            await import('./ModalIdioma.js');
            const modal = document.createElement('modal-idioma');
            document.body.appendChild(modal);
        };

        if (btnIdioma) {
            btnIdioma.addEventListener('click', abrirModalIdioma);
        }
        if (btnIdiomaDrop) {
            btnIdiomaDrop.addEventListener('click', (e) => {
                e.stopPropagation();
                iconosDropdown.classList.remove('active');
                abrirModalIdioma();
            });
        }

        const btnPerfil = this.querySelector('#perfilUsuario');
        const btnPerfilDrop = this.querySelector('#perfilUsuarioDrop');
        
        if (btnPerfil) {
            btnPerfil.addEventListener('click', () => {
                const evento = new CustomEvent('abrirPerfil');
                document.dispatchEvent(evento);
            });
        }
        if (btnPerfilDrop) {
            btnPerfilDrop.addEventListener('click', (e) => {
                e.stopPropagation();
                iconosDropdown.classList.remove('active');
                if (btnPerfil) btnPerfil.click();
            });
        }

        // El toggle de modo oscuro se gestiona desde modoOscuro.js
        // (incluye actualización de iconos para ambos botones)
    }
}

customElements.define(
    "header-map",
    HeaderMap
);