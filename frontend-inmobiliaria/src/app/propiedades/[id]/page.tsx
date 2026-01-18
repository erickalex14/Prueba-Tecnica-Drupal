import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { InmueblesService } from "@/services/inmuebles.service";
import { 
  IconMapPin, 
  IconCalendarEvent, 
  IconCheck, 
  IconArrowLeft, 
  IconBrandWhatsapp,
  IconUser
} from "@tabler/icons-react";

// 1. Definimos que params es una Promesa
interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetalleInmueblePage({ params }: Props) {
  // 2. IMPORTANTE: Esperamos (await) a que los params estén listos
  const { id } = await params;

  // 3. Ahora usamos la variable 'id' limpia
  const inmueble = await InmueblesService.getById(id);

  // Si no existe, mostramos 404
  if (!inmueble) {
    notFound();
  }

  const formatMoney = (amount: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      {/* --- HEADER DE NAVEGACIÓN --- */}
      <div className="bg-slate-900 pt-32 pb-12 px-6">
         <div className="max-w-7xl mx-auto">
            <Link href="/propiedades" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium">
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Volver al catálogo
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{inmueble.title}</h1>
            <div className="flex items-center gap-2 text-green-400">
                <IconMapPin className="w-5 h-5" />
                <span className="text-lg">{inmueble.field_ciudad}</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- COLUMNA IZQUIERDA: FOTOS Y DETALLES --- */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Imagen Principal */}
                <div className="bg-white p-2 rounded-3xl shadow-xl overflow-hidden">
                    <div className="aspect-video relative rounded-2xl overflow-hidden">
                        <img 
                            src={`${process.env.NEXT_PUBLIC_DRUPAL_API_URL}${inmueble.field_foto_principal}`} 
                            alt={inmueble.title}
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                        />
                         <span className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg
                            ${inmueble.field_estado === 'Venta' ? 'bg-white/95 text-slate-900' : 'bg-green-500/95 text-white'}`}>
                            {inmueble.field_estado}
                        </span>
                    </div>
                </div>

                {/* Bloque de Información */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Detalles de la Propiedad</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="bg-green-100 p-3 rounded-full text-green-700">
                                <IconCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Estado</p>
                                <p className="text-slate-800 font-medium text-lg">Disponible para {inmueble.field_estado}</p>
                            </div>
                        </div>

                        {inmueble.field_fecha_de_disponibilidad && (
                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                                    <IconCalendarEvent className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Disponibilidad</p>
                                    <p className="text-slate-800 font-medium text-lg">
                                        {new Date(inmueble.field_fecha_de_disponibilidad).toLocaleDateString('es-ES', { 
                                            year: 'numeric', month: 'long', day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <p className="text-slate-600 leading-relaxed">
                            Esta exclusiva propiedad en <span className="font-bold text-slate-800">{inmueble.field_ciudad}</span> representa 
                            una oportunidad única en el mercado. Gestionada directamente por Business IT, garantiza seguridad y plusvalía.
                            Contáctanos hoy mismo para agendar una visita privada.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- COLUMNA DERECHA: CONTACTO Y PRECIO (Sticky) --- */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 sticky top-24">
                    <p className="text-sm text-slate-400 font-medium mb-1">Precio de oferta</p>
                    <div className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">
                        {formatMoney(inmueble.field_precio)}
                    </div>

                    <hr className="border-slate-100 mb-8" />

                    <div className="mb-6">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-4">Agente Responsable</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <IconUser className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-lg leading-none">
                                    {inmueble.field_agente_responsable || "Consultor Business IT"}
                                </p>
                                <p className="text-sm text-green-600 font-medium">Asesor Certificado</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 mb-4">
                        <IconBrandWhatsapp className="w-6 h-6" />
                        Contactar ahora
                    </button>
                    
                    <p className="text-xs text-center text-slate-400">
                        Respuesta promedio: menos de 1 hora.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </main>
  );
}