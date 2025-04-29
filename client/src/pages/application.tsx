import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Definir o esquema de formulário usando Zod
const applicationSchema = z.object({
  positionInterest: z.string({
    required_error: "Selecione a posição desejada",
  }),
  age: z.string().min(1, "Idade é obrigatória").transform(val => parseInt(val, 10)),
  timezone: z.string().min(1, "Fuso horário é obrigatório"),
  languages: z.string().min(1, "Idiomas são obrigatórios"),
  availability: z.string().min(1, "Disponibilidade é obrigatória").transform(val => parseInt(val, 10)),
  rpExperience: z.string().min(10, "Por favor, forneça detalhes sobre sua experiência em RP"),
  moderationExperience: z.string().min(10, "Por favor, forneça detalhes sobre sua experiência em moderação"),
  whyJoin: z.string().min(50, "Por favor, forneça um motivo detalhado para sua aplicação"),
  skills: z.string().min(10, "Por favor, liste suas habilidades"),
  additionalInfo: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e condições",
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ApplicationPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  // Definir o formulário
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      positionInterest: "",
      age: "",
      timezone: "America/Sao_Paulo", // Padrão para o Brasil
      languages: "Português",
      availability: "20", // padrão é 20 horas por semana
      rpExperience: "",
      moderationExperience: "",
      whyJoin: "",
      skills: "",
      additionalInfo: "",
      acceptTerms: false,
    },
  });

  // Mutação para enviar o formulário
  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormValues) => {
      const response = await apiRequest("POST", "/api/applications", data);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Falha ao enviar sua aplicação");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/applications"],
      });
      setSubmitted(true);
      toast({
        title: "Aplicação enviada com sucesso!",
        description: "Sua aplicação para staff foi recebida. Entraremos em contato em breve.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar aplicação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Lidar com o envio do formulário
  function onSubmit(data: ApplicationFormValues) {
    applicationMutation.mutate(data);
  }

  if (submitted) {
    return (
      <div className="container py-10">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              Aplicação Enviada com Sucesso
            </CardTitle>
            <CardDescription className="text-center">
              Sua aplicação para staff foi recebida e será analisada pela nossa equipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Agradecemos seu interesse em fazer parte da equipe Tokyo Edge Roleplay.
              Avaliaremos sua aplicação e entraremos em contato através do Discord 
              para os próximos passos do processo de seleção.
            </p>
            <div className="text-center">
              <Button asChild>
                <a href="/">Voltar para Home</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="bg-card/60 backdrop-blur shadow-xl border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Formulário de Aplicação para Staff</CardTitle>
            <CardDescription className="text-muted-foreground">
              Preencha o formulário abaixo para se candidatar a uma posição em nossa equipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="positionInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posição Desejada</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="moderador">Moderador</SelectItem>
                      <SelectItem value="suporte">Suporte</SelectItem>
                      <SelectItem value="desenvolvedor">Desenvolvedor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="conteudo">Criador de Conteúdo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione a posição que você deseja aplicar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Digite sua idade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuso Horário</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu fuso horário" {...field} />
                  </FormControl>
                  <FormDescription>
                    Informe seu fuso horário (ex: America/Sao_Paulo, UTC-3)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idiomas</FormLabel>
                  <FormControl>
                    <Input placeholder="Idiomas que você fala" {...field} />
                  </FormControl>
                  <FormDescription>
                    Informe os idiomas que você domina (ex: Português, Inglês)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidade (horas por semana)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Quantas horas por semana você pode dedicar" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Informe quantas horas semanais você pode dedicar ao servidor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rpExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiência em Roleplay</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva sua experiência em servidores de roleplay"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detalhe sua experiência com FiveM e outros servidores de RP
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moderationExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiência em Moderação</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva sua experiência prévia em cargos de staff ou similares"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Inclua detalhes sobre qualquer experiência prévia em moderação de comunidades
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whyJoin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Por que você quer ser staff?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explique detalhadamente por que você quer fazer parte da nossa equipe"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Seja claro e específico sobre suas motivações
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habilidades Relevantes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Liste suas habilidades relevantes para a posição"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mencione habilidades que podem ser úteis para a função (ex: programação, edição de vídeo, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informações Adicionais (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Compartilhe informações adicionais que podem ser relevantes"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Qualquer informação adicional que você queira compartilhar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Aceito os termos e condições
                    </FormLabel>
                    <FormDescription>
                      Ao marcar esta opção, você concorda em seguir todas as regras e diretrizes 
                      da Tokyo Edge Roleplay, e entende as responsabilidades do cargo.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={applicationMutation.isPending}
            >
              {applicationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Aplicação"
              )}
            </Button>
          </form>
        </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}