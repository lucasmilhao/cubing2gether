import { Home, InfoIcon } from "lucide-react";
import "./NotFoundPage.css";
import { useNavigate } from "react-router-dom";

export interface ScatteredPiece {
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

  // ──────── TOPO ────────
  { top: "4%", left: "8%", rot: -18, size: 30 },
  { top: "14%", left: "86%", rot: 30, size: 26 },
  { top: "6%", left: "48%", rot: -8, size: 20 },
  { top: "22%", left: "25%", rot: 15, size: 18 },
  { top: "28%", left: "72%", rot: -25, size: 24 },

  // ──────── MEIO 1 ────────
  { top: "38%", left: "5%", rot: 10, size: 18 },
  { top: "42%", left: "94%", rot: -14, size: 18 },
  { top: "48%", left: "18%", rot: 22, size: 25 },
  { top: "52%", left: "82%", rot: -18, size: 21 },
  { top: "55%", left: "45%", rot: 12, size: 17 },

  // ──────── MEIO 2 ────────
  { top: "62%", left: "8%", rot: -28, size: 27 },
  { top: "68%", left: "4%", rot: 24, size: 22 },
  { top: "65%", left: "92%", rot: 18, size: 30 },
  { top: "72%", left: "25%", rot: -12, size: 20 },
  { top: "75%", left: "70%", rot: 25, size: 23 },

  // ──────── PARTE INFERIOR ────────
  { top: "78%", left: "88%", rot: -22, size: 34 },
  { top: "82%", left: "46%", rot: 16, size: 24 },
  { top: "86%", left: "12%", rot: -10, size: 19 },
  { top: "90%", left: "62%", rot: 20, size: 28 },
  { top: "94%", left: "35%", rot: -16, size: 21 },
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
