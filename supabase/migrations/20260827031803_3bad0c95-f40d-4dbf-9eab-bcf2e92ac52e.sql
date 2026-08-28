CREATE TABLE public.recadinhos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT recadinhos_nome_len CHECK (char_length(trim(nome)) BETWEEN 1 AND 60),
  CONSTRAINT recadinhos_mensagem_len CHECK (char_length(trim(mensagem)) BETWEEN 1 AND 500)
);

GRANT SELECT, INSERT ON public.recadinhos TO anon;
GRANT SELECT, INSERT ON public.recadinhos TO authenticated;
GRANT ALL ON public.recadinhos TO service_role;

ALTER TABLE public.recadinhos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recadinhos are viewable by everyone"
  ON public.recadinhos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can leave a recadinho"
  ON public.recadinhos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX recadinhos_created_at_idx ON public.recadinhos (created_at DESC);