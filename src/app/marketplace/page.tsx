
import { ResourceCard, type Resource } from './components/resource-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, ShoppingCart } from 'lucide-react';

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Guía de Mindfulness para Principiantes',
    author: 'Dra. Anya Sharma',
    price: 19.99,
    category: 'Bienestar',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'mindfulness meditation',
    description: 'Una guía completa para iniciar tu viaje de mindfulness. Incluye ejercicios prácticos y consejos para la práctica diaria y la reducción del estrés.',
  },
  {
    id: '2',
    title: 'Cuaderno de Terapia Cognitivo-Conductual',
    author: 'Prof. Kenji Tanaka',
    price: 29.50,
    category: 'Herramientas de Terapia',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'workbook journal',
    description: 'Cuaderno interactivo con técnicas de TCC basadas en evidencia para manejar la ansiedad, la depresión y los patrones de pensamiento negativos.',
  },
  {
    id: '3',
    title: 'Estrategias de Crianza para TDAH',
    author: 'Dra. Laura Evans',
    price: 24.00,
    category: 'Crianza',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'parent child',
    description: 'Estrategias basadas en evidencia para padres de niños con TDAH. Se enfoca en el refuerzo positivo y el manejo del comportamiento.',
  },
  {
    id: '4',
    title: 'Kit de Herramientas para Reducir el Estrés',
    author: 'Equipo PsiConnect',
    price: 15.00,
    category: 'Manejo del Estrés',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'calm relaxation',
    description: 'Una colección de pistas de audio, hojas de trabajo y técnicas rápidas para el alivio inmediato del estrés y la construcción de resiliencia a largo plazo.',
  },
   {
    id: '5',
    title: 'El Arte de la Regulación Emocional',
    author: 'Dr. Ben Carter',
    price: 22.00,
    category: 'Inteligencia Emocional',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'brain emotions',
    description: 'Aprende a comprender y gestionar tus emociones eficazmente con esta guía práctica. Incluye ejercicios para la conciencia emocional.',
  },
  {
    id: '6',
    title: 'Construyendo Relaciones Saludables',
    author: 'Dra. Chloe Davis',
    price: 18.50,
    category: 'Relaciones',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'couple communication',
    description: 'Una guía para fomentar la comunicación, la confianza y la intimidad en las relaciones románticas y platónicas. Para individuos y parejas.',
  },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Marketplace de Recursos</h1>
        <p className="text-lg text-muted-foreground mb-6">Descubre herramientas y guías digitales para apoyar tu bienestar mental y desarrollo profesional.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Buscar recursos por título, autor o palabra clave..." className="pl-10 w-full" />
          </div>
          <Button variant="outline" className="flex items-center gap-2 shrink-0">
            <Filter className="h-5 w-5" />
            Filtros
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 shrink-0">
            <ShoppingCart className="h-5 w-5" />
            Ver Carrito (0)
          </Button>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>
    </div>
  );
}
