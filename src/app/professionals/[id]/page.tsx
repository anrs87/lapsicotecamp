
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, BookOpen, Briefcase, CalendarDays, CheckCircle, Mail, MessageSquare, Phone, Star, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ResourceCard, type Resource } from "@/app/marketplace/components/resource-card";


// Mock data - in a real app, this would come from a database
const MOCK_PROFESSIONALS_DATA: { [key: string]: any } = {
  "dr-anya-sharma": {
    id: "dr-anya-sharma",
    name: "Dr. Anya Sharma",
    title: "Clinical Psychologist, Mindfulness Expert",
    avatarUrl: "https://placehold.co/150x150.png",
    avatarHint: "professional woman smiling",
    coverImageUrl: "https://placehold.co/1200x300.png",
    coverImageHint: "serene nature yoga",
    bio: "Dr. Anya Sharma is a licensed clinical psychologist with over 10 years of experience specializing in Cognitive Behavioral Therapy (CBT) and mindfulness-based interventions. She is passionate about helping individuals navigate life's challenges, build resilience, and cultivate inner peace. Dr. Sharma has a private practice and also conducts workshops on stress management and emotional well-being, integrating holistic approaches to mental health.",
    specialties: ["CBT", "Mindfulness", "Anxiety", "Depression", "Stress Management", "Trauma-Informed Care"],
    experienceYears: 10,
    rating: 4.9,
    reviewsCount: 120,
    verified: true,
    contact: {
      email: "anya.sharma@example.com",
      phone: "+1-234-567-8900",
    },
    resources: [
      { id: '1', title: 'Mindfulness for Beginners Guide', author: 'Dr. Anya Sharma', price: 19.99, category: 'Well-being', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'mindfulness meditation', description: 'A comprehensive guide to starting your mindfulness journey.' },
      { id: '5', title: 'Advanced Mindfulness Techniques', author: 'Dr. Anya Sharma', price: 25.00, category: 'Well-being', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'zen garden stones', description: 'Deepen your mindfulness practice with advanced techniques for emotional regulation and insight.' },
    ]
  },
   "prof-kenji-tanaka": {
    id: "prof-kenji-tanaka",
    name: "Prof. Kenji Tanaka",
    title: "Cognitive Behavioral Therapist",
    avatarUrl: "https://placehold.co/150x150.png",
    avatarHint: "professional man glasses",
    coverImageUrl: "https://placehold.co/1200x300.png",
    coverImageHint: "modern office books",
    bio: "Professor Kenji Tanaka is a renowned expert in Cognitive Behavioral Therapy with 15 years of clinical and research experience. He focuses on evidence-based treatments for anxiety disorders, OCD, and depression. Prof. Tanaka is also a respected author and frequent speaker at international mental health conferences, dedicated to advancing the field of CBT.",
    specialties: ["CBT", "Anxiety Disorders", "OCD", "Research", "Public Speaking", "Schema Therapy"],
    experienceYears: 15,
    rating: 4.8,
    reviewsCount: 95,
    verified: true,
    contact: {
      email: "kenji.tanaka@example.com",
    },
    resources: [
       { id: '2', title: 'Cognitive Behavioral Therapy Workbook', author: 'Prof. Kenji Tanaka', price: 29.50, category: 'Therapy Tools', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'workbook journal pen', description: 'Interactive workbook with CBT techniques for practical application and skill-building.' },
    ]
  },
  "dr-laura-evans": {
    id: "dr-laura-evans",
    name: "Dr. Laura Evans",
    title: "Child Psychologist, ADHD Specialist",
    avatarUrl: "https://placehold.co/150x150.png",
    avatarHint: "therapist friendly woman",
    coverImageUrl: "https://placehold.co/1200x300.png",
    coverImageHint: "playful children toys",
    bio: "Dr. Laura Evans is a dedicated child psychologist specializing in ADHD and related behavioral challenges. With 8 years of experience, she provides compassionate, evidence-based support to children and their families, focusing on creating positive behavioral changes and fostering academic success through tailored interventions.",
    specialties: ["Child Psychology", "ADHD", "Behavioral Therapy", "Parenting Support", "Play Therapy", "Autism Spectrum"],
    experienceYears: 8,
    rating: 4.7,
    reviewsCount: 78,
    verified: true,
    contact: {
      email: "laura.evans@example.com",
    },
    resources: [
      { id: '3', title: 'Parenting Strategies for ADHD', author: 'Dr. Laura Evans', price: 24.00, category: 'Parenting', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'parent child together', description: 'Evidence-based strategies for parents to support children with ADHD effectively.' },
    ]
  },
  "mr-alex-chen": { // Added for completeness
    id: "mr-alex-chen",
    name: "Mr. Alex Chen",
    title: "Licensed Counselor, Relationship Coach",
    avatarUrl: "https://placehold.co/150x150.png",
    avatarHint: "counselor thoughtful man",
    coverImageUrl: "https://placehold.co/1200x300.png",
    coverImageHint: "calm discussion",
    bio: "Mr. Alex Chen is a licensed counselor focusing on relationship dynamics and individual well-being. He employs an integrative approach, drawing from various therapeutic modalities to best suit his clients' unique needs and goals. Alex is committed to creating a safe and supportive space for growth and healing.",
    specialties: ["Relationship Counseling", "Individual Therapy", "Communication Skills", "Conflict Resolution"],
    experienceYears: 7,
    rating: 4.6,
    reviewsCount: 65,
    verified: false,
    contact: {
      email: "alex.chen@example.com",
    },
    resources: []
  }
};


