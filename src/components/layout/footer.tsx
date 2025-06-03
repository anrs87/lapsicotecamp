
export default function Footer() {
  return (
    <footer className="bg-card shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p className="text-sm">&copy; {new Date().getFullYear()} PsiConnect. All rights reserved.</p>
        <p className="text-xs mt-1">Connecting minds, empowering professionals.</p>
      </div>
    </footer>
  );
}
