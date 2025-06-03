
"use client"; 

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, ShoppingCart, Info } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';


export interface Resource {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  imageUrl: string;
  imageHint?: string;
  description: string;
}

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { toast } = useToast();

  const handlePurchase = () => {
    // In a real app, this would initiate the payment process with Mercado Pago.
    // For now, simulate with a toast message and console log.
    console.log(`Initiating purchase for "${resource.title}" (ID: ${resource.id}) via Mercado Pago.`);
    toast({
      title: "Simulación de Compra",
      description: `Redirigiendo a Mercado Pago para "${resource.title}". Tu contenido estará disponible después del pago.`,
      duration: 5000,
    });
    // Example redirect (replace with actual Mercado Pago integration)
    // window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=YOUR_PREFERENCE_ID`;
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full bg-card">
      <CardHeader className="p-0 relative">
        <Image
          src={resource.imageUrl}
          alt={resource.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={resource.imageHint || 'digital resource'}
        />
        <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-sm font-semibold shadow">
          ${resource.price.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 text-primary hover:text-primary/80 transition-colors">
          <Link href={`/marketplace/resource/${resource.id}`}> {/* Placeholder link */}
            {resource.title}
          </Link>
        </CardTitle>
        <p className="text-xs text-muted-foreground mb-2">Por {resource.author}</p>
        <div className="flex items-center text-xs text-accent mb-3">
          <Tag className="h-3 w-3 mr-1" />
          <span>{resource.category}</span>
        </div>
        <CardDescription className="text-sm text-foreground/80 line-clamp-3">{resource.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between border-t mt-auto">
        <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-initial border-primary text-primary hover:bg-primary/10">
          <Link href={`/marketplace/resource/${resource.id}`}> {/* Placeholder link */}
            <Info className="mr-2 h-4 w-4" />
            Detalles
          </Link>
        </Button>
        <Button size="sm" onClick={handlePurchase} className="flex-1 sm:flex-initial bg-accent hover:bg-accent/90 text-accent-foreground">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Comprar Ahora
        </Button>
      </CardFooter>
    </Card>
  );
}
