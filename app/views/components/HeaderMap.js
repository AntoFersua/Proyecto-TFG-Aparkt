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
            top: 18px;
            left: 50%;
            transform: translateX(-50%);

            width: calc(100% - 40px);
            max-width: 1450px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 12px 18px;

            background: rgba(255, 255, 255, 0.96);

            border: 1px solid rgba(92, 122, 72, 0.15);

            border-radius: 22px;

            backdrop-filter: blur(12px);

            box-shadow:
                0 4px 18px rgba(0,0,0,0.08),
                0 2px 6px rgba(0,0,0,0.04);

            z-index: 9999;

            font-family: "Inter", sans-serif;
        }

        .logoHeader {
            display: flex;
            align-items: center;
            min-width: 180px;
        }

        .logoHeader img {
            height: 52px;
            object-fit: contain;
        }

        .navPrincipal {
            flex: 1;
            display: flex;
            justify-content: center;
        }

        .navPrincipal ul {
            position: relative;

            display: flex;
            align-items: center;
            gap: 10px;

            list-style: none;

            padding: 8px;
            margin: 0;

            background: #f7f7f4;

            border: 1px solid #dde5d6;

            border-radius: 18px;

            overflow: hidden;
        }

        .navPrincipal ul li {
            position: relative;
            z-index: 2;
        }

        .navPrincipal ul li a {
            position: relative;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 12px 18px;

            text-decoration: none;

            color: #4b3829;

            font-size: 15px;
            font-weight: 600;

            border-radius: 14px;

            transition:
                color 0.2s ease,
                background 0.2s ease,
                transform 0.2s ease;
        }

        .navPrincipal ul li a:hover {
            color: #355126;
            background: rgba(92, 122, 72, 0.08);
        }

        .nav-circulo {
            position: absolute;

            width: 70px;
            height: 70px;

            border-radius: 50%;

            background: rgba(92, 122, 72, 0.12);

            top: 50%;
            left: 0;

            transform: translateY(-50%) scale(0);

            transition:
                transform 0.28s ease,
                left 0.28s ease;

            z-index: 0;

            pointer-events: none;
        }

        .span-delante,
        .span-detras {
            position: absolute;

            width: 70px;
            height: 70px;

            border-radius: 50%;

            top: 50%;
            left: 0;

            transform: translateY(-50%) scale(0);

            transition:
                transform 0.3s ease,
                left 0.3s ease;

            pointer-events: none;
        }

        .span-delante {
            background: rgba(92, 122, 72, 0.18);
            filter: blur(2px);
            z-index: 0;
        }

        .span-detras {
            background: rgba(92, 122, 72, 0.08);
            transform: scale(1.4);
            filter: blur(10px);
            z-index: 0;
        }

        #headerDerecha {
            display: flex;
            align-items: center;
            gap: 10px;

            min-width: 180px;
            justify-content: flex-end;
        }

        #headerDerecha button {
            width: 46px;
            height: 46px;

            display: flex;
            align-items: center;
            justify-content: center;

            border: none;
            border-radius: 14px;

            background: #5c7a48;

            cursor: pointer;

            transition:
                transform 0.2s ease,
                background 0.2s ease,
                box-shadow 0.2s ease;
        }

        #headerDerecha button:hover {
            background: #4e683d;

            transform: translateY(-2px);

            box-shadow: 0 6px 14px rgba(92, 122, 72, 0.22);
        }

        @media (max-width: 1100px) {

            header {
                flex-direction: column;
                gap: 16px;
                padding: 16px;
            }

            .navPrincipal {
                width: 100%;
            }

            .navPrincipal ul {
                width: 100%;
                justify-content: center;
                flex-wrap: wrap;
            }

            #headerDerecha {
                width: 100%;
                justify-content: center;
            }
        }

        </style>

        <header>

            <div class="logoHeader">
                <img src="../assets/imagotipoAparkt.webp" alt="Logo">
            </div>

            <nav class="navPrincipal">
                <ul>
                    <li><a href="../index/index.html">Mapa</a></li>
                    <li><a href="../aparkt/aparkt.html">Aparkt</a></li>
                    <li><a href="../login/login.html">Log In</a></li>
                    <li><a href="../signup/signup.html">Sign Up</a></li>
                </ul>
            </nav>

            <div id="headerDerecha">

                <button type="button" id="cambiarIdioma">
                    🌍
                </button>

                <button type="button" id="perfilUsuario">
                    👤
                </button>

                <button type="button" id="modoOscuro">
                    🌙
                </button>

            </div>

        </header>
        `;
    }

    initJS() {

        const navUl = this.querySelector(".navPrincipal ul");

        if (navUl) {

            const navLinks = this.querySelectorAll(".navPrincipal ul li");

            let spanDelante = document.createElement("span");
            spanDelante.className = "span-delante";
            navUl.appendChild(spanDelante);

            let spanDetras = document.createElement("span");
            spanDetras.className = "span-detras";
            navUl.appendChild(spanDetras);

            let circle = document.createElement("div");
            circle.className = "nav-circulo";
            navUl.appendChild(circle);

            function moverCirculo(li) {

                const liRect = li.getBoundingClientRect();
                const ulRect = navUl.getBoundingClientRect();

                const left =
                    liRect.left -
                    ulRect.left +
                    liRect.width / 2 -
                    35;

                circle.style.transform =
                    `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;

                spanDelante.style.transform =
                    `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;

                spanDetras.style.transform =
                    `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
            }

            function ocultarCirculo() {

                circle.style.transform =
                    "translateY(-50%) scale(0)";

                spanDelante.style.transform =
                    "translateY(-50%) scale(0)";

                spanDetras.style.transform =
                    "translateY(-50%) scale(0)";
            }

            navLinks.forEach((li) => {

                li.addEventListener(
                    "mouseenter",
                    () => moverCirculo(li)
                );
            });

            navUl.addEventListener(
                "mouseleave",
                ocultarCirculo
            );
        }
    }
}

customElements.define(
    "header-map",
    HeaderMap
);