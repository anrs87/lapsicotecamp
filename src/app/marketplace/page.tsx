
import { ResourceCard, type Resource } from './components/resource-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, ShoppingCart } from 'lucide-react';

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Mindfulness for Beginners Guide',
    author: 'Dr. Anya Sharma',
    price: 19.99,
    category: 'Well-being',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'mindfulness meditation',
    description: 'A comprehensive guide to starting your mindfulness journey. Includes practical exercises and tips for daily practice and stress reduction.',
  },
  {
    id: '2',
    title: 'Cognitive Behavioral Therapy Workbook',
    author: 'Prof. Kenji Tanaka',
    price: 29.50,
    category: 'Therapy Tools',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'workbook journal',
    description: 'Interactive workbook with evidence-based CBT techniques for managing anxiety, depression, and negative thought patterns.',
  },
  {
    id: '3',
    title: 'Parenting Strategies for ADHD',
    author: 'Dr. Laura Evans',
    price: 24.00,
    category: 'Parenting',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'parent child',
    description: 'Evidence-based strategies for parents of children with ADHD. Focuses on positive reinforcement and behavior management.',
  },
  {
    id: '4',
    title: 'Stress Reduction Toolkit',
    author: 'PsiConnect Team',
    price: 15.00,
    category: 'Stress Management',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'calm relaxation',
    description: 'A collection of audio tracks, worksheets, and quick techniques for immediate stress relief and long-term resilience building.',
  },
   {
    id: '5',
    title: 'The Art of Emotional Regulation',
    author: 'Dr. Ben Carter',
    price: 22.00,
    category: 'Emotional Intelligence',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'brain emotions',
    description: 'Learn to understand and manage your emotions effectively with this practical guide. Includes exercises for emotional awareness.',
  },
  {
    id: '6',
    title: 'Building Healthy Relationships',
    author: 'Dr. Chloe Davis',
    price: 18.50,
    category: 'Relationships',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'couple communication',
    description: 'A guide to fostering communication, trust, and intimacy in romantic and platonic relationships. For individuals and couples.',
  },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Resource Marketplace</h1>
        <p className="text-lg text-muted-foreground mb-6">Discover digital tools and guides to support your mental well-being and professional development.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search resources by title, author, or keyword..." className="pl-10 w-full" />
          </div>
          <Button variant="outline" className="flex items-center gap-2 shrink-0">
            <Filter className="h-5 w-5" />
            Filters
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 shrink-0">
            <ShoppingCart className="h-5 w-5" />
            View Cart (0)
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
