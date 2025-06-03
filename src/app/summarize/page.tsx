
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UploadCloud, AlertTriangle } from "lucide-react";
import PdfSummarizerClient from "./components/pdf-summarizer-client";

export default function SummarizePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="shadow-lg bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4 shadow-sm">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">Resumidor de PDF con IA</CardTitle>
          <CardDescription className="text-lg text-foreground/80 px-4">
            Sube tu documento PDF (hasta 10MB) y deja que nuestra IA proporcione un resumen conciso, ahorrándote tiempo valioso.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <PdfSummarizerClient />
        </CardContent>
      </Card>
       <Card className="bg-accent/10 border-accent/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-accent flex items-center">
            <UploadCloud className="mr-2 h-6 w-6" /> Cómo Funciona
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-foreground/90">
          <p>1. Haz clic o arrastra un archivo PDF (máx 10MB) al área de carga.</p>
          <p>2. Nuestra IA procesará el documento. Esto puede tardar un momento, especialmente con archivos grandes.</p>
          <p>3. Revisa el resumen generado debajo del formulario de carga.</p>
          <div className="flex items-start text-sm text-muted-foreground pt-3 mt-3 border-t border-accent/20">
            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500 shrink-0" />
            <p>
            Para mejores resultados, asegúrate de que tu PDF esté basado en texto. Los PDF escaneados que solo contienen imágenes podrían no ser procesables por la IA.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
