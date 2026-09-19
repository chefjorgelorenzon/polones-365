import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { site } from "@/data/site";
import { formatWhatsApp } from "@/lib/utils";

export const metadata = {
  title: "Termos de Uso",
};

export default function TermosPage() {
  const contactChannels = [
    site.contact.email && `pelo e-mail ${site.contact.email}`,
    site.contact.whatsapp &&
      `pelo WhatsApp ${formatWhatsApp(site.contact.whatsapp)}`,
  ].filter(Boolean);

  const contactLine =
    contactChannels.length > 0
      ? contactChannels.join(" ou ")
      : "pelos canais de suporte informados na plataforma";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex min-h-20 max-w-3xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-700 font-black text-white">
              MP
            </div>

            <span className="text-sm font-black text-zinc-950">
              {site.name}
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-black text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            <ArrowLeft size={17} />
            Voltar ao início
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
          Documento legal
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
          Termos de Uso
        </h1>

        <p className="mt-4 text-sm text-zinc-500">
          Última atualização: {new Date().toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-zinc-700 sm:text-base">
          <section>
            <h2 className="text-lg font-black text-zinc-950">
              1. Sobre a plataforma
            </h2>
            <p className="mt-3">
              {site.productName} é um curso online oferecido por{" "}
              {site.name}, composto por {site.course.totalLessons}{" "}
              aulas disponibilizadas de forma progressiva, com o
              objetivo de ensinar o idioma polonês. Ao criar uma
              conta e utilizar a plataforma, você concorda com estes
              Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              2. Cadastro e conta
            </h2>
            <p className="mt-3">
              Para acessar o conteúdo, é necessário criar uma conta
              com nome, e-mail e senha válidos. Você é responsável
              por manter a confidencialidade de suas credenciais de
              acesso e por todas as atividades realizadas em sua
              conta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              3. Assinatura e pagamento
            </h2>
            <p className="mt-3">
              O acesso ao conteúdo completo depende de uma assinatura
              paga, processada por um parceiro de pagamentos. Os
              planos disponíveis, valores e periodicidade de cobrança
              são exibidos na página de planos antes da confirmação
              da compra. A assinatura é renovada automaticamente ao
              final de cada ciclo, salvo cancelamento prévio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              4. Cancelamento
            </h2>
            <p className="mt-3">
              Você pode cancelar sua assinatura a qualquer momento.
              O cancelamento interrompe as próximas cobranças, mas
              não gera reembolso automático de valores já pagos,
              exceto quando exigido por lei ou indicado de forma
              expressa no momento da contratação.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              5. Uso do conteúdo
            </h2>
            <p className="mt-3">
              Todo o conteúdo disponibilizado (vídeos, textos,
              exercícios e materiais de apoio) é de uso pessoal e
              intransferível. É proibida a reprodução, distribuição
              ou compartilhamento do conteúdo com terceiros sem
              autorização expressa.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              6. Alterações nestes termos
            </h2>
            <p className="mt-3">
              Estes Termos de Uso podem ser atualizados
              periodicamente. Alterações relevantes serão comunicadas
              através da plataforma ou por e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              7. Contato
            </h2>
            <p className="mt-3">
              Dúvidas sobre estes Termos de Uso podem ser enviadas{" "}
              {contactLine}.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 text-sm">
          <Link
            href="/privacidade"
            className="font-bold text-red-700 hover:underline"
          >
            Ver Política de Privacidade
          </Link>
        </div>
      </article>
    </main>
  );
}
