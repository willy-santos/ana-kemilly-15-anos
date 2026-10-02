import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  obterIdentificador,
  obterResultadoConfirmacaoInicial,
  verificarConfirmacaoAtual,
} from "@/lib/confirmacao-preload";
import { PageSection } from "@/components/space/PageSection";
export const Route = createFileRoute("/confirmar-presenca")({
  component: ConfirmarPresenca,
});

function ConfirmarPresenca() {
  const [familia, setFamilia] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [nomes, setNomes] = useState("");
  const [observacao, setObservacao] = useState("");

  const resultadoPreload =
  obterResultadoConfirmacaoInicial();

const [confirmacaoConcluida, setConfirmacaoConcluida] =
  useState(resultadoPreload ?? false);

const [verificandoConfirmacao, setVerificandoConfirmacao] =
  useState(resultadoPreload === null);

  /**
   * Cria ou recupera o identificador único deste navegador.
   *
   * O localStorage permanece mesmo se:
   * - fechar a aba;
   * - fechar o navegador;
   * - sair do site;
   * - abrir novamente pelo link.
   */
  
  /**
   * Verifica no Supabase se este navegador já confirmou.
   */
  const verificarConfirmacao = async () => {
  try {
    const resultado = await verificarConfirmacaoAtual();

    setConfirmacaoConcluida(resultado);
  } catch (error) {
    console.error(
      "Erro ao verificar confirmação:",
      error,
    );
  } finally {
    setVerificandoConfirmacao(false);
  }
};

  useEffect(() => {
  const resultado = obterResultadoConfirmacaoInicial();

  if (resultado !== null) {
    setConfirmacaoConcluida(resultado);
    setVerificandoConfirmacao(false);
  } else {
    verificarConfirmacao();
  }

  const aoVoltarParaOSite = () => {
    if (document.visibilityState === "visible") {
      verificarConfirmacao();
    }
  };

  document.addEventListener(
    "visibilitychange",
    aoVoltarParaOSite,
  );

  window.addEventListener(
    "pageshow",
    aoVoltarParaOSite,
  );

  return () => {
    document.removeEventListener(
      "visibilitychange",
      aoVoltarParaOSite,
    );

    window.removeEventListener(
      "pageshow",
      aoVoltarParaOSite,
    );
  };
}, []);

  /**
   * Abre o WhatsApp.
   */
  const enviarParaWhatsapp = () => {
    if (
      !familia.trim() ||
      !quantidade ||
      !nomes.trim()
    ) {
      return;
    }

    const identificador = obterIdentificador();

    /**
     * Guarda temporariamente que este navegador
     * está no processo de confirmação.
     */
    sessionStorage.setItem(
      "confirmacaoWhatsapp",
      "pendente",
    );

   const mensagem = `Olá! Gostaria de confirmar a presença da minha família nos 15 anos da Ana Kemilly.

Família: ${familia}
Quantidade de pessoas: ${quantidade}
Nomes dos convidados: ${nomes}${
  observacao.trim()
    ? `\nObservação: ${observacao}`
    : ""
}`;

const url =
  `https://wa.me/559182538442?text=${encodeURIComponent(mensagem)}`;

window.open(url, "_blank");

    /**
     * Guarda os dados para podermos registrar a confirmação
     * quando a pessoa voltar para o site.
     */
    sessionStorage.setItem(
      "confirmacaoIdentificador",
      identificador,
    );

    sessionStorage.setItem(
      "confirmacaoFamilia",
      familia.trim(),
    );

    sessionStorage.setItem(
      "confirmacaoQuantidade",
      quantidade,
    );

    sessionStorage.setItem(
      "confirmacaoNomes",
      nomes.trim(),
    );

    sessionStorage.setItem(
      "confirmacaoObservacao",
      observacao.trim(),
    );

    window.open(url, "_blank");
  };

  /**
   * Quando a pessoa volta do WhatsApp,
   * registra a confirmação permanentemente no Supabase.
   */
  useEffect(() => {
    const registrarConfirmacaoAoVoltar = async () => {
      if (
        document.visibilityState !== "visible"
      ) {
        return;
      }

      const status =
        sessionStorage.getItem(
          "confirmacaoWhatsapp",
        );

      if (status !== "pendente") {
        return;
      }

      const identificador =
        sessionStorage.getItem(
          "confirmacaoIdentificador",
        );

      const familia =
        sessionStorage.getItem(
          "confirmacaoFamilia",
        );

      const quantidade =
        sessionStorage.getItem(
          "confirmacaoQuantidade",
        );

      const nomes =
        sessionStorage.getItem(
          "confirmacaoNomes",
        );

      const observacao =
        sessionStorage.getItem(
          "confirmacaoObservacao",
        );

      if (
        !identificador ||
        !familia ||
        !quantidade ||
        !nomes
      ) {
        return;
      }

      /**
       * Antes de inserir, verifica novamente
       * para evitar duplicação.
       */
      const { data: existente, error: erroBusca } =
        await supabase
          .from("confirmacoes_presenca")
          .select("id")
          .eq("identificador", identificador)
          .maybeSingle();

      if (erroBusca) {
        console.error(
          "Erro ao verificar confirmação existente:",
          erroBusca,
        );

        return;
      }

      if (!existente) {
        const { error } = await supabase
          .from("confirmacoes_presenca")
          .insert({
            identificador,
            familia,
            quantidade: Number(quantidade),
            nomes,
            observacao: observacao || null,
          });

        if (error) {
          console.error(
            "Erro ao registrar confirmação:",
            error,
          );

          return;
        }
      }

      /**
       * Confirma localmente também.
       */
      sessionStorage.setItem(
        "confirmacaoWhatsapp",
        "concluida",
      );

      setConfirmacaoConcluida(true);

      /**
       * Limpa os dados temporários.
       */
      sessionStorage.removeItem(
        "confirmacaoIdentificador",
      );

      sessionStorage.removeItem(
        "confirmacaoFamilia",
      );

      sessionStorage.removeItem(
        "confirmacaoQuantidade",
      );

      sessionStorage.removeItem(
        "confirmacaoNomes",
      );

      sessionStorage.removeItem(
        "confirmacaoObservacao",
      );
    };

    const aoVoltarParaOSite = () => {
      registrarConfirmacaoAoVoltar();
    };

    document.addEventListener(
      "visibilitychange",
      aoVoltarParaOSite,
    );

    window.addEventListener(
      "pageshow",
      aoVoltarParaOSite,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        aoVoltarParaOSite,
      );

      window.removeEventListener(
        "pageshow",
        aoVoltarParaOSite,
      );
    };
  }, []);

    if (verificandoConfirmacao) {
    return (
      <PageSection
  eyebrow="Faça parte dessa órbita ✦"
  title="Confirmação de presença"
>
        <div className="text-center">
          <p className="mt-5 text-sm text-muted-foreground">
            Verificando sua confirmação...
          </p>
        </div>
      </PageSection>
    );
  }

  return (
   <PageSection
  eyebrow="Faça parte dessa órbita ✦"
  title="Confirmação de presença"
>
      <div className="text-center">
         

      <p className="mt-0 whitespace-nowrap text-sm text-muted-foreground">
  Confirme até{" "}
  <span className="font-semibold text-primary">
    1º de novembro de 2026
  </span>
</p>
      </div>

      {!confirmacaoConcluida ? (
        <div className="glass-panel mt-6 w-full rounded-3xl px-6 py-7 text-left sm:px-8">

          <div className="mb-6 text-center">
            <p className="font-display text-xl text-foreground">
  Dados da família
</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A confirmação deve ser realizada apenas uma vez por família.
            </p>
          </div>

          <div className="space-y-5">

            <div>
              <label
                htmlFor="familia"
                className="mb-2 block text-sm text-foreground"
              >
                Nome da família
              </label>

              <input
                id="familia"
                type="text"
                value={familia}
                onChange={(e) => setFamilia(e.target.value)}
                placeholder="Ex.: Família Silva"
                className="w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
              />
            </div>

            <div>
              <label
                htmlFor="quantidade"
                className="mb-2 block text-sm text-foreground"
              >
                Quantidade de pessoas
              </label>

              <input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex.: 4"
                className="w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
              />
            </div>

            <div>
              <label
                htmlFor="nomes"
                className="mb-2 block text-sm text-foreground"
              >
                Nome das pessoas que irão
              </label>

              <textarea
                id="nomes"
                value={nomes}
                onChange={(e) => setNomes(e.target.value)}
                placeholder="Ex.: João, Maria, Pedro e Ana"
                rows={3}
                className="w-full resize-none rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
              />
            </div>

            <div>
              <label
                htmlFor="observacao"
                className="mb-2 block text-sm text-foreground"
              >
                Observação{" "}
                <span className="text-muted-foreground">
                  (opcional)
                </span>
              </label>

              <textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex.: Chegaremos por volta das 10h30"
                rows={2}
                className="w-full resize-none rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
              />
            </div>

            <button
              type="button"
              onClick={enviarParaWhatsapp}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="size-4" />
              Confirmar presença
            </button>

          </div>
        </div>
      ) : (
        <div className="glass-panel mt-10 w-full rounded-3xl px-6 py-10 text-center">

          <span className="text-2xl text-primary">
            ✦
          </span>

          <h2 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
            Obrigado pela confirmação!
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Sua presença é muito especial para nós.
            <br />
            Será um prazer ter vocês conosco! 💜
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-medium text-primary transition-transform hover:scale-[1.03]"
          >
            <ArrowLeft className="size-4" />
            Voltar ao convite
          </Link>

        </div>
      )}
    </PageSection>
  );
}