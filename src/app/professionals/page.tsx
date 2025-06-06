'use client'; // Necesario para usar hooks de React como useState y useEffect

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig'; // Importa tu instancia de Firestore
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Instagram, Linkedin } from 'lucide-react'; // Iconos
import Link from 'next/link'; // Importar Link para la navegación a perfiles individuales

// Define la interfaz para un perfil de profesional
interface ProfessionalProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  specialties?: string;
  instagram?: string;
  linkedin?: string;
  // Añade aquí cualquier otro campo que guardes para profesionales
}

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState(''); // Estado para un futuro filtro por especialidad

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        // Consulta todos los documentos en la colección 'users' donde 'isProfessional' sea true
        const q = query(collection(db, "users"), where("isProfessional", "==", true));
        const querySnapshot = await getDocs(q);

        const fetchedProfessionals: ProfessionalProfile[] = [];
        querySnapshot.forEach((doc) => {
          // Asegúrate de que el UID se incluya como propiedad del objeto
          fetchedProfessionals.push({ uid: doc.id, ...doc.data() } as ProfessionalProfile);
        });
        setProfessionals(fetchedProfessionals);
      } catch (error) {
        console.error("Error al cargar profesionales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Lógica de filtrado básico en el cliente (puedes mover esto a Firestore para grandes datasets)
  const filteredProfessionals = professionals.filter(pro => {
    const matchesSearch = searchTerm.trim() === '' ||
      pro.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.specialties?.toLowerCase().includes(searchTerm.toLowerCase());

    // Futura lógica de filtro por especialidad
    const matchesSpecialty = filterSpecialty.trim() === '' ||
      pro.specialties?.toLowerCase().includes(filterSpecialty.toLowerCase());

    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-primary">Cargando profesionales...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-headline font-bold text-primary mb-3">Encontrar un Profesional</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Conecta con profesionales de la salud mental experimentados y accede a su pericia.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar por nombre, especialidad o palabra clave..."
            className="w-full pl-10 pr-4 py-2 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {/* Futuro filtro por especialidad (ej. usando un Select o botones de Badges) */}
        {/* <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <span>Filtrar por Especialidad</span>
        </Button> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProfessionals.length > 0 ? (
          filteredProfessionals.map(pro => (
            <Card key={pro.uid} className="flex flex-col items-center p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                <AvatarImage src={pro.photoURL || `https://placehold.co/96x96/ACC8E4/000000?text=${pro.displayName?.charAt(0) || pro.email?.charAt(0)}`} alt={pro.displayName || pro.email || "Profesional"} />
                <AvatarFallback>{pro.displayName?.charAt(0) || pro.email?.charAt(0) || 'P'}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-headline text-primary mb-2">{pro.displayName || pro.email}</CardTitle>
              {pro.specialties && (
                <div className="mb-3 flex flex-wrap justify-center gap-2">
                  {pro.specialties.split(',').map((spec, index) => (
                    <Badge key={index} variant="secondary" className="bg-accent/20 text-accent hover:bg-accent/30">{spec.trim()}</Badge>
                  ))}
                </div>
              )}
              <CardDescription className="text-foreground/70 mb-4 flex-grow line-clamp-3">{pro.bio || 'Sin biografía disponible.'}</CardDescription>

              <div className="flex gap-3 mt-auto">
                {pro.instagram && (
                  <a href={pro.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {pro.linkedin && (
                  <a href={pro.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                    <Linkedin className="h-6 w-6" />
                  </a>
                )}
              </div>
              {/* Botón para "Ver Perfil Completo" que llevaría a la página dinámica */}
              <Link href={`/professionals/${pro.uid}`} passHref>
                <Button variant="outline" size="sm" className="mt-4">Ver Perfil</Button>
              </Link>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-foreground/70">No se encontraron profesionales.</p>
        )}
      </div>
    </div>
  );
}
