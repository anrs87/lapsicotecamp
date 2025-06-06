'use client'; // This line is CRUCIAL for the component to function on the client side!

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth'; // Importamos 'User' para el tipado
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '@/utils/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation'; // Para redireccionar


export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null); // Tipado corregido: User | null
    const [profile, setProfile] = useState({
        bio: '',
        specialties: '', // Puede ser una cadena de texto separada por comas inicialmente
        instagram: '',
        linkedin: '',
        photoURL: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Listener para el estado de autenticación
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Cargar el perfil existente desde Firestore
                const userRef = doc(db, "users", currentUser.uid);
                try {
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setProfile({
                            bio: userData.bio || '',
                            specialties: userData.specialties || '',
                            instagram: userData.instagram || '',
                            linkedin: userData.linkedin || '',
                            photoURL: userData.photoURL || currentUser.photoURL || '',
                        });
                    } else {
                        console.warn("Documento de usuario no encontrado en Firestore. Redirigiendo al dashboard.");
                        router.push('/dashboard/user'); // Redirigir si el documento no existe
                    }
                } catch (firestoreError) {
                    console.error("Error al obtener el documento de Firestore:", firestoreError);
                    // Si hay un error de permisos aquí, lo capturamos
                    // Podrías redirigir al inicio o mostrar un mensaje específico
                    router.push('/'); // Redirigir al inicio en caso de error de Firestore
                }
            } else {
                // Si no hay usuario, redirigir a la página de inicio de sesión
                router.push('/');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]); // Dependencia en router para asegurar que el efecto se re-ejecute si router cambia.

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            // Mostrar preview de la imagen seleccionada
            setProfile(prev => ({ ...prev, photoURL: URL.createObjectURL(e.target.files![0]) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Aseguramos que 'user' no sea null antes de proceder
        if (!user) return;

        setSubmitting(true);
        let newPhotoURL = profile.photoURL;

        try {
            if (imageFile) {
                // Subir la nueva foto de perfil a Firebase Storage
                const storageRef = ref(storage, `profile_pictures/${user.uid}/${imageFile.name}`);
                const uploadResult = await uploadBytes(storageRef, imageFile);
                newPhotoURL = await getDownloadURL(uploadResult.ref);
            }

            // Actualizar el documento del usuario en Firestore con la información del perfil
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                bio: profile.bio,
                specialties: profile.specialties,
                instagram: profile.instagram,
                linkedin: profile.linkedin,
                photoURL: newPhotoURL,
                // Mantener el campo isProfessional y otros campos existentes usando merge
            }, { merge: true });

            console.log("Perfil actualizado exitosamente!");
            // Redirigir al dashboard del profesional después de guardar
            router.push('/dashboard/professional');
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-xl text-primary">Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">Editar Perfil Profesional</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="photoURL" className="block text-sm font-medium text-foreground mb-2">Foto de Perfil</Label>
                            <div className="flex items-center space-x-4">
                                {profile.photoURL && (
                                    // Muestra la foto de perfil actual o la preview de la nueva
                                    <img src={profile.photoURL} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover shadow-md" />
                                )}
                                {/* Input para seleccionar un nuevo archivo de imagen */}
                                <Input id="photoURL" type="file" onChange={handleImageChange} className="flex-grow" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">Biografía</Label>
                            <Textarea
                                id="bio"
                                value={profile.bio}
                                onChange={handleInputChange}
                                placeholder="Describe tu experiencia y enfoque profesional..."
                                rows={5}
                            />
                        </div>
                        <div>
                            <Label htmlFor="specialties" className="block text-sm font-medium text-foreground mb-2">Especialidades (separadas por comas)</Label>
                            <Input
                                id="specialties"
                                type="text"
                                value={profile.specialties}
                                onChange={handleInputChange}
                                placeholder="Ej: Terapia cognitivo-conductual, Terapia familiar"
                            />
                        </div>
                        <div>
                            <Label htmlFor="instagram" className="block text-sm font-medium text-foreground mb-2">Link de Instagram</Label>
                            <Input
                                id="instagram"
                                type="url"
                                value={profile.instagram}
                                onChange={handleInputChange}
                                placeholder="https://instagram.com/tu_perfil"
                            />
                        </div>
                        <div>
                            <Label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-2">Link de LinkedIn</Label>
                            <Input
                                id="linkedin"
                                type="url"
                                value={profile.linkedin}
                                onChange={handleInputChange}
                                placeholder="https://linkedin.com/in/tu_perfil"
                            />
                        </div>
                        {/* Botón de envío del formulario */}
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