export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const professional = MOCK_PROFESSIONALS_DATA[params.id];

  if (!professional) {
    return <div className="text-center py-10">Professional not found. Please check the ID and try again.</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl bg-card">
        <div className="relative">
          <Image
            src={professional.coverImageUrl}
            alt={`${professional.name}'s cover image`}
            width={1200}
            height={300}
            className="w-full h-48 md:h-64 object-cover"
            data-ai-hint={professional.coverImageHint || 'professional background'}
            priority
          />
          <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint || 'professional portrait'}/>
              <AvatarFallback>{professional.name.substring(0, 1)}{professional.name.split(' ')[1]?.substring(0,1) || ''}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardHeader className="pt-16 sm:pt-20 px-4 sm:px-8 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
            <div className="mb-3 sm:mb-0">
              <CardTitle className="text-2xl sm:text-3xl font-headline text-primary">{professional.name}</CardTitle>
              <CardDescription className="text-md text-accent font-semibold">{professional.title}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <MessageSquare className="mr-2 h-4 w-4" /> Message
              </Button>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <CalendarDays className="mr-2 h-4 w-4" /> Book
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-amber-400 fill-amber-400" /> {professional.rating} ({professional.reviewsCount} reviews)</span>
            <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1 text-primary" /> {professional.experienceYears} years of experience</span>
            {professional.verified && <span className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Verified</span>}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-4 sm:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-headline font-semibold text-primary mb-2">About Me</h3>
              <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{professional.bio}</p>
            </div>
            <div>
              <h3 className="text-xl font-headline font-semibold text-primary mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((spec: string) => (
                  <Badge key={spec} variant="secondary" className="text-sm bg-accent/10 text-accent-foreground hover:bg-accent/20 px-3 py-1">{spec}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg font-headline text-primary">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {professional.contact.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${professional.contact.email}`} className="text-accent hover:underline break-all">{professional.contact.email}</a>
                  </p>
                )}
                {professional.contact.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{professional.contact.phone}</span>
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Video className="mr-2 h-4 w-4" /> Request Video Call
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg font-headline text-primary">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Check calendar for openings.</p>
                <Button variant="default" size="sm" className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {professional.resources && professional.resources.length > 0 && (
        <section>
          <h2 className="text-2xl font-headline font-semibold text-primary my-6 flex items-center">
            <BookOpen className="mr-3 h-6 w-6 text-accent shrink-0" />
            Resources by {professional.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professional.resources.map((resource: Resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
