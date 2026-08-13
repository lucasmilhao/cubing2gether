import { HelpCircle, Home, InfoIcon } from "lucide-react";
import "./NotFoundPage.css";
import { useNavigate } from "react-router-dom";

interface ScatteredPiece {
  top: string;
  left: string;
  rot: number;
  size: number;
}

const FACE_COLORS = [
  "#e63946",
  "#ffe14d",
  "#2ecc71",
  "#ffffff",
  "#2f80ed",
  "#f28c28",
];

const SCATTERED_PIECES: ScatteredPiece[] = [
  { top: "4%", left: "8%", rot: -18, size: 30 },
  { top: "68%", left: "4%", rot: 24, size: 22 },
  { top: "14%", left: "86%", rot: 30, size: 26 },
  { top: "78%", left: "88%", rot: -22, size: 34 },
  { top: "42%", left: "2%", rot: 10, size: 18 },
  { top: "6%", left: "48%", rot: -8, size: 20 },
  { top: "82%", left: "46%", rot: 16, size: 24 },
  { top: "38%", left: "94%", rot: -14, size: 18 },
];

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      {/* Peças do cubo espalhadas ao fundo */}
      {SCATTERED_PIECES.map((piece, index) => {
        const color = FACE_COLORS[index % FACE_COLORS.length];

        return (
          <span
            key={index}
            aria-hidden="true"
            className="scattered-piece"
            style={{
              top: piece.top,
              left: piece.left,
              width: piece.size,
              height: piece.size,
              background: color,
              transform: `rotate(${piece.rot}deg)`,
              border:
                color === "#ffffff"
                  ? "1px solid #3a3d40"
                  : "none",
            }}
          />
        );
      })}

      <div className="not-found-content">
        <p className="not-found-code">404</p>

        <h1 className="not-found-title">
          Essa peça não encaixa em lugar nenhum
        </h1>

        <p className="not-found-description">
          A página que você procura não existe ou foi movida. Nem o
          scramble mais longo leva até ela.
        </p>

        <div className="not-found-actions">
          <button
            className="not-found-button home-button"
            onClick={() => navigate("/")}
          >
            <Home size={16} />
            Voltar ao feed
          </button>

          <button
            className="not-found-button back-button"
            onClick={() => navigate("/ajuda")}
          >
            <InfoIcon/>
            Ajuda
          </button>
        </div>
      </div>
    </div>
  );
}