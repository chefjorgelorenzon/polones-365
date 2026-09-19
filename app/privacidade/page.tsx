import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { site } from "@/data/site";
import { formatWhatsApp } from "@/lib/utils";

export const metadata = {
  title: "Política de Privacidade",
};

export default function PrivacidadePage() {
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
          Política de Privacidade
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
            <p>
              Esta Política de Privacidade explica como {site.name}{" "}
              coleta, usa e protege os dados pessoais de alunos da
              plataforma {site.productName}, em conformidade com a
              Lei Geral de Proteção de Dados (Lei nº 13.709/2018 —
              LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              1. Dados que coletamos
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Dados de cadastro: nome, e-mail e senha (armazenada
                de forma criptografada).
              </li>
              <li>
                Dados de perfil e preferências de estudo: nível de
                polonês, objetivo de aprendizagem e meta diária de
                estudo.
              </li>
              <li>
                Dados de pagamento e cobrança: nome, documento e
                endereço necessários para emissão de cobrança,
                processados pelo nosso parceiro de pagamentos. Não
                armazenamos dados completos de cartão de crédito em
                nossos servidores.
              </li>
              <li>
                Dados de uso da plataforma: aulas assistidas,
                progresso, sequência de estudos e respostas de
                exercícios, usados para personalizar sua experiência.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              2. Como usamos seus dados
            </h2>
            <p className="mt-3">
              Utilizamos seus dados para: criar e manter sua conta;
              processar pagamentos e gerenciar sua assinatura;
              acompanhar e exibir seu progresso no curso; enviar
              comunicações relacionadas ao serviço; e cumprir
              obrigações legais e fiscais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              3. Compartilhamento de dados
            </h2>
            <p className="mt-3">
              Compartilhamos dados pessoais apenas com prestadores de
              serviço essenciais à operação da plataforma, como o
              provedor de infraestrutura e banco de dados e o
              parceiro responsável pelo processamento de pagamentos.
              Não vendemos dados pessoais a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              4. Armazenamento e segurança
            </h2>
            <p className="mt-3">
              Seus dados são armazenados em infraestrutura com
              controles de acesso e criptografia. Adotamos medidas
              técnicas e organizacionais razoáveis para proteger suas
              informações contra acesso não autorizado, perda ou uso
              indevido.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              5. Seus direitos
            </h2>
            <p className="mt-3">
              Você pode, a qualquer momento, solicitar a confirmação
              do tratamento, o acesso, a correção, a portabilidade ou
              a exclusão dos seus dados pessoais, bem como revogar
              consentimentos concedidos, nos termos da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              6. Cookies
            </h2>
            <p className="mt-3">
              Utilizamos cookies e tecnologias semelhantes
              essenciais ao funcionamento da plataforma, como manter
              sua sessão autenticada. Você pode gerenciar cookies nas
              configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-950">
              7. Contato
            </h2>
            <p className="mt-3">
              Para exercer seus direitos ou tirar dúvidas sobre esta
              Política de Privacidade, entre em contato {contactLine}.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 text-sm">
          <Link
            href="/termos"
            className="font-bold text-red-700 hover:underline"
          >
            Ver Termos de Uso
          </Link>
        </div>
      </article>
    </main>
  );
}
