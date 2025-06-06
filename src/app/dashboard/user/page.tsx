'use client'; // ¡Esta línea es CRUCIAL para que el componente funcione en el lado del cliente!

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Asegúrate de que esta importación sea correcta

export default function UserDashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Bienvenido a tu Panel de Usuario</h1>
            <p className="text-lg text-foreground/70 mb-8 text-center max-w-xl">
                Aquí podrás ver tus compras, historial y gestionar tu cuenta de usuario.
            </p>
            <div className="flex space-x-4">
                <Button asChild>
                    <Link href="/marketplace">Explorar Marketplace</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">Volver a Inicio</Link>
                </Button>
            </div>
        </div>
    );
}
