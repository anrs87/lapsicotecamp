'use client'; // Esta línea es CRUCIAL para que el componente funcione en el lado del cliente.

import React, { useState, useEffect, useRef } from 'react'; // Importar useRef
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth'; // Importar 'User' para el tipado
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '@/utils/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react'; // Icono para eliminar archivos


export default function UploadResourcePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [resource, setResource] = useState({
        title: '',
        description: '',
        type: 'multiple',
        price: '',
        mercadoPagoLink: '',
        filePaths: [] as string[],
        coverImageUrl: '', // Nuevo estado para la URL de la imagen de portada
    });
    const [allSelectedFiles, setAllSelectedFiles] = useState<File[]>([]);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null); // Nuevo estado para el archivo de la imagen de portada
    const [submitting, setSubmitting] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Ref para limpiar el campo de entrada de archivo para múltiples archivos
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Ref para limpiar el campo de entrada de archivo de la imagen de portada
    const coverImageInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/');
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setResource(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value: string) => {
        setResource(prev => ({ ...prev, type: value, filePaths: [] }));
        if (value === 'link') {
            setAllSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Convertir FileList a Array y añadir a los archivos existentes
            setAllSelectedFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
            // Limpiar el valor del input para permitir seleccionar los mismos archivos de nuevo más tarde si es necesario
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Nuevo manejador para el campo de entrada de archivo de la imagen de portada
    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImageFile(e.target.files[0]);
            // Mostrar previsualización de la imagen de portada seleccionada
            setResource(prev => ({ ...prev, coverImageUrl: URL.createObjectURL(e.target.files![0]) }));
        } else {
            setCoverImageFile(null);
            setResource(prev => ({ ...prev, coverImageUrl: '' }));
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setAllSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
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
        if (!user) return;

        if (!resource.title.trim() || !resource.description.trim() || !resource.price || !resource.mercadoPagoLink.trim()) {
            console.error("Por favor, rellena todos los campos obligatorios (Título, Descripción, Precio, Link de Mercado Pago).");
            return;
        }

        setSubmitting(true);
        let uploadedFileUrls: string[] = [];
        let finalCoverImageUrl = resource.coverImageUrl;

        try {
            const resourceSlug = slugify(resource.title);

            // --- Subir imagen de portada (if selected) ---
            if (coverImageFile) {
                const coverImageRef = ref(storage, `resources/${user.uid}/${resourceSlug}/cover_image_${coverImageFile.name}`);
                const uploadCoverResult = await uploadBytes(coverImageRef, coverImageFile);
                finalCoverImageUrl = await getDownloadURL(uploadCoverResult.ref);
            }

            // --- Subir archivos de recurso ---
            if (resource.type === 'link') {
                if (!resource.filePaths[0]) {
                    console.error("El enlace externo es obligatorio.");
                    setSubmitting(false);
                    return;
                }
                uploadedFileUrls = [resource.filePaths[0]];
            } else if (allSelectedFiles.length > 0) {
                for (let i = 0; i < allSelectedFiles.length; i++) {
                    const file = allSelectedFiles[i];
                    const storageRef = ref(storage, `resources/${user.uid}/${resourceSlug}/${file.name}`);
                    const uploadResult = await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(uploadResult.ref);
                    uploadedFileUrls.push(downloadURL);
                }
            } else {
                console.error("No se han seleccionado archivos para subir.");
                setSubmitting(false);
                return;
            }

            // --- Guardar metadatos del recurso en Firestore ---
            await addDoc(collection(db, "resources"), {
                title: resource.title,
                description: resource.description,
                type: resource.type,
                price: parseFloat(resource.price),
                mercadoPagoLink: resource.mercadoPagoLink,
                filePaths: uploadedFileUrls,
                coverImageUrl: finalCoverImageUrl, // Guardar la URL de la imagen de portada
                professionalId: user.uid,
                professionalName: user.displayName || user.email,
                createdAt: new Date(),
            });

            console.log("Recurso subido exitosamente!");
            router.push('/dashboard/professional');
        } catch (error) {
            console.error("Error al subir el recurso:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingAuth) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-xl text-primary">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">Subir Nuevo Recurso</CardTitle>
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
                        {/* Nuevo input para la imagen de portada */}
                        <div>
                            <Label htmlFor="coverImage" className="block text-sm font-medium text-foreground mb-2">Imagen de Portada (Opcional)</Label>
                            <Input
                                id="coverImage"
                                type="file"
                                accept="image/*" // Aceptar solo archivos de imagen
                                onChange={handleCoverImageChange}
                                ref={coverImageInputRef} // Asignar ref para limpiar el input
                            />
                            {resource.coverImageUrl && (
                                <div className="mt-2">
                                    <p className="text-sm text-foreground/70 mb-1">Previsualización de Portada:</p>
                                    <img src={resource.coverImageUrl} alt="Previsualización de Portada" className="w-32 h-auto rounded-md shadow-sm" />
                                </div>
                            )}
                        </div>
                        {/* Fin del nuevo input para la imagen de portada */}

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
                        {resource.type !== 'link' && (
                            <div>
                                <Label htmlFor="file" className="block text-sm font-medium text-foreground mb-2">Añadir Archivo(s)</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    multiple={true} // Siempre permite la selección de múltiples archivos para tipos no-enlace
                                    ref={fileInputRef} // Asignar ref para limpiar el input
                                // required={allSelectedFiles.length === 0} // Opcional: forzar al menos un archivo
                                />
                                {allSelectedFiles.length > 0 && (
                                    <div className="mt-4 text-sm text-foreground/70 border border-gray-200 rounded-md p-3">
                                        <p className="font-semibold mb-2">Archivos seleccionados ({allSelectedFiles.length}):</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {Array.from(allSelectedFiles).map((file, index) => (
                                                <li key={file.name + index} className="flex items-center justify-between">
                                                    <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveFile(file.name)}
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
                                    onChange={(e) => setResource(prev => ({ ...prev, filePaths: [e.target.value] }))}
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
                            {submitting ? 'Subiendo...' : 'Subir Recurso'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}



