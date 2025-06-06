'use client'; // This line is CRUCIAL for the component to work on the client side!

import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore'; // Import query and getDocs
import { db } from '@/utils/firebaseConfig'; // Import your Firestore instance
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Image as ImageIcon, FileText, Headphones, Video, Link as LinkIcon } from 'lucide-react'; // Icons
import Link from 'next/link';

// Interfaz para definir la estructura de un recurso
interface Resource {
    id: string; // Document ID from Firestore
    title: string;
    description: string;
    type: string; // 'multiple', 'link'
    price: number;
    mercadoPagoLink: string;
    filePaths: string[]; // Array of file URLs
    coverImageUrl?: string; // URL of the cover image
    professionalId: string;
    professionalName: string;
    createdAt: Date;
}

export default function MarketplacePage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllResources = async () => {
            setLoading(true);
            try {
                // Query all documents in the 'resources' collection
                const q = query(collection(db, "resources"));
                const querySnapshot = await getDocs(q);

                const fetchedResources: Resource[] = [];
                querySnapshot.forEach((document) => {
                    const data = document.data();
                    fetchedResources.push({
                        id: document.id,
                        title: data.title || 'Sin título',
                        description: data.description || 'Sin descripción.',
                        type: data.type || 'multiple',
                        price: data.price !== undefined ? parseFloat(data.price) : 0,
                        mercadoPagoLink: data.mercadoPagoLink || '#',
                        filePaths: data.filePaths || [],
                        coverImageUrl: data.coverImageUrl || '',
                        professionalId: data.professionalId || '',
                        professionalName: data.professionalName || 'Profesional Desconocido',
                        createdAt: data.createdAt?.toDate() || new Date()
                    } as Resource);
                });
                setResources(fetchedResources);
            } catch (err) {
                console.error("Error al cargar los recursos del marketplace:", err);
                setError("Hubo un error al cargar los recursos. Por favor, inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllResources();
    }, []); // Empty dependency array ensures this runs once on mount

    // Basic client-side filtering logic
    const filteredResources = resources.filter(res => {
        const matchesSearch = searchTerm.trim() === '' ||
            res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.professionalName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-xl text-primary">Cargando Marketplace...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-lg text-foreground/70 mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>Recargar página</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="text-center mb-10">
                <h1 className="text-4xl font-headline font-bold text-primary mb-3">Marketplace de Recursos</h1>
                <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                    Explora y adquiere una amplia gama de recursos digitales para tu bienestar mental.
                </p>
            </section>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        placeholder="Buscar recursos por título, descripción o profesional..."
                        className="w-full pl-10 pr-4 py-2 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {filteredResources.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-xl text-foreground/70 mb-4">No se encontraron recursos disponibles en el Marketplace.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResources.map((resource) => (
                        <Card key={resource.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                            {/* Cover Image or Placeholder */}
                            {resource.coverImageUrl && (resource.coverImageUrl.startsWith('http') || resource.coverImageUrl.startsWith('data:image')) ? (
                                <div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                                    <img
                                        src={resource.coverImageUrl}
                                        alt={`Portada de ${resource.title}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = `https://placehold.co/400x200/ACC8E4/000000?text=No+Image`; }} // Fallback
                                    />
                                </div>
                            ) : (
                                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                                    <ImageIcon className="h-16 w-16 text-gray-400" />
                                </div>
                            )}
                            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-headline text-primary leading-tight">{resource.title}</CardTitle>
                                <Badge variant="secondary" className="bg-primary/10 text-primary-foreground">
                                    ${resource.price.toFixed(2)}
                                </Badge>
                            </CardHeader>
                            <CardContent className="flex-grow pt-2">
                                <CardDescription className="text-foreground/70 text-sm line-clamp-3 mb-3">
                                    {resource.description}
                                </CardDescription>
                                <div className="flex flex-wrap gap-2 text-sm text-foreground/60 mb-3">
                                    {resource.type === 'link' ? (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <LinkIcon className="h-3 w-3" /> Enlace Externo
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <FileText className="h-3 w-3" /> Multi-archivos ({resource.filePaths?.length || 0})
                                        </Badge>
                                    )}
                                    {resource.professionalName && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            Por: {resource.professionalName}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                                    {/* Link to individual resource detail page */}
                                    <Button variant="default" size="sm" asChild>
                                        <Link href={`/resources/${resource.id}`}>Ver Detalles</Link>
                                    </Button>
                                    {/* Link to Mercado Pago (for direct purchase) */}
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={resource.mercadoPagoLink} target="_blank" rel="noopener noreferrer">
                                            Comprar
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}


