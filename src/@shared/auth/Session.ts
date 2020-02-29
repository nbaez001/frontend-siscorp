interface TokenFormat {
    access_token: string;
    expires_in: number;
    id_usuario: number;
    jti: string;
    nombres: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    username: string;
    puesto: string;
}

export class Session {

    /**
     * OBTENER EL OBJETO SESION
     */
    public static get identity(): TokenFormat {
        if (!Session.exist()) {
            return {} as TokenFormat;
        }

        return JSON.parse(atob(localStorage.getItem('session'))) as TokenFormat;
    }

    /**
     * SESION EXISTE
     */
    public static exist(): boolean {
        return localStorage.getItem('session') !== null;
    }

    /**
     * INICIAR SESION
     */
    public static start(session: TokenFormat): void {
        localStorage.setItem('session', btoa(JSON.stringify(session)));
    }

    /**
     * CERRAR SESION
     */
    public static stop(): void {
        localStorage.removeItem('session');
    }
}
