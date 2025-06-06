
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Briefcase, CalendarDays, Search, UserCheck, Filter } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  imageUrl?: string;
  imageHint?: string;
  bioExcerpt: string;
  rating: number;
  experienceYears: number;
  verified: boolean;
}

const mockProfessionals: Professional[] = [
  {
    id: 'dr-anya-sharma',
    name: 'Dra. Anya Sharma',
    specialty: 'Psicóloga Clínica, Experta en Mindfulness',
    imageUrl: 'https://placehold.co/100x100.png',
    imageHint: 'professional woman smiling',
    bioExcerpt: 'Se especializa en TCC y reducción del estrés basada en mindfulness. Más de 10 años de experiencia ayudando a clientes a alcanzar el bienestar mental y construir resiliencia.',
    rating: 4.9,
    experienceYears: 10,
    verified: true,
  },
  {
    id: 'prof-kenji-tanaka',
    name: 'Prof. Kenji Tanaka',
    specialty: 'Terapeuta Cognitivo-Conductual',
    imageUrl: 'https://placehold.co/100x100.png',
    imageHint: 'professional man glasses',
    bioExcerpt: 'Experto en el tratamiento de trastornos de ansiedad y depresión usando técnicas de TCC basadas en evidencia. Autor publicado e investigador en psicología clínica.',
    rating: 4.8,
    experienceYears: 15,
    verified: true,
  },
  {
    id: 'dr-laura-evans',
    name: 'Dra. Laura Evans',
    specialty: 'Psicóloga Infantil, Especialista en TDAH',
    imageUrl: 'https://placehold.co/100x100.png',
    imageHint: 'therapist friendly',
    bioExcerpt: 'Dedicada a apoyar a niños con TDAH y sus familias. Proporciona estrategias prácticas para el manejo conductual y el éxito académico.',
    rating: 4.7,
    experienceYears: 8,
    verified: true,
  },
   {
    id: 'mr-alex-chen',
    name: 'Sr. Alex Chen',
    specialty: 'Consejero Licenciado, Coach de Relaciones',
    imageUrl: 'https://placehold.co/100x100.png',
    imageHint: 'counselor thoughtful',
    bioExcerpt: 'Se enfoca en terapia de pareja y consejería individual para problemas de relación. Utiliza un enfoque integrador adaptado a las necesidades del cliente.',
    rating: 4.6,
    experienceYears: 7,
    verified: false, // Example of not verified
  },
];

export default function ProfessionalsPage() {
  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Encontrar un Profesional</h1>
        <p className="text-lg text-muted-foreground mb-6">Conecta con profesionales de la salud mental experimentados y accede a su pericia.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Buscar por nombre, especialidad o palabra clave..." className="pl-10 w-full" />
          </div>
          <Button variant="outline" className="flex items-center gap-2 shrink-0">
            <Filter className="h-5 w-5" />
            Filtrar por Especialidad
          </Button>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProfessionals.map((prof) => (
            <ProfessionalCard key={prof.id} professional={prof} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfessionalCard({ professional }: { professional: Professional }) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="h-20 w-20 border-2 border-primary shrink-0">
          <AvatarImage src={professional.imageUrl} alt={professional.name} data-ai-hint={professional.imageHint || 'professional portrait'} />
          <AvatarFallback>{professional.name.substring(0, 1)}{professional.name.split(' ')[1]?.substring(0,1) || ''}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl font-headline text-primary mb-1 hover:text-primary/80 transition-colors">
            <Link href={`/professionals/${professional.id}`}>{professional.name}</Link>
          </CardTitle>
          <p className="text-sm text-accent font-semibold">{professional.specialty}</p>
          {professional.verified && (
            <div className="flex items-center text-xs text-green-600 mt-1">
              <UserCheck className="h-3.5 w-3.5 mr-1" />
              Profesional Verificado
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <CardDescription className="text-sm text-foreground/80 mb-3 line-clamp-3">{professional.bioExcerpt}</CardDescription>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center"><Award className="h-3.5 w-3.5 mr-1 text-amber-500" /> {professional.rating}/5.0 Valoración</span>
            <span className="flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1 text-blue-500" /> {professional.experienceYears} años exp.</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/professionals/${professional.id}`}>
            Ver Perfil <Briefcase className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
