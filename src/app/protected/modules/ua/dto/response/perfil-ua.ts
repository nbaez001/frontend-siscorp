export interface PerfilResponse {
    idPerfil: number;
    nombrePerfil: string;
    idUterritorial: number;
    nombreUTerritorial: string;
    idPlataforma: number;
    nombrePlataforma: string;
}

export class PerfilUA {

    /**
     * OBTENER EL OBJETO SESION
     */
    public static get identity(): PerfilResponse {
        if (!PerfilUA.exist()) {
            return JSON.parse(JSON.stringify({ idPerfil: 0 })) as PerfilResponse; //RETORNA UN PERFIL CON ID=0
        }

        return JSON.parse(atob(sessionStorage.getItem('perfilUa'))) as PerfilResponse;
    }

    /**
     * SESION EXISTE
     */
    public static exist(): boolean {
        return sessionStorage.getItem('perfilUa') !== null;
    }

    /**
     * INICIAR SESION
     */
    public static start(perfil: PerfilResponse): void {
        sessionStorage.setItem('perfilUa', btoa(JSON.stringify(perfil)));
    }

    /**
     * CERRAR SESION
     */
    public static stop(): void {
        sessionStorage.removeItem('perfilUa');
    }
}
