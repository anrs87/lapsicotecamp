
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, ShoppingBag, Users, FileText, Briefcase } from 'lucide-react'; 

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <Brain className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold">PsiConnect</h1>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" asChild>
            <Link href="/marketplace" className="flex items-center gap-1 text-xs sm:text-sm">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden md:inline">Marketplace</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/professionals" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Profesionales</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/summarize" className="flex items-center gap-1 text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Resumir</span>
            </Link>
          </Button>
           <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm">
            <Link href="/#"> {/* Placeholder: actual link TBD for login/dashboard */}
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Panel
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
