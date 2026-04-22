/**
 * User model for the front-end.
 * Now includes structured photo/repost/mention collections to power an Instagram-like UI.
 */
export interface Photo {
  id: string;
  url: string;
  caption?: string;
  date?: string; // ISO string
}

export interface Repost {
  id: string;
  originalAuthor: { id: string; nome: string; foto?: string };
  imageUrl?: string;
  caption?: string;
  date?: string;
}

export interface Mention {
  id: string;
  byUser: { id: string; nome: string; foto?: string };
  context?: string; // short excerpt where the user was mentioned
  date?: string;
}

export interface UsuarioProps {
  id: string;
  nome: string;
  email?: string;
  fotoPerfil?: string;
}

// Keep only named exports for types