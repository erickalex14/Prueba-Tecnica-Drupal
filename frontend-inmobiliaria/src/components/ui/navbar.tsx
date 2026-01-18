"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconHome, IconBuildingSkyscraper, IconUsers, IconPhone } from "@tabler/icons-react";

export const Navbar = () => {
  const navItems = [
    { name: "Inicio", link: "/", icon: <IconHome className="h-4 w-4" /> },
    { name: "Propiedades", link: "/propiedades", icon: <IconBuildingSkyscraper className="h-4 w-4" /> },
    { name: "Agentes", link: "/agentes", icon: <IconUsers className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed top-5 inset-x-0 max-w-2xl mx-auto z-50">
      <div className={cn(
        "relative flex items-center justify-between px-8 py-4 rounded-full",
        "bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl", // Efecto cristal
        "transition-all duration-200"
      )}>
        {/* Logo / Marca */}
        <div className="font-bold text-slate-800 text-lg tracking-tight flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
           Business IT
        </div>

        {/* Links de Navegación */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="text-sm font-medium text-slate-600 hover:text-green-700 transition-colors flex items-center gap-1"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Botón CTA */}
        <Link href="/contacto">
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-800 transition">
            Contáctanos
            </button>
        </Link>
      </div>
    </div>
  );
};