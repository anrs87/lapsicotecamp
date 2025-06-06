'use client'; // Necesario para usar hooks de React como useState y useEffect en el App Router

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, ShoppingBag, Users, FileText, Briefcase, ArrowRight, User as UserIcon } from 'lucide-react'; // Importar User como UserIcon para evitar conflicto con el tipo 'User' de Firebase

// Importa las funciones de autenticación y las instancias de Firebase Auth y Google Provider
import { onAuthStateChanged, User, signOut, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '@/utils/firebaseConfig'; // Asegúrate que la ruta sea correcta y el archivo exista
import { doc, getDoc, setDoc } from 'firebase/firestore'; // ¡IMPORTANTE! Asegúrate de que setDoc esté importado


export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isProfessional, setIsProfessional] = useState<boolean>(false); // Estado para el rol del usuario

  // Escucha los cambios de autenticación del usuario y carga su rol
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Si hay un usuario logueado, intentar obtener su rol de Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsProfessional(userSnap.data()?.isProfessional || false);
        } else {
          // Si no existe el documento (puede que sea la primera vez que se loguea y el setDoc aún no ha terminado),
          // asumimos que no es profesional. La lógica de setDoc lo creará.
          setIsProfessional(false);
        }
      } else {
        setIsProfessional(false); // Si no hay usuario, no es profesional
      }
      console.log("Estado de autenticación en Header:", currentUser ? currentUser.uid : "Deslogueado", "Profesional:", isProfessional);
    });
    return () => unsubscribe();
  }, [isProfessional]); // Dependencia en isProfessional para re-renderizar si cambia (ej. si se edita el perfil)

  // Función asíncrona para manejar el inicio de sesión con Google.
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Si el documento del usuario NO existe, es su primer login, lo creamos
          // ¡CORRECCIÓN AQUÍ! Usar setDoc para crear el documento
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            createdAt: new Date(),
            isProfessional: false, // Por defecto, un nuevo usuario NO es profesional
          });
          setIsProfessional(false); // Establecer el estado local
        } else {
          // Si el documento del usuario YA existe, lo actualizamos y leemos su rol
          // ¡CORRECCIÓN AQUÍ! Usar setDoc para actualizar el documento con merge: true
          await setDoc(userRef, {
            lastLoginAt: new Date(),
          }, { merge: true });
          setIsProfessional(userSnap.data()?.isProfessional || false); // Leer el rol existente
        }
      }
      console.log("Inicio de sesión con Google exitoso!");
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  // Función asíncrona para manejar el cierre de sesión.
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Limpiar el usuario local
      setIsProfessional(false); // Limpiar el estado de profesional
      console.log("Cierre de sesión exitoso!");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo de la aplicación con un Link a la página principal */}
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <Brain className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold">PsiConnect</h1>
        </Link>
        {/* Sección de navegación principal */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Botón y Link para el Marketplace */}
          <Button variant="ghost" asChild>
            <Link href="/marketplace" className="flex items-center gap-1 text-xs sm:text-sm">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden md:inline">Marketplace</span>
            </Link>
          </Button>
          {/* Botón y Link para Profesionales */}
          <Button variant="ghost" asChild>
            <Link href="/professionals" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Profesionales</span>
            </Link>
          </Button>
          {/* Botón y Link para Resumir */}
          <Button variant="ghost" asChild>
            <Link href="/summarize" className="flex items-center gap-1 text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Resumir</span>
            </Link>
          </Button>

          {/* Lógica condicional para el botón de login/logout y los paneles */}
          {user ? (
            // Si el usuario está logueado
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="hidden md:inline text-primary-foreground/80 text-xs sm:text-sm">
                Hola, {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}!
              </span>

              {/* Botón "Ver mi Perfil" solo para profesionales */}
              {isProfessional && (
                <Button size="sm" asChild className="border-accent text-accent hover:bg-accent/10 text-xs sm:text-sm">
                  <Link href="/profile/edit">
                    <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Ver mi Perfil
                  </Link>
                </Button>
              )}

              {/* Botón "Panel" para ambos roles */}
              <Button size="sm" asChild className="border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm">
                <Link href={isProfessional ? "/dashboard/professional" : "/dashboard/user"}>
                  <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Panel
                </Link>
              </Button>

              <Button size="sm" onClick={handleSignOut} variant="destructive" className="text-xs sm:text-sm">
                Cerrar sesión
              </Button>
            </div>
          ) : (
            // Si el usuario no está logueado
            <Button size="sm" onClick={handleSignIn} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Iniciar sesión
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

