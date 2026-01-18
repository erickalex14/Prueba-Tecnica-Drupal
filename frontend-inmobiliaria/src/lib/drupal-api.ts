const API_URL = process.env.NEXT_PUBLIC_DRUPAL_API_URL;

if (!API_URL) {
  throw new Error("La variable NEXT_PUBLIC_DRUPAL_API_URL no está definida");
}


//Wrapper genérico para fetch compatible con Server Components.

export async function drupalFetch<T>(endpoint: string): Promise<T[]> {
  const url = `${API_URL}/api/v1/${endpoint}?_format=json`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache Strategy:
      // 'force-cache' = Static Site Generation (SSG) - Muy rápido
      // 'no-store' = Server Side Rendering (SSR) - Datos frescos siempre
      // { next: { revalidate: 60 } } = Incremental Static Regeneration (ISR)
      cache: 'no-store', // Usamos no-store por ahora para desarrollo
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T[]; // Casteamos la respuesta a la interfaz genérica T
  } catch (error) {
    console.error(`[Drupal API Error] ${endpoint}:`, error);
    return []; // Retornamos array vacío para no romper la UI (Fail Safe)
  }
}