"use client";
import { useState } from "react";
import Link from "next/link"; // Importante para la navegación
import { Inmueble } from "@/types";
import { IconSearch, IconMapPin, IconArrowRight, IconFilter } from "@tabler/icons-react";

interface PropertiesGridProps {
  initialData: Inmueble[];
}

export const PropertiesGrid = ({ initialData }: PropertiesGridProps) => {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  // Lógica de filtrado en cliente
  const filteredData = initialData.filter((casa) => {
    const matchesText = 
      casa.title.toLowerCase().includes(filterText.toLowerCase()) || 
      casa.field_ciudad.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || casa.field_estado === statusFilter;
    
    return matchesText && matchesStatus;
  });

  const formatMoney = (amount: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));
  };

  return (
    <div className="w-full">
      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-20">
        
        {/* Buscador Texto */}
        <div className="relative w-full md:w-1/2">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por ciudad o nombre..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-700 placeholder:text-slate-400 transition-all"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        {/* Filtro Estado */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['Todos', 'Venta', 'Alquiler'].map((status) => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${
                        statusFilter === status 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>
      </div>

      {/* --- GRID DE RESULTADOS --- */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((casa) => (
            <div key={casa.nid} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
              
              {/* Imagen (Linkeable) */}
              <Link href={`/propiedades/${casa.nid}`} className="block overflow-hidden relative aspect-[4/3]">
                 <img 
                   src={`${process.env.NEXT_PUBLIC_DRUPAL_API_URL}${casa.field_foto_principal}`} 
                   alt={casa.title}
                   className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                 />
                 <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm ${
                        casa.field_estado === 'Venta' ? 'bg-green-500/90 text-white' : 'bg-blue-500/90 text-white'
                    }`}>
                        {casa.field_estado}
                    </span>
                 </div>
                 {/* Overlay hover */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </Link>

              <div className="p-6 flex flex-col flex-grow relative">
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-2 font-medium">
                    <IconMapPin className="w-4 h-4 text-green-500" />
                    {casa.field_ciudad}
                </div>
                
                <Link href={`/propiedades/${casa.nid}`}>
                    <h3 className="font-bold text-lg text-slate-800 mb-4 line-clamp-1 hover:text-green-700 transition-colors">
                        {casa.title}
                    </h3>
                </Link>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xl font-extrabold text-slate-900">{formatMoney(casa.field_precio)}</span>
                    
                    {/* Botón de acción */}
                    <Link href={`/propiedades/${casa.nid}`}>
                        <button className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all shadow-sm group-hover:shadow-md">
                            <IconArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <IconFilter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600">No se encontraron resultados</h3>
            <p className="text-slate-400">Intenta buscar en otra ciudad o cambiar el filtro de estado.</p>
        </div>
      )}
    </div>
  );
};