export interface Rol {
  id: number;
  nombreRol: string;
}

export interface Usuario {
  id: number;
  userName: string;
  password?: string;
  enabled: boolean;
  roles: Rol[];
}

export type UsuarioForm = Omit<Usuario, 'id'>;
