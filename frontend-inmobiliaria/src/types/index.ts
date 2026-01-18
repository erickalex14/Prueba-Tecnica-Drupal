//Tipos de datos usados en la aplicación

// Interfaz base para respuestas de Drupal que siempre traen un nid y un título
export interface DrupalNode {
  nid: string;
  title: string;
}

// Interfaz para Inmuebles 
export interface Inmueble extends DrupalNode {
  field_precio: string;
  field_ciudad: string;
  field_estado: string; // Ej: "En Venta"
  field_fecha_de_disponibilidad?: string;
  field_foto_principal: string; // URL absoluta o relativa
  field_agente_responsable?: string; // Nombre del agente 
}

// Interfaz para Agentes inmobiliarios
export interface Agente extends DrupalNode {
  field_cargo?: string;
  field_foto_perfil: string;
  field_telefono?: string;
  field_correo?: string;
}