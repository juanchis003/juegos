// main.js
// Pantalla de carga animada y transición al menú con música
window.onload = function() {
  const root = document.getElementById('root');
  // Pantalla de carga inicial con animación
  root.innerHTML = `
    <style>
      @keyframes pulso {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      .pulso {
        animation: pulso 1s infinite;
        cursor: pointer;
        image-rendering: pixelated;
      }
      .pantalla-carga {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #181824;
      }
      .presiona-texto {
        color: #ffe066;
        font-family: monospace;
        font-size: 2rem;
        text-shadow: 2px 2px #000;
        margin-top: 1.5em;
        letter-spacing: 2px;
      }
    </style>
    <div class="pantalla-carga">
      <img id="muñequito" src="assets/sprites/personaje.png" alt="Presiona" width="128" height="128" class="pulso">
      <div class="presiona-texto">¡Presióname!</div>
    </div>
  `;

  // Esperar a que el usuario presione el muñequito
  document.getElementById('muñequito').onclick = function() {
    mostrarMenuInicio();
  };

  function mostrarMenuInicio() {
    // Crear y reproducir música de fondo solo al entrar al menú
    const audio = document.createElement('audio');
    audio.src = 'assets/audio/musica-menuinicio.mp3';
    audio.loop = true;
    audio.volume = 0.5;
    audio.autoplay = true;
    document.body.appendChild(audio);
    audio.play();

    root.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#222;position:relative;overflow:hidden;">
        <img src="assets/sprites/fondo.png" alt="Fondo" style="position:absolute;top:0;left:0;width:100vw;height:100vh;object-fit:cover;z-index:0;image-rendering:pixelated;filter:contrast(1.1) brightness(0.95);">
        <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;">
        <h1 style="font-family:monospace;color:#ffe066;font-size:3rem;text-shadow:2px 2px #000;letter-spacing:2px;">Mi Juego Retro</h1>
        <img src="assets/sprites/personaje.png" alt="Héroe" style="image-rendering:pixelated;width:128px;height:128px;margin:32px 0;">
        <button id="startBtn" style="font-size:2rem;padding:0.5em 2em;background:#ffe066;color:#222;border:none;border-radius:8px;box-shadow:0 2px #000;cursor:pointer;font-family:monospace;">Iniciar Juego</button>
      </div>
    </div>
  `;

    document.getElementById('startBtn').onclick = function() {
      // Detener la música del menú
      audio.pause();
      audio.currentTime = 0;
      // Iniciar música del nivel 1
      let audioNivel1 = document.createElement('audio');
      audioNivel1.src = 'assets/audio/musica_nivel1.mp3';
      audioNivel1.loop = true;
      audioNivel1.volume = 0.5;
      audioNivel1.autoplay = true;
      document.body.appendChild(audioNivel1);
      audioNivel1.play();
      // Mostrar pantalla de juego real
      mostrarPantallaJuego();
    };

    function mostrarPantallaJuego() {
      root.innerHTML = `
        <div id="juego" style="position:relative;width:100vw;height:100vh;overflow:hidden;background:#222;">
          <img src="assets/sprites/fondo_nivel1.png" alt="Fondo Nivel 1" style="position:absolute;top:0;left:0;width:100vw;height:100vh;object-fit:cover;z-index:0;image-rendering:pixelated;filter:contrast(1.1) brightness(0.95);">
          <img id="momia" src="assets/sprites/momia.png" alt="Enemigo Momia" style="position:absolute;left:70vw;top:60vh;width:128px;height:128px;z-index:1;image-rendering:pixelated;">
          <img id="jugador" src="assets/sprites/personaje.png" alt="Jugador" style="position:absolute;left:50%;top:60%;transform:translate(-50%,-50%);width:128px;height:128px;z-index:2;image-rendering:pixelated;">
          <div id="barra-vida" style="position:absolute;top:20px;right:40px;z-index:3;width:200px;height:24px;background:#222;border:2px solid #ffe066;border-radius:12px;overflow:hidden;">
            <div id="vida" style="height:100%;width:100%;background:#ff4d6d;transition:width 0.2s;"></div>
          </div>
          <div style="position:absolute;top:10px;left:10px;z-index:4;color:#ffe066;font-family:monospace;font-size:1.5rem;text-shadow:1px 1px #000;">¡Juego en marcha!<br><span style='font-size:1rem;'>Usa WASD para moverte</span></div>
        </div>
      `;
      // Movimiento del personaje con WASD y animación de sprites
      const jugador = document.getElementById('jugador');
      const barraVida = document.getElementById('vida');
      let x = window.innerWidth / 2;
      let y = window.innerHeight * 0.6;
      const velocidad = 5;
      let direccion = '';
      let vidas = 3;
      let invencible = false;
      let parpadeoInterval = null;
      // Momias
      let momias = [
        {
          dom: (() => {
            const m = document.getElementById('momia');
            return m;
          })(),
          x: window.innerWidth * 0.7,
          y: window.innerHeight * 0.6,
          velocidad: 2.5 + Math.random()*1.5
        }
      ];
      function moverJugador() {
        jugador.style.left = x + 'px';
        jugador.style.top = y + 'px';
      }
      function moverMomias() {
        momias.forEach(momia => {
          momia.dom.style.left = momia.x + 'px';
          momia.dom.style.top = momia.y + 'px';
        });
      }
      function agregarMomia() {
        const divJuego = document.getElementById('juego');
        const nueva = document.createElement('img');
        nueva.src = 'assets/sprites/momia.png';
        nueva.alt = 'Enemigo Momia';
        nueva.style.position = 'absolute';
        nueva.style.width = '128px';
        nueva.style.height = '128px';
        nueva.style.zIndex = '1';
        nueva.style.imageRendering = 'pixelated';
        // Spawn en borde aleatorio
        let px, py;
        if (Math.random() < 0.5) {
          px = Math.random() < 0.5 ? 0 : window.innerWidth-128;
          py = Math.random() * (window.innerHeight-128);
        } else {
          px = Math.random() * (window.innerWidth-128);
          py = Math.random() < 0.5 ? 0 : window.innerHeight-128;
        }
        nueva.style.left = px + 'px';
        nueva.style.top = py + 'px';
        divJuego.appendChild(nueva);
        momias.push({ dom: nueva, x: px, y: py, velocidad: 2.5 + Math.random()*1.5 });
      }
      moverJugador();
      moverMomias();
      const teclas = { w: false, a: false, s: false, d: false };
      document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() in teclas) teclas[e.key.toLowerCase()] = true;
      });
      document.addEventListener('keyup', (e) => {
        if (e.key.toLowerCase() in teclas) teclas[e.key.toLowerCase()] = false;
      });
      function actualizarSprite() {
        if (teclas.d) {
          if (direccion !== 'derecha') {
            jugador.src = 'assets/sprites/personaje_derecha.png';
            direccion = 'derecha';
          }
        } else if (teclas.w) {
          if (direccion !== 'atras') {
            jugador.src = 'assets/sprites/personaje_atras.png';
            direccion = 'atras';
          }
        } else {
          if (direccion !== 'frente') {
            jugador.src = 'assets/sprites/personaje.png';
            direccion = 'frente';
          }
        }
      }
      function actualizarBarraVida() {
        barraVida.style.width = (vidas / 3 * 100) + '%';
      }
      function colisiona(ax, ay, bx, by, size=44) {
        return Math.abs(ax - bx) < size && Math.abs(ay - by) < size;
      }
      function parpadear() {
        let visible = true;
        let ticks = 0;
        invencible = true;
        if (parpadeoInterval) clearInterval(parpadeoInterval);
        parpadeoInterval = setInterval(() => {
          visible = !visible;
          jugador.style.opacity = visible ? '1' : '0.3';
          ticks++;
          if (ticks > 12) { // ~1 seg
            clearInterval(parpadeoInterval);
            jugador.style.opacity = '1';
            invencible = false;
          }
        }, 80);
      }
      actualizarBarraVida();
      // Momias persiguen al jugador
      function moverMomiasHaciaJugador() {
        momias.forEach(momia => {
          let dx = x - momia.x;
          let dy = y - momia.y;
          let dist = Math.sqrt(dx*dx + dy*dy);
          if (dist > 2) {
            momia.x += (dx/dist) * momia.velocidad;
            momia.y += (dy/dist) * momia.velocidad;
          }
        });
      }
      // Spawner de momias
      let spawner = setInterval(() => {
        agregarMomia();
      }, 4000);
      // Referencia al audio del nivel 1
      const audioNivel1 = document.querySelector('audio[src="assets/audio/musica_nivel1.mp3"]');
      function loop() {
        if (teclas.w && y > 0) y -= velocidad;
        if (teclas.s && y < window.innerHeight - 128) y += velocidad;
        if (teclas.a && x > 0) x -= velocidad;
        if (teclas.d && x < window.innerWidth - 128) x += velocidad;
        moverJugador();
        moverMomiasHaciaJugador();
        moverMomias();
        actualizarSprite();
        // Colisión con todas las momias
        momias.forEach(momia => {
          if (!invencible && colisiona(x, y, momia.x, momia.y)) {
            // Sonido de golpe de momia
            const audioPunio = document.createElement('audio');
            audioPunio.src = 'assets/audio/puño_momia.mp3';
            audioPunio.volume = 0.7;
            audioPunio.play();
            setTimeout(()=>audioPunio.remove(),2000);
            vidas--;
            actualizarBarraVida();
            parpadear();
          }
        });
        // Si pierdes todas las vidas, vuelve al menú
        if (vidas <= 0) {
          clearInterval(spawner);
          if (audioNivel1) {
            audioNivel1.pause();
            audioNivel1.currentTime = 0;
            audioNivel1.remove();
          }
          setTimeout(() => {
            mostrarMenuInicio();
          }, 800);
          return;
        }
        requestAnimationFrame(loop);
      }
      loop();
    }
  }
};
