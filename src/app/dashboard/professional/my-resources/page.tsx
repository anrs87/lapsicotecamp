'use client'; // Necesario para usar hooks de React como useState, useEffect y useRouter

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Importa deleteDoc y doc para la eliminación
import { db, auth } from '@/utils/firebaseConfig'; // Importa tu instancia de Firestore y auth
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, FileText, Headphones, Video, Link as LinkIcon, Edit, Trash2, ArrowLeft } from 'lucide-react'; // Iconos
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Interfaz para definir la estructura de un recurso
interface Resource {
    id: string; // ID del documento de Firestore
    title: string;
    description: string;
    type: string; // 'multiple', 'link'
    price: number;
    mercadoPagoLink: string;
    filePaths: string[]; // Array de URLs de archivos
    coverImageUrl?: string; // URL de la imagen de portada
    professionalId: string;
    professionalName: string;
    createdAt: Date;
}

export default function MyResourcesPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null); // Usamos 'any' por simplicidad, idealmente User | null
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Efecto para verificar la autenticación y cargar los recursos del profesional
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Ahora que tenemos el usuario, podemos cargar sus recursos
                await fetchMyResources(currentUser.uid);
            } else {
                // Si no hay usuario logueado, redirigir al inicio
                router.push('/');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]); // Dependencia en router

    const fetchMyResources = async (professionalId: string) => {
        setLoading(true);
        try {
            // Consulta los recursos que pertenecen a este profesional
            const q = query(
                collection(db, "resources"),
                where("professionalId", "==", professionalId)
            );
            const querySnapshot = await getDocs(q);

            const fetchedResources: Resource[] = [];
            querySnapshot.forEach((document) => {
                const data = document.data(); // Get all data from the document

                fetchedResources.push({
                    id: document.id,
                    title: data.title || 'Sin título', // Provide default values if undefined
                    description: data.description || 'Sin descripción.',
                    type: data.type || 'multiple', // Default type
                    price: data.price !== undefined ? parseFloat(data.price) : 0, // Ensure price is a number
                    mercadoPagoLink: data.mercadoPagoLink || '#', // Default link
                    filePaths: data.filePaths || [], // Ensure filePaths is an array
                    coverImageUrl: data.coverImageUrl || '', // Ensure coverImageUrl is a string
                    professionalId: data.professionalId || professionalId,
                    professionalName: data.professionalName || 'Desconocido',
                    createdAt: data.createdAt?.toDate() || new Date() // Convert Timestamp to Date, or provide new Date
                } as Resource);
            });
            setResources(fetchedResources);
        } catch (err) {
            console.error("Error al cargar mis recursos:", err);
            setError("Hubo un error al cargar tus recursos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResource = async (resourceId: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este recurso? Esta acción no se puede deshacer.")) {
            try {
                await deleteDoc(doc(db, "resources", resourceId));
                // Actualizar la lista de recursos en el estado
                setResources(prevResources => prevResources.filter(res => res.id !== resourceId));
                console.log("Recurso eliminado exitosamente!");
            } catch (err) {
                console.error("Error al eliminar el recurso:", err);
                setError("Error al eliminar el recurso. Por favor, inténtalo de nuevo.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-xl text-primary">Cargando tus recursos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-lg text-foreground/70 mb-6">{error}</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-headline font-bold text-primary mb-8 text-center">Mis Recursos</h1>

            <div className="flex justify-end mb-6">
                <Button asChild>
                    <Link href="/resources/upload">Subir Nuevo Recurso</Link>
                </Button>
            </div>

            {resources.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-xl text-foreground/70 mb-4">Aún no has subido ningún recurso.</p>
                    <Button asChild>
                        <Link href="/resources/upload">Subir mi primer recurso</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <Card key={resource.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                            {/* Fallback for cover image if not present */}
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
                                            <FileText className="h-3 w-3" /> Multi-archivos ({resource.filePaths?.length || 0}) {/* Added optional chaining and default */}
                                        </Badge>
                                    )}
                                    {resource.createdAt && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            Publicado: {new Date(resource.createdAt).toLocaleDateString()}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={resource.mercadoPagoLink} target="_blank" rel="noopener noreferrer">
                                            Ver en Mercado Pago
                                        </Link>
                                    </Button>
                                    {/* Botones de acción: Editar y Eliminar */}
                                    <Button variant="ghost" size="icon" onClick={() => router.push(`/resources/edit/${resource.id}`)}>
                                        <Edit className="h-5 w-5 text-blue-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteResource(resource.id)}>
                                        <Trash2 className="h-5 w-5 text-red-500" />
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
