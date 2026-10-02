import { supabase } from "@/integrations/supabase/client";

let verificacaoInicial: Promise<boolean> | null = null;
let resultadoInicial: boolean | null = null;

export function obterIdentificador() {
  let identificador = localStorage.getItem("confirmacaoIdentificador");

  if (!identificador) {
    identificador = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    localStorage.setItem(
      "confirmacaoIdentificador",
      identificador,
    );
  }

  return identificador;
}

async function consultarConfirmacao() {
  try {
    const identificador = obterIdentificador();

    const { data, error } = await supabase
      .from("confirmacoes_presenca")
      .select("id")
      .eq("identificador", identificador)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao verificar confirmação:",
        error,
      );

      return false;
    }

    return !!data;
  } catch (error) {
    console.error(
      "Erro inesperado ao verificar confirmação:",
      error,
    );

    return false;
  }
}

/**
 * Inicia a verificação durante a Intro.
 *
 * Se já tiver sido iniciada, reutiliza a mesma Promise.
 */
export function prepararVerificacaoConfirmacao() {
  if (!verificacaoInicial) {
    verificacaoInicial = consultarConfirmacao().then(
      (resultado) => {
        resultadoInicial = resultado;
        return resultado;
      },
    );
  }

  return verificacaoInicial;
}

/**
 * Retorna o resultado imediatamente caso o preload
 * já tenha terminado.
 */
export function obterResultadoConfirmacaoInicial() {
  return resultadoInicial;
}

/**
 * Faz uma nova consulta quando necessário,
 * por exemplo, ao voltar do WhatsApp.
 */
export async function verificarConfirmacaoAtual() {
  return consultarConfirmacao();
}