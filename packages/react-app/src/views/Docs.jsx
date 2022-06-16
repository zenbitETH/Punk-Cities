export default function Docs() {


  return (
    <div className="HomeCon">
      <main className="HomeCon2">
        <div className="HowCon">
          <div className="HowTL">¿Cómo jugar?</div>
          <div className="HowGrid">
            <a href={"https://punkcity.surge.sh"}>
              <div className="HowBG">
                <div>1.  Empieza un juego nuevo</div>
                <div className="HowIcon">🎮</div>
              </div>
            </a>
            <div className="HowBG cursor-default">
              <div>2. Registra lugares públicos</div>
              <div className="HowIcon">⛲</div>
            </div>
            <div className="HowBG cursor-default">
              <div>3. Verificalos con una foto</div>
              <div className="HowIcon">📸</div>
            </div>
            <div className="HowBG cursor-default">
              <div>4. Obtén recompensas y sube de nivel </div>
              <div className="HowIcon">⚡💽</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
