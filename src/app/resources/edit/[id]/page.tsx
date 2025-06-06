'use client'; // This line is CRUCIAL for the component to work on the client side!

import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import setDoc for updating
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Import deleteObject for deleting files
import { db, auth, storage } from '@/utils/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import { XCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react'; // ¡CORRECCIÓN! Importado ImageIcon


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

export default function EditResourcePage() { // Make sure this is EditResourcePage
    const router = useRouter();
    const { id } = useParams(); // Get resource ID from URL
    const [user, setUser] = useState<any>(null);
    const [resource, setResource] = useState<Resource | null>(null); // State for the resource being edited
    const [initialFilePaths, setInitialFilePaths] = useState<string[]>([]); // To track existing file paths
    const [initialCoverImageUrl, setInitialCoverImageUrl] = useState<string | undefined>(''); // To track existing cover image
    const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]); // New files to upload
    const [newCoverImageFile, setNewCoverImageFile] = useState<File | null>(null); // New cover image file
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverImageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (!currentUser) {
                router.push('/'); // Redirect if not logged in
                return;
            }
            setUser(currentUser);

            if (!id || typeof id !== 'string') {
                setError("ID de recurso no válido.");
                setLoading(false);
                return;
            }

            // Fetch the resource details
            try {
                const resourceRef = doc(db, "resources", id);
                const resourceSnap = await getDoc(resourceRef);

                if (resourceSnap.exists()) {
                    const data = resourceSnap.data(); // Get raw data
                    // Ensure the logged-in user is the owner of this resource
                    if (data.professionalId !== currentUser.uid) {
                        setError("No tienes permiso para editar este recurso.");
                        setLoading(false);
                        return;
                    }
                    // CORRECCIÓN: Construir el objeto resource sin duplicar el 'id' y tipar correctamente
                    setResource({
                        id: resourceSnap.id, // Usar el ID del documento de Firestore
                        title: data.title || '',
                        description: data.description || '',
                        type: data.type || 'multiple',
                        price: data.price !== undefined ? parseFloat(data.price) : 0,
                        mercadoPagoLink: data.mercadoPagoLink || '',
                        filePaths: data.filePaths || [],
                        coverImageUrl: data.coverImageUrl || '',
                        professionalId: data.professionalId,
                        professionalName: data.professionalName,
                        createdAt: data.createdAt?.toDate() || new Date(),
                    } as Resource); // Asegurarse de que el tipo sea Resource
                    setInitialFilePaths(data.filePaths || []);
                    setInitialCoverImageUrl(data.coverImageUrl || '');
                } else {
                    setError("Recurso no encontrado.");
                }
            } catch (err) {
                console.error("Error al cargar el recurso para edición:", err);
                setError("Hubo un error al cargar el recurso.");
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [id, router]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setResource(prev => prev ? { ...prev, [id]: value } : null);
    };

    const handleSelectChange = (value: string) => {
        setResource(prev => prev ? { ...prev, type: value, filePaths: [] } : null);
        if (value === 'link') {
            setNewSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewSelectedFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveExistingFile = async (fileUrlToRemove: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este archivo? Se eliminará de forma permanente.")) {
            try {
                // Delete from Storage
                const fileRef = ref(storage, fileUrlToRemove); // Note: this works if fileUrlToRemove is a full GCS URL
                await deleteObject(fileRef);

                // Update resource state (filePaths)
                setResource(prev => prev ? { ...prev, filePaths: prev.filePaths.filter(url => url !== fileUrlToRemove) } : null);
                console.log("Archivo eliminado de Storage y de Firestore.");
            } catch (err) {
                console.error("Error al eliminar el archivo:", err);
                setError("Error al eliminar el archivo. Por favor, inténtalo de nuevo.");
            }
        }
    };

    const handleRemoveNewFile = (fileName: string) => {
        setNewSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };


    const handleNewCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewCoverImageFile(e.target.files[0]);
            setResource(prev => prev ? { ...prev, coverImageUrl: URL.createObjectURL(e.target.files![0]) } : null);
        } else {
            setNewCoverImageFile(null);
            setResource(prev => prev ? { ...prev, coverImageUrl: initialCoverImageUrl || '' } : null); // Revert to initial if no new file
        }
    };

    const slugify = (text: string) => {
        return text
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !resource) return;

        if (!resource.title.trim() || !resource.description.trim() || !resource.price || !resource.mercadoPagoLink.trim()) {
            setError("Por favor, rellena todos los campos obligatorios.");
            return;
        }

        setSubmitting(true);
        let finalFilePaths = [...resource.filePaths]; // Start with existing file paths
        let finalCoverImageUrl = resource.coverImageUrl;

        try {
            const resourceSlug = slugify(resource.title);

            // --- Upload new cover image (if selected) ---
            if (newCoverImageFile) {
                // Optional: delete old cover image from storage if it exists
                if (initialCoverImageUrl && initialCoverImageUrl.startsWith('https://firebasestorage.googleapis.com')) {
                    const oldCoverRef = ref(storage, initialCoverImageUrl);
                    try {
                        await deleteObject(oldCoverRef);
                        console.log("Antigua imagen de portada eliminada de Storage.");
                    } catch (delErr) {
                        console.warn("No se pudo eliminar la antigua imagen de portada de Storage:", delErr);
                    }
                }
                const coverImageRef = ref(storage, `resources/${user.uid}/${resourceSlug}/cover_image_${newCoverImageFile.name}`);
                const uploadCoverResult = await uploadBytes(coverImageRef, newCoverImageFile);
                finalCoverImageUrl = await getDownloadURL(uploadCoverResult.ref);
            } else if (!resource.coverImageUrl) {
                // If user removed the cover image and no new one selected, ensure it's empty
                finalCoverImageUrl = '';
            }


            // --- Upload new resource files ---
            if (resource.type !== 'link' && newSelectedFiles.length > 0) {
                for (const file of newSelectedFiles) {
                    const storageRef = ref(storage, `resources/${user.uid}/${resourceSlug}/${file.name}`);
                    const uploadResult = await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(uploadResult.ref);
                    finalFilePaths.push(downloadURL); // Add new URLs to the list
                }
            } else if (resource.type === 'link' && resource.filePaths.length === 0 && !resource.mercadoPagoLink.trim()) {
                setError("Para tipo 'Enlace Externo', el URL del recurso o el link de Mercado Pago son obligatorios.");
                setSubmitting(false);
                return;
            }


            // --- Update resource metadata in Firestore ---
            const resourceDocRef = doc(db, "resources", resource.id);
            await setDoc(resourceDocRef, {
                title: resource.title,
                description: resource.description,
                type: resource.type,
                price: parseFloat(resource.price.toString()), // Ensure it's a number
                mercadoPagoLink: resource.mercadoPagoLink,
                filePaths: finalFilePaths, // Save updated array of file URLs
                coverImageUrl: finalCoverImageUrl, // Save updated cover image URL
                // professionalId, professionalName, createdAt are not updated here as they are fixed
            }, { merge: true });

            console.log("Recurso actualizado exitosamente!");
            router.push('/dashboard/professional/my-resources'); // Redirect back to My Resources
        } catch (err) {
            console.error("Error al actualizar el recurso:", err);
            setError("Hubo un error al actualizar el recurso.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-xl text-primary">Cargando recurso para edición...</p>
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

    if (!resource) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
                <h1 className="text-3xl font-bold text-primary mb-4">Recurso no encontrado</h1>
                <p className="text-lg text-foreground/70 mb-6">El recurso que intentas editar no existe o no es válido.</p>
                <Button onClick={() => router.push('/dashboard/professional/my-resources')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mis Recursos
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">Editar Recurso: {resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">Título del Recurso</Label>
                            <Input
                                id="title"
                                type="text"
                                value={resource.title}
                                onChange={handleInputChange}
                                placeholder="Ej: Guía completa de ansiedad"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">Descripción</Label>
                            <Textarea
                                id="description"
                                value={resource.description}
                                onChange={handleInputChange}
                                placeholder="Describe el contenido de tu recurso..."
                                rows={4}
                                required
                            />
                        </div>

                        {/* Input for Cover Image */}
                        <div>
                            <Label htmlFor="coverImage" className="block text-sm font-medium text-foreground mb-2">Imagen de Portada (Opcional)</Label>
                            <Input
                                id="coverImage"
                                type="file"
                                accept="image/*"
                                onChange={handleNewCoverImageChange}
                                ref={coverImageInputRef}
                            />
                            {(resource.coverImageUrl && (resource.coverImageUrl.startsWith('http') || resource.coverImageUrl.startsWith('data:image'))) ? (
                                <div className="mt-2 flex items-center gap-4">
                                    <p className="text-sm text-foreground/70">Portada Actual:</p>
                                    <img src={resource.coverImageUrl} alt="Cover Preview" className="w-24 h-auto rounded-md shadow-sm" />
                                </div>
                            ) : (
                                <div className="relative w-full h-24 bg-gray-200 flex items-center justify-center rounded-md">
                                    <ImageIcon className="h-10 w-10 text-gray-400" />
                                </div>
                            )}
                        </div>
                        {/* End of Input for Cover Image */}

                        <div>
                            <Label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">Tipo de Recurso</Label>
                            <Select onValueChange={handleSelectChange} value={resource.type}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="multiple">Recurso con Archivos (PDF/Audio/Video)</SelectItem>
                                    <SelectItem value="link">Enlace Externo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Display existing files and allow removing them */}
                        {resource.type !== 'link' && resource.filePaths && resource.filePaths.length > 0 && (
                            <div className="mt-4 text-sm text-foreground/70 border border-gray-200 rounded-md p-3">
                                <p className="font-semibold mb-2">Archivos actuales:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    {resource.filePaths.map((url, index) => (
                                        <li key={url} className="flex items-center justify-between">
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate mr-2">
                                                {url.split('/').pop()} {/* Show file name */}
                                            </a>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveExistingFile(url)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {resource.type !== 'link' && (
                            <div>
                                <Label htmlFor="newFile" className="block text-sm font-medium text-foreground mb-2">Añadir Nuevos Archivo(s)</Label>
                                <Input
                                    id="newFile"
                                    type="file"
                                    onChange={handleNewFileChange}
                                    multiple={true}
                                    ref={fileInputRef}
                                />
                                {newSelectedFiles.length > 0 && (
                                    <div className="mt-4 text-sm text-foreground/70 border border-gray-200 rounded-md p-3">
                                        <p className="font-semibold mb-2">Nuevos archivos a añadir ({newSelectedFiles.length}):</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {Array.from(newSelectedFiles).map((file, index) => (
                                                <li key={file.name + index} className="flex items-center justify-between">
                                                    <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveNewFile(file.name)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        {resource.type === 'link' && (
                            <div>
                                <Label htmlFor="filePath" className="block text-sm font-medium text-foreground mb-2">URL del Recurso Externo</Label>
                                <Input
                                    id="filePath"
                                    type="url"
                                    value={resource.filePaths[0] || ''}
                                    onChange={(e) => setResource(prev => prev ? { ...prev, filePaths: [e.target.value] } : null)}
                                    placeholder="https://ejemplo.com/tu-recurso"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">Precio (USD)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={resource.price}
                                onChange={handleInputChange}
                                placeholder="Ej: 19.99"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="mercadoPagoLink" className="block text-sm font-medium text-foreground mb-2">Link de Pago de Mercado Pago</Label>
                            <Input
                                id="mercadoPagoLink"
                                type="url"
                                value={resource.mercadoPagoLink}
                                onChange={handleInputChange}
                                placeholder="https://mercadopago.com/link_de_pago"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
