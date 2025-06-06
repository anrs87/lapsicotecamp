'use client'; // This line is CRUCIAL for the component to work on the client side!

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Make sure this import is correct

export default function ProfessionalDashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
            <h1 className="text-4xl font-bold text-primary mb-4 text-center">Panel del Profesional</h1>
            <p className="text-lg text-foreground/70 mb-8 text-center max-w-xl">
                Aquí podrás gestionar tu perfil, subir recursos y ver tus estadísticas de ventas.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md">
                <Button asChild className="w-full">
                    <Link href="/profile/edit">Editar Perfil Profesional</Link>
                </Button>
                <Button asChild className="w-full">
                    <Link href="/resources/upload">Subir Nuevo Recurso</Link>
                </Button>
                {/* Nuevo botón para ver los recursos del profesional */}
                <Button asChild className="w-full">
                    <Link href="/dashboard/professional/my-resources">Mis Recursos</Link>
                </Button>
                {/* Nuevo botón "Ver mi perfil" que lleva a la página de edición */}
                <Button variant="outline" asChild className="w-full border-primary text-primary hover:bg-primary/10">
                    <Link href="/profile/edit">Ver mi Perfil</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/">Volver a Inicio</Link>
                </Button>
            </div>
        </div>
    );
}

