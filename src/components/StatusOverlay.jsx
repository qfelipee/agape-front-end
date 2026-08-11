import "./StatusOverlay.css";

function StatusOverlay({ titulo, subtitulo, tipo = "boas-vindas" }) {
  return (
    <div className="status-overlay">
      <div className="status-card">
        <div className={`status-icone status-icone-${tipo}`}>
          {tipo === "boas-vindas" ? "✓" : "→"}
        </div>
        <h2>{titulo}</h2>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
    </div>
  );
}

export default StatusOverlay;