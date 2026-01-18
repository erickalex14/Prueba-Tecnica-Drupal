import { Navbar } from "@/components/ui/navbar";
import { PropertiesGrid } from "@/components/ui/porperties-grid";
import { InmueblesService } from "@/services/inmuebles.service";

export default async function PropiedadesPage() {
  // 1. Obtener datos en el servidor (SSR)
  const propiedades = await InmueblesService.getAll();

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      {/* --- HEADER CON TEXTURA --- */}
      <div className="relative bg-slate-900 pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Patrón de puntos (Dot Pattern) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        {/* Luz ambiental central */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-green-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider">
                Catálogo 2026
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Propiedades Exclusivas
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
                Encuentra espacios diseñados para inspirar. Filtrado inteligente para tu comodidad.
            </p>
        </div>
      </div>

      {/* --- CONTENIDO CON FILTROS --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <PropertiesGrid initialData={propiedades} />
      </div>
    </main>
  );
}