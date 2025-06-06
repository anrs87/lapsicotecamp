'use client'; // Necesario para usar hooks de React como useState, useEffect y useRouter

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig'; // Importa tu instancia de Firestore
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Instagram, Linkedin, ArrowLeft } from 'lucide-react'; // Iconos
import { useParams, useRouter } from 'next/navigation'; // Para obtener parámetros de la URL y navegar
import Link from 'next/link';

// Define la interfaz para un perfil de profesional
interface ProfessionalProfile {
  uid: string; // El UID es parte del documento en Firestore
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  specialties?: string;
  instagram?: string;
  linkedin?: string;
  isProfessional?: boolean;
}

export default function ProfessionalDetailPage() {
  const { id } = useParams(); // Obtiene el 'id' (UID del profesional) de la URL
  const router = useRouter();
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      if (!id || typeof id !== 'string') {
        setError("ID de profesional no válido.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const professionalRef = doc(db, "users", id); // Referencia al documento del profesional
        const professionalSnap = await getDoc(professionalRef);

        if (professionalSnap.exists()) {
          const data = professionalSnap.data() as ProfessionalProfile;
          // ¡CORRECCIÓN! El UID ya viene en 'data' si lo guardamos en Firestore.
          // Solo verificamos si es profesional.
          if (data.isProfessional === true) {
            setProfessional(data);
          } else {
            setError("Usuario encontrado, pero no es un profesional. ID: " + id);
          }
        } else {
          setError("Profesional no encontrado. Por favor, verifica el ID e inténtalo de nuevo.");
        }
      } catch (err) {
        console.error("Error al cargar el perfil del profesional:", err);
        setError("Hubo un error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]); // El efecto se re-ejecutará si el ID en la URL cambia

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-primary">Cargando perfil del profesional...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error al cargar perfil</h1>
        <p className="text-lg text-foreground/70 mb-6">{error}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
        <h1 className="text-3xl font-bold text-primary mb-4">Profesional no encontrado</h1>
        <p className="text-lg text-foreground/70 mb-6">El perfil que buscas no existe o no es válido.</p>
        <Button onClick={() => router.push('/professionals')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Ver todos los profesionales
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-32 w-32 mb-4 sm:mb-0 border-4 border-primary shadow-md">
            <AvatarImage src={professional.photoURL || `https://placehold.co/128x128/ACC8E4/000000?text=${professional.displayName?.charAt(0) || professional.email?.charAt(0)}`} alt={professional.displayName || professional.email || "Profesional"} />
            <AvatarFallback>{professional.displayName?.charAt(0) || professional.email?.charAt(0) || 'P'}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-4xl font-headline font-bold text-primary mb-2">{professional.displayName || professional.email}</h1>
            <p className="text-xl text-foreground/80 mb-3">{professional.email}</p>
            {professional.specialties && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {professional.specialties.split(',').map((spec, index) => (
                  <Badge key={index} variant="secondary" className="bg-accent/20 text-accent hover:bg-accent/30">{spec.trim()}</Badge>
                ))}
              </div>
            )}
            <p className="text-foreground/70 leading-relaxed">{professional.bio || 'Este profesional aún no ha añadido una biografía.'}</p>

            <div className="flex justify-center sm:justify-start gap-4 mt-6">
              {professional.instagram && (
                <a href={professional.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600 transition-colors">
                  <Instagram className="h-8 w-8" />
                </a>
              )}
              {professional.linkedin && (
                <a href={professional.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 transition-colors">
                  <Linkedin className="h-8 w-8" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Aquí podrías añadir una sección para listar los recursos de este profesional */}
        {/* <section className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4">Recursos de este Profesional</h2>
          <p className="text-foreground/70">Próximamente: aquí se mostrarán los recursos que este profesional ha subido.</p>
        </section> */}

        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/professionals')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista de profesionales
          </Button>
        </div>
      </div>
    </div>
  );
}

