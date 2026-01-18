// src/services/inmuebles.service.ts
import { drupalFetch } from "../lib/drupal-api";
import { Inmueble } from "../types/index";

// Definimos una interfaz para los filtros (Tipado fuerte)
interface InmuebleFiltros {
  ciudad?: string;
  estado?: 'Venta' | 'Alquiler' | 'Todos';
  precioMin?: number;
  precioMax?: number;
}

export const InmueblesService = {

  // Obtiene todos los inmuebles sin filtrar.
  getAll: async (): Promise<Inmueble[]> => {
    return await drupalFetch<Inmueble>("inmuebles");
  },

  // Obtiene los inmuebles destacados (los primeros 3).
  getDestacados: async (): Promise<Inmueble[]> => {
    const todos = await drupalFetch<Inmueble>("inmuebles");
    return todos.slice(0, 3);
  },

  // Obtiene un inmueble por su ID.
  getById: async (id: string): Promise<Inmueble | undefined> => {
    const todos = await drupalFetch<Inmueble>("inmuebles");
    return todos.find((casa) => casa.nid === id);
  },

  // Filtra los inmuebles según los criterios proporcionados.
  filtrar: async ({ ciudad, estado, precioMin, precioMax }: InmuebleFiltros): Promise<Inmueble[]> => {
    // 1. Obtener todos los inmuebles
    let resultados = await drupalFetch<Inmueble>("inmuebles");

    // 2. Aplicamos Pipeline de filtros
    if (ciudad) {
      resultados = resultados.filter(item => 
        item.field_ciudad.toLowerCase().includes(ciudad.toLowerCase())
      );
    }

    if (estado && estado !== 'Todos') {
      resultados = resultados.filter(item => 
        item.field_estado.toLowerCase() === estado.toLowerCase()
      );
    }

    // Nota: Convertimos el precio de String a Number para comparar matemáticamente
    if (precioMin !== undefined) {
      resultados = resultados.filter(item => parseFloat(item.field_precio) >= precioMin);
    }

    if (precioMax !== undefined) {
      resultados = resultados.filter(item => parseFloat(item.field_precio) <= precioMax);
    }

    return resultados;
  }
};