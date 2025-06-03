
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, BookOpen, Briefcase, CalendarDays, CheckCircle, Mail, MessageSquare, Phone, Star, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ResourceCard, type Resource } from "@/app/marketplace/components/resource-card";


// Mock data - in a real app, this would come from a database
const MOCK_PROFESSIONALS_DATA: { [key: string]: any } = {
  "dr-anya-sharma": {
    id: "dr-anya-sharma",
    name: "Dra. Anya Sharma",
    title: "Psicóloga Clínica, Experta en Mindfulness",
    avatarUrl: "https://placehold.co/150x150.png",
    avatarHint: "professional woman smiling",
    coverImageUrl: "https://placehold.co/1200x300.png",
    coverImageHint: "serene nature yoga",
    bio: "La Dra. Anya Sharma es una psicóloga clínica licenciada con más de 10 años de experiencia especializada en Terapia Cognitivo-Conductual (TCC) e intervenciones basadas en mindfulness. Le apasiona ayudar a las personas a navegar los desafíos de la vida, desarrollar resiliencia y cultivar la paz interior. La Dra. Sharma tiene una práctica privada y también dirige talleres sobre manejo del estrés y bienestar emocional, integrando enfoques holísticos para la salud mental.",
    specialties: ["TCC", "Mindfulness", "Ansiedad", "Depresión", "Manejo del Estrés", "Atención Informada en Trauma"],
    experienceYears: 10,
    rating: 4.9,
    reviewsCount: 120,
    verified: true,
    contact: {
      email: "anya.sharma@example.com",
      phone: "+1-234-567-8900",
    },
    resources: [
      { id: '1', title: 'Guía de Mindfulness para Principiantes', author: 'Dra. Anya Sharma', price: 19.99, category: 'Bienestar', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'mindfulness meditation', description: 'Una guía completa para iniciar tu viaje de mindfulness.' },
      { id: '5', title: 'Técnicas Avanzadas de Mindfulness', author: 'Dra. Anya Sharma', price: 25.00, category: 'Bienestar', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'zen garden stones', description: 'Profundiza tu práctica de mindfulness con técnicas avanzadas para la regulación emocional y la introspección.' },
    ]
  },
   "prof-kenji-tanaka": {
    id: "prof-kenji-tanaka",
    name: "Prof. Kenji Tanaka",
    title: "Terapeuta Cognitivo-Conductual",
    avatarUrl: "https://placehold.co/150x150.png",
    avatarHint: "professional man glasses",
    coverImageUrl: "https://placehold.co/1200x300.png",
    coverImageHint: "modern office books",
    bio: "El Profesor Kenji Tanaka es un reconocido experto en Terapia Cognitivo-Conductual con 15 años de experiencia clínica y de investigación. Se enfoca en tratamientos basados en evidencia para trastornos de ansiedad, TOC y depresión. El Prof. Tanaka también es un respetado autor y orador frecuente en conferencias internacionales de salud mental, dedicado a avanzar en el campo de la TCC.",
    specialties: ["TCC", "Trastornos de Ansiedad", "TOC", "Investigación", "Oratoria", "Terapia de Esquemas"],
    experienceYears: 15,
    rating: 4.8,
    reviewsCount: 95,
    verified: true,
    contact: {
      email: "kenji.tanaka@example.com",
    },
    resources: [
       { id: '2', title: 'Cuaderno de Terapia Cognitivo-Conductual', author: 'Prof. Kenji Tanaka', price: 29.50, category: 'Herramientas de Terapia', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'workbook journal pen', description: 'Cuaderno interactivo con técnicas de TCC para aplicación práctica y desarrollo de habilidades.' },
    ]
  },
  "dr-laura-evans": {
    id: "dr-laura-evans",
    name: "Dra. Laura Evans",
    title: "Psicóloga Infantil, Especialista en TDAH",
    avatarUrl: "https://placehold.co/150x150.png",
    avatarHint: "therapist friendly woman",
    coverImageUrl: "https://placehold.co/1200x300.png",
    coverImageHint: "playful children toys",
    bio: "La Dra. Laura Evans es una psicóloga infantil dedicada, especializada en TDAH y desafíos conductuales relacionados. Con 8 años de experiencia, brinda apoyo compasivo y basado en evidencia a niños y sus familias, enfocándose en crear cambios conductuales positivos y fomentar el éxito académico a través de intervenciones personalizadas.",
    specialties: ["Psicología Infantil", "TDAH", "Terapia Conductual", "Apoyo Parental", "Terapia de Juego", "Espectro Autista"],
    experienceYears: 8,
    rating: 4.7,
    reviewsCount: 78,
    verified: true,
    contact: {
      email: "laura.evans@example.com",
    },
    resources: [
      { id: '3', title: 'Estrategias de Crianza para TDAH', author: 'Dra. Laura Evans', price: 24.00, category: 'Crianza', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'parent child together', description: 'Estrategias basadas en evidencia para que los padres apoyen eficazmente a los niños con TDAH.' },
    ]
  },
  "mr-alex-chen": { // Added for completeness
    id: "mr-alex-chen",
    name: "Sr. Alex Chen",
    title: "Consejero Licenciado, Coach de Relaciones",
    avatarUrl: "https://placehold.co/150x150.png",
    avatarHint: "counselor thoughtful man",
    coverImageUrl: "https://placehold.co/1200x300.png",
    coverImageHint: "calm discussion",
    bio: "El Sr. Alex Chen es un consejero licenciado enfocado en dinámicas de relaciones y bienestar individual. Emplea un enfoque integrador, basándose en diversas modalidades terapéuticas para adaptarse mejor a las necesidades y objetivos únicos de sus clientes. Alex está comprometido a crear un espacio seguro y de apoyo para el crecimiento y la sanación.",
    specialties: ["Consejería de Pareja", "Terapia Individual", "Habilidades de Comunicación", "Resolución de Conflictos"],
    experienceYears: 7,
    rating: 4.6,
    reviewsCount: 65,
    verified: false,
    contact: {
      email: "alex.chen@example.com",
    },
    resources: []
  }
};


