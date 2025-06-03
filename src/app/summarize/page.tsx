
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
          <CardTitle className="text-3xl font-headline text-primary">AI PDF Summarizer</CardTitle>
          <CardDescription className="text-lg text-foreground/80 px-4">
            Upload your PDF document (up to 10MB) and let our AI provide a concise summary, saving you valuable time.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <PdfSummarizerClient />
        </CardContent>
      </Card>
       <Card className="bg-accent/10 border-accent/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-accent flex items-center">
            <UploadCloud className="mr-2 h-6 w-6" /> How it Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-foreground/90">
          <p>1. Click or drag a PDF file (max 10MB) into the upload area.</p>
          <p>2. Our AI will process the document. This may take a moment, especially for larger files.</p>
          <p>3. Review the generated summary below the upload form.</p>
          <div className="flex items-start text-sm text-muted-foreground pt-3 mt-3 border-t border-accent/20">
            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500 shrink-0" />
            <p>
            For best results, please ensure your PDF is text-based. Scanned image-only PDFs may not be processable by the AI.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
