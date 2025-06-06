
export default function Footer() {
  return (
    <footer className="bg-card shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p className="text-sm">&copy; {new Date().getFullYear()} PsiConnect. Todos los derechos reservados.</p>
        <p className="text-xs mt-1">Conectando mentes, empoderando profesionales.</p>
      </div>
    </footer>
  );
}
