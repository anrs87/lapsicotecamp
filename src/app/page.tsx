'use client'; // Mantenemos esta directiva si el componente aún usa otras funcionalidades de cliente

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Users, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// No es necesario importar React, useEffect, useState, ni las funciones de auth aquí
// Las importaciones de 'firebase/auth' y '@/utils/firebaseConfig' también se eliminan de aquí.


export default function HomePage() {
    // Toda la lógica de autenticación (user state, useEffect, handleSignIn, handleSignOut)
    // se ha movido al componente Header.tsx

    return (
        <div className="space-y-12">
            <section className="text-center py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg">
                <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mb-4">Bienvenido a PsiConnect</h1>
                <p className="text-lg sm:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto px-4">
                    Tu plataforma principal para recursos de salud mental, networking profesional y herramientas impulsadas por IA.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                    <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/marketplace">
                            Explorar Recursos <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent/10">
                        <Link href="/professionals">
                            Encontrar Profesionales <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* La sección de login/logout que estaba aquí se ha movido al Header.tsx */}

            <section>
                <h2 className="text-3xl font-headline font-semibold text-center mb-8 text-primary">Características Principales</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    <FeatureCard
                        icon={<BookOpen className="h-10 w-10 text-accent" />}
                        title="Marketplace de Recursos"
                        description="Navega y compra una amplia gama de recursos digitales, desde libros electrónicos hasta guías de terapia, seleccionados por expertos."
                        link="/marketplace"
                        linkText="Visitar Marketplace"
                    />
                    <FeatureCard
                        icon={<Users className="h-10 w-10 text-accent" />}
                        title="Perfiles Profesionales"
                        description="Conecta con profesionales de la salud mental, visualiza su experiencia y accede a sus recursos compartidos."
                        link="/professionals"
                        linkText="Ver Profesionales"
                    />
                    <FeatureCard
                        icon={<FileText className="h-10 w-10 text-accent" />}
                        title="Resumen de PDF"
                        description="Utiliza nuestra herramienta impulsada por IA para resumir rápidamente documentos PDF extensos, ahorrándote tiempo y esfuerzo."
                        link="/summarize"
                        linkText="Probar Resumidor"
                    />
                </div>
            </section>

            <section className="text-center py-12 bg-card rounded-xl shadow-lg">
                <h2 className="text-3xl font-headline font-semibold text-primary mb-4">Pagos Seguros y Simplificados</h2>
                <div className="flex justify-center mb-4">
                    <Image src="https://placehold.co/300x60.png" alt="Logos de pasarelas de pago" width={300} height={60} data-ai-hint="payment logos" />
                </div>
                <p className="text-lg text-foreground/80 mb-6 max-w-xl mx-auto px-4">
                    Las transacciones se manejan de forma segura a través de Mercado Pago. El contenido comprado está disponible inmediatamente después de la validación del pago.
                </p>
                <Button variant="link" className="text-accent hover:text-accent/80" asChild>
                    <Link href="/#"> {/* Placeholder link for payment info */}
                        Más información sobre nuestro proceso de pago <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </section>

        </div>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    linkText: string;
}

function FeatureCard({ icon, title, description, link, linkText }: FeatureCardProps) {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="items-center text-center">
                <div className="p-3 bg-accent/10 rounded-full mb-4 inline-block">
                    {icon}
                </div>
                <CardTitle className="text-2xl font-headline text-primary">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex-grow flex flex-col justify-between">
                <CardDescription className="text-foreground/70 mb-4">{description}</CardDescription>
                <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent/10 mt-auto">
                    <Link href={link}>
                        {linkText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
