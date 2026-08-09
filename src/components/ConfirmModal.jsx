import "./ConfirmModal.css";

function ConfirmModal({ titulo, mensagem, onConfirmar, onCancelar, tipo = "aviso" }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-card">
        <div className={`confirm-icone confirm-icone-${tipo}`}>
          {tipo === "perigo" ? "!" : "?"}
        </div>
        <h3>{titulo}</h3>
        <p>{mensagem}</p>
        <div className="confirm-acoes">
          {onCancelar && (
            <button className="confirm-btn-cancelar" onClick={onCancelar}>
              Cancelar
            </button>
          )}
          <button
            className={`confirm-btn-ok ${tipo === "perigo" ? "confirm-btn-perigo" : ""}`}
            onClick={onConfirmar}
          >
            {onCancelar ? "Confirmar" : "Entendi"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;