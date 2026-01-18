import { Navbar } from "@/components/ui/navbar";
import { AgentesService } from "@/services/angentes.service"; 
import { IconBrandWhatsapp, IconMail, IconUser } from "@tabler/icons-react";

export default async function AgentesPage() {
  const agentes = await AgentesService.getAll();

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      {/* --- HEADER CON TEXTURA --- */}
      <div className="relative bg-slate-900 pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        {/* Luz ambiental */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-green-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Nuestro Equipo</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Profesionales dedicados a encontrar tu próxima inversión ideal. Conoce a los expertos detrás de Business IT.
            </p>
        </div>
      </div>

      {/* --- GRID DE AGENTES --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agentes.map((agente) => (
            <div key={agente.nid} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              
              {/* Avatar con borde animado */}
              <div className="w-32 h-32 rounded-full p-1 border-2 border-slate-100 group-hover:border-green-500 transition-colors mb-4 relative overflow-hidden bg-white shadow-inner">
                 {agente.field_foto_perfil ? (
                     <img 
                        src={`${process.env.NEXT_PUBLIC_DRUPAL_API_URL}${agente.field_foto_perfil}`} 
                        alt={agente.title}
                        className="w-full h-full rounded-full object-cover"
                     />
                 ) : (
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-full text-slate-300">
                        <IconUser className="w-12 h-12" />
                     </div>
                 )}
              </div>

              <h3 className="font-bold text-xl text-slate-800 mb-1">{agente.title}</h3>
              
              {/* Cargo dinámico */}
              <p className="text-xs text-green-600 font-bold mb-6 uppercase tracking-widest border-b border-slate-100 pb-2 w-full">
                  {agente.field_cargo || "Asesor Inmobiliario"}
              </p>
              
              <div className="flex gap-3 w-full mt-auto">
                {/* Botón WhatsApp */}
                {agente.field_telefono ? (
                    <a 
                      href={`https://wa.me/${agente.field_telefono.replace(/\s+/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-green-50 text-green-700 font-bold text-sm hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <IconBrandWhatsapp className="w-4 h-4" />
                        WhatsApp
                    </a>
                ) : (
                    <button disabled className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-300 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2">
                        <IconBrandWhatsapp className="w-4 h-4" />
                        WhatsApp
                    </button>
                )}
                
                {/* Botón Correo */}
                {agente.field_correo && (
                    <a 
                      href={`mailto:${agente.field_correo}`}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-800 transition-colors bg-white shadow-sm"
                    >
                        <IconMail className="w-5 h-5" />
                    </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}