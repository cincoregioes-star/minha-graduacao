# Minha Graduação — Simulador educacional
Site: https://cincoregioes-star.github.io/minha-graduacao/

## Estado atual
- Currículo simulado de Ciências Contábeis com **8 semestres e 48 disciplinas**.
- Aulas, exercícios, avaliações e laboratório contábil integrados ao index.html.
- Cards coloridos, efeito ao passar o mouse e layout responsivo.
- A primeira disciplina é gratuita. As demais permanecem demonstrativas até a definição da oferta comercial.
- Progresso e login são **locais ao navegador**. Não oferecem autenticação remota nem sincronização entre aparelhos.
- Simulador independente, **sem diploma superior, sem reconhecimento como instituição de ensino e sem habilitação profissional**.

## Supabase — métricas opcionais
**Não está conectado por padrão.** Por segurança, não usar banco de dados de outros projetos nem inserir credenciais de administração em site público.

1. Criar projeto dedicado chamado `minha-graduacao` na organização escolhida pelo proprietário.
2. Executar `supabase_minha_graduacao.sql` no SQL Editor do Supabase.
3. Copiar a URL HTTPS do projeto e a chave **publishable** (pública) em `const MG_SUPABASE_CONFIG` no `index.html`.
4. Publicar o HTML modificado e clicar em **Permitir métricas** no rodapé, quando desejar autorizar a coleta.
5. Consultar os relatórios no SQL Editor. A tabela tem RLS; visitantes anônimos só podem inserir dados específicos, nunca consultá-los.

Eventos com consentimento: visualização de tela, abertura de disciplina, conclusão de atividade/avaliação. Não envia nome, foto, senha, resposta ou nota. O identificador é aleatório por navegador. Sem consentimento não envia eventos. Métricas de navegadores não equivalem a pessoas e podem ser imprecisas. Não habilitar publicidade paga ou controle de conteúdo premium com a autenticação local atual.

## Publicação
GitHub Pages no ramo `main`, arquivo de entrada `index.html` na raiz. Não excluir os demais arquivos. Para testar cache antigo, use atualização forçada (Ctrl+F5).

## Próximas etapas comerciais
Testar adesão à disciplina gratuita e interesse em outros cursos antes de construir novos currículos. A implantação de cobrança exige identidade autenticada em servidor e proteção real do conteúdo premium.
