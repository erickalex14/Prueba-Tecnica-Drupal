import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { WavyBackground } from "@/components/ui/wavy-background";
import { InmueblesService } from "@/services/inmuebles.service";
import { IconMapPin, IconArrowRight, IconBrandWhatsapp, IconHomeStar, IconUsersGroup, IconShieldCheck } from "@tabler/icons-react";

export default async function Home() {
  // 1. Fetch de datos en el servidor
  const destacados = await InmueblesService.getDestacados();

  // Función auxiliar para formatear dinero
  const formatMoney = (amount: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));
  };

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <WavyBackground className="max-w-4xl mx-auto pb-20 md:pb-40 px-4" waveOpacity={0.3}>
        <div className="text-center relative z-10">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-700 text-xs font-bold uppercase tracking-wider animate-fade-in-up">
            ✨ La nueva forma de vivir
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl text-slate-800 font-extrabold inter-var leading-tight mb-6">
            Encuentra tu hogar ideal en <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Ecuador</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 font-medium inter-var max-w-xl mx-auto leading-relaxed mb-10">
            Explora las propiedades más exclusivas de Business IT. 
            Tecnología, seguridad y confort gestionados por expertos.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/propiedades">
                <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group w-full sm:w-auto">
                    Ver Propiedades
                    <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>

            <Link href="/agentes">
                <button className="px-8 py-4 rounded-full bg-white text-slate-700 border border-slate-200 font-bold hover:bg-slate-50 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
                    <IconBrandWhatsapp className="w-5 h-5 text-green-600" />
                    Contactar Asesor
                </button>
            </Link>
          </div>
        </div>
      </WavyBackground>

      {/* --- TRUST BADGES --- */}
      <section className="relative z-20 -mt-24 mx-4 md:mx-auto max-w-5xl mb-24">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-2"><IconHomeStar className="w-6 h-6"/></div>
                <h4 className="font-bold text-2xl text-slate-800">+500</h4>
                <p className="text-sm text-slate-500 font-medium">Propiedades Vendidas</p>
            </div>
            <div className="flex flex-col items-center gap-2 pt-6 md:pt-0">
                <div className="p-3 bg-green-50 text-green-600 rounded-full mb-2"><IconUsersGroup className="w-6 h-6"/></div>
                <h4 className="font-bold text-2xl text-slate-800">12 Años</h4>
                <p className="text-sm text-slate-500 font-medium">Experiencia en el mercado</p>
            </div>
            <div className="flex flex-col items-center gap-2 pt-6 md:pt-0">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-full mb-2"><IconShieldCheck className="w-6 h-6"/></div>
                <h4 className="font-bold text-2xl text-slate-800">100%</h4>
                <p className="text-sm text-slate-500 font-medium">Transacciones Seguras</p>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN DESTACADOS --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <div className="text-green-600 font-bold text-sm uppercase tracking-widest mb-2">Oportunidades</div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Destacados de la Semana
                </h2>
            </div>
            <Link href="/propiedades">
                <button className="text-slate-500 font-bold hover:text-green-700 flex items-center gap-2 transition-colors group">
                    Ver todo el catálogo <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destacados.map((casa) => (
            <div key={casa.nid} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
              
              {/* Imagen (Linkeable) */}
              <Link href={`/propiedades/${casa.nid}`} className="block relative aspect-[4/3] overflow-hidden">
                 <img 
                   src={`${process.env.NEXT_PUBLIC_DRUPAL_API_URL}${casa.field_foto_principal}`} 
                   alt={casa.title}
                   className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                 
                 <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg
                        ${casa.field_estado === 'Venta' ? 'bg-white/90 text-slate-900' : 'bg-green-500/90 text-white'}`}>
                        {casa.field_estado}
                    </span>
                 </div>
                 
                 <div className="absolute bottom-4 left-4 text-white">
                    <p className="flex items-center gap-1 text-sm font-medium drop-shadow-md">
                        <IconMapPin className="w-4 h-4 text-green-400" />
                        {casa.field_ciudad}
                    </p>
                 </div>
              </Link>

              {/* Contenido */}
              <div className="p-6 flex flex-col flex-grow">
                <Link href={`/propiedades/${casa.nid}`}>
                    <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-green-700 transition-colors line-clamp-1">
                        {casa.title}
                    </h3>
                </Link>
                
                <div className="w-full h-px bg-slate-100 my-4"></div>

                <div className="flex justify-between items-center mt-auto">
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Precio</p>
                        <span className="text-2xl font-bold text-slate-900">{formatMoney(casa.field_precio)}</span>
                    </div>
                    
                    {/* Botón flecha con Link */}
                    <Link href={`/propiedades/${casa.nid}`}>
                        <button className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-md">
                            <IconArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse" />
                <span className="font-bold text-slate-700 text-lg">Business IT Inmobiliaria</span>
            </div>
            <p className="text-slate-400 text-sm">© 2026 Desarrollado por Erick Chavarrea para una prueba tecnica.</p>
        </div>
      </footer>
    </main>
  );
}