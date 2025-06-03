
"use client";

import type { ChangeEvent, DragEvent } from 'react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { summarizePdf, type SummarizePdfInput } from '@/ai/flows/summarize-pdf';
import { Loader2, FileUp, CheckCircle, AlertTriangle, Sparkles, FileText as FileIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';


export default function PdfSummarizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { toast } = useToast();

  const resetState = () => {
    setFile(null);
    setFileName('');
    setSummary('');
    setError(null);
    setUploadProgress(0);
    setIsLoading(false);
  };

  const processFile = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Tipo de archivo no válido. Por favor, sube un PDF.');
        resetState();
        setFile(null); // Explicitly nullify
        return false;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('El archivo es demasiado grande. El tamaño máximo es 10MB.');
        resetState();
        setFile(null); // Explicitly nullify
        return false;
      }
      
      resetState(); // Clear previous state before processing new file
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // Simulate upload progress for UX
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20; // Faster progress simulation
        if (progress <= 100) {
          setUploadProgress(progress);
        } else {
          clearInterval(interval);
        }
      }, 100);
      return true;
    }
    return false;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0] || null);
     // Reset file input to allow re-uploading the same file
    if (event.target) {
      event.target.value = "";
    }
  };
  
  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);


  const handleSubmit = async () => {
    if (!file) {
      setError('Por favor, selecciona primero un archivo PDF.');
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous error before new submission
    setSummary(''); // Clear previous summary

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const pdfDataUri = reader.result as string;
        const input: SummarizePdfInput = { pdfDataUri };
        
        try {
          const result = await summarizePdf(input);
          setSummary(result.summary);
          toast({
            title: '¡Resumen Generado!',
            description: 'El PDF ha sido resumido exitosamente.',
            variant: 'default',
            action: <CheckCircle className="text-green-500" />,
          });
        } catch (apiError: any) {
          console.error('Error summarizing PDF:', apiError);
          const errorMessage = apiError.message || 'Error desconocido durante el resumen.';
          setError(`Falló al resumir el PDF: ${errorMessage}`);
          toast({
            title: 'Error al Resumir',
            description: `No se pudo resumir el PDF. ${errorMessage}`,
            variant: 'destructive',
            action: <AlertTriangle className="text-red-500" />,
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = (errorEvent) => {
        console.error('Error reading file:', errorEvent);
        setError('Falló al leer el archivo.');
        setIsLoading(false);
        toast({
            title: 'Error al Leer Archivo',
            description: 'No se pudo leer el archivo seleccionado. Por favor, inténtalo de nuevo.',
            variant: 'destructive',
        });
      };
    } catch (e: any) {
      console.error('General error:', e);
      setError(`Ocurrió un error inesperado: ${e.message || 'Error desconocido'}`);
      setIsLoading(false);
      toast({
        title: 'Error Inesperado',
        description: 'Ocurrió un error inesperado durante el proceso. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`p-6 border-2 border-dashed rounded-md transition-colors duration-200 ease-in-out ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Input id="pdf-upload" name="pdf-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} disabled={isLoading} />
        <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
            <FileUp className={`mx-auto h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm text-muted-foreground">
              <span className={`font-medium ${isDragging ? 'text-primary' : 'text-primary hover:text-primary/80'}`}>Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-muted-foreground">Solo PDF, máx 10MB</p>
        </label>
      </div>

      {fileName && (
        <Card className="border-green-500 bg-green-500/5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <FileIcon className="h-5 w-5" />
              <span>Seleccionado: {fileName}</span>
            </div>
            {uploadProgress < 100 && uploadProgress > 0 && !isLoading && <Progress value={uploadProgress} className="w-full h-1.5 mt-2 bg-green-200" indicatorClassName="bg-green-600" />}
            {uploadProgress === 100 && !isLoading && <p className="text-xs text-green-600 mt-1">Listo para resumir.</p>}
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-3">
            <p className="text-sm text-destructive-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5"/> {error}
            </p>
          </CardContent>
        </Card>
      )}

      <Button 
        onClick={handleSubmit} 
        disabled={isLoading || !file || !!error || (uploadProgress < 100 && !!file) } 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-3"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Resumiendo...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generar Resumen
          </>
        )}
      </Button>

      {summary && (
        <Card className="shadow-md border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Resumen Generado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={summary}
              readOnly
              rows={12}
              className="bg-muted/30 border-border focus-visible:ring-primary text-base leading-relaxed"
              aria-label="Resumen de PDF Generado"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
