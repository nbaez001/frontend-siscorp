export class Menu {
    id_menu: number;
    id_menu_padre: string;
    id_menu_hijo: string;
    menu_texto: string;
    accion_codigo: string;
    accion_icono: string;
    menu_secuencia: number;
    cantidad_hijos: number;
    estado: number;
    nivel: number;
    hijos: Menu[];
}