export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const professional = MOCK_PROFESSIONALS_DATA[params.id];

  if (!professional) {
    return <div className="text-center py-10">Profesional no encontrado. Por favor, verifica el ID e inténtalo de nuevo.</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl bg-card">
        <div className="relative">
          <Image
            src={professional.coverImageUrl}
            alt={`Imagen de portada de ${professional.name}`}
            width={1200}
            height={300}
            className="w-full h-48 md:h-64 object-cover"
            data-ai-hint={professional.coverImageHint || 'professional background'}
            priority
          />
          <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint || 'professional portrait'}/>
              <AvatarFallback>{professional.name.substring(0, 1)}{professional.name.split(' ')[1]?.substring(0,1) || ''}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardHeader className="pt-16 sm:pt-20 px-4 sm:px-8 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
            <div className="mb-3 sm:mb-0">
              <CardTitle className="text-2xl sm:text-3xl font-headline text-primary">{professional.name}</CardTitle>
              <CardDescription className="text-md text-accent font-semibold">{professional.title}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <MessageSquare className="mr-2 h-4 w-4" /> Mensaje
              </Button>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <CalendarDays className="mr-2 h-4 w-4" /> Reservar
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-amber-400 fill-amber-400" /> {professional.rating} ({professional.reviewsCount} reseñas)</span>
            <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1 text-primary" /> {professional.experienceYears} años de experiencia</span>
            {professional.verified && <span className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Verificado</span>}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-4 sm:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-headline font-semibold text-primary mb-2">Sobre mí</h3>
              <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{professional.bio}</p>
            </div>
            <div>
              <h3 className="text-xl font-headline font-semibold text-primary mb-3">Especialidades</h3>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((spec: string) => (
                  <Badge key={spec} variant="secondary" className="text-sm bg-accent/10 text-accent-foreground hover:bg-accent/20 px-3 py-1">{spec}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg font-headline text-primary">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {professional.contact.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${professional.contact.email}`} className="text-accent hover:underline break-all">{professional.contact.email}</a>
                  </p>
                )}
                {professional.contact.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{professional.contact.phone}</span>
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Video className="mr-2 h-4 w-4" /> Solicitar Videollamada
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg font-headline text-primary">Disponibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Consulta el calendario para ver disponibilidad.</p>
                <Button variant="default" size="sm" className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Ver Calendario
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {professional.resources && professional.resources.length > 0 && (
        <section>
          <h2 className="text-2xl font-headline font-semibold text-primary my-6 flex items-center">
            <BookOpen className="mr-3 h-6 w-6 text-accent shrink-0" />
            Recursos por {professional.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professional.resources.map((resource: Resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
