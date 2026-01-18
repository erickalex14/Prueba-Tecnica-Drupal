import { drupalFetch } from "../lib/drupal-api";
import { Agente } from "../types/index";

export const AgentesService = {
  getAll: async (): Promise<Agente[]> => {
    return await drupalFetch<Agente>("agentes");
  },

  // Obtiene un agente por su nombre.
  //util para buscar agentes específicos.
  getByNombre: async (nombre: string): Promise<Agente | undefined> => {
    const todos = await drupalFetch<Agente>("agentes");
    return todos.find(agente => 
      agente.title.toLowerCase() === nombre.toLowerCase()
    );
  }
};