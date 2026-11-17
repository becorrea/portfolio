# Rebrand do portfólio para a marca Stelqo — design

Data: 2026-11-17 · Fonte da verdade: `Stelqo-Manual-de-Marca.pdf` v1.0 (40 p.) + `Stelqo-Kit-de-Arquivos.zip` (ambos em `~/Downloads`).

## Intenção

O site hoje é a marca pessoal "Bernardo Corrêa" (monograma "Bc", Geist, azul #374CFF). Stelqo é a empresa do Bernardo, com manual de marca pronto. O site passa a ser **o site da Stelqo**, seguindo o manual em logo, cor, tipografia, grafismos e tom de voz.

## Decisões do usuário

1. **Voz da empresa (opção A).** Fala "a Stelqo" + "você". Bernardo aparece como fundador na página Sobre.
2. **Oferta atual: só sites.** Os três pacotes (Essencial a partir de R$ 600, Profissional, Evolução e Manutenção) ficam. Sistemas e plataformas aparecem só como direção futura, numa linha, sem preço nem pacote ("Também evoluímos para sistemas sob medida" ou similar).
3. **CSS compartilhado em `assets/css/stelqo.css`** (abordagem 1, abaixo).
4. **Apagar `identidade.html`**: guia órfão da identidade antiga "Bc", sem links de nenhuma página.

## Abordagens consideradas

- **1) Extrair o bloco comum para `assets/css/stelqo.css`** ← escolhida. As linhas 9–227 do `<style>` são idênticas nas 6 páginas. Uma fonte única de marca, como já acontece com `assets/js/site.js`.
- 2) Editar o bloco copiado em cada página: mesma mudança 6×, risco de divergência.
- 3) Gerador de site (11ty etc.): ferramenta de build desnecessária num site estático. Descartada.

## Metas

- Nenhum resquício visual da identidade "Bernardo Corrêa"; a Stelqo como marca em todas as páginas.
- Conformidade com o manual nos itens listados em "Especificação".
- Nada quebra: formulário de contato → CRM, menu mobile, Laboratório, animações, acessibilidade.

## Não-metas

- Não redesenhar layout/arquitetura das páginas além do que o manual exige.
- Não mexer nas marcas fictícias (Clínica Horizonte, Lúmen Odonto e demais do Laboratório): cores, fontes e conteúdo dos *mocks* ficam. O *entorno* (títulos, rótulos, botões da página) muda.
- Não criar páginas de sistemas/plataformas.

## Anti-metas (falha mesmo se "funcionar")

- Redigitar o wordmark "stelqo." em texto/CSS (manual p. 20). Logo só via SVG oficial do kit.
- Voz de empresa sugerindo equipe que não existe. Bernardo é único fundador; manter a verdade "você fala direto com quem constrói".
- Inventar e-mail `@stelqo.com.br` ou domínio (o manual marca esses como ilustrativos).
- Quebrar ou alterar o fluxo de envio do formulário (o último commit acabou de corrigi-lo).

## Restrições

- Site estático, HTML + CSS + `assets/js/site.js`, sem build.
- Kit é arquivo baixado: extrair em diretório novo e vazio, ler o texto de cada SVG (sem `<script>`, sem `href` externo) antes de copiar para o projeto.
- Não enviar lead de teste ao CRM real sem perguntar.

## Especificação

### Arquivos
- **Novo** `assets/css/stelqo.css`: conteúdo das linhas 9–227 (tokens, tipo, botões, cabeçalho, menu, rodapé, CTA, utilitários), já com a marca aplicada. Cada página: `<link rel="stylesheet" href="assets/css/stelqo.css">` e mantém só o CSS próprio inline.
- **Novo** `assets/brand/`: `stelqo-horizontal-positiva.svg`, `stelqo-horizontal-negativa.svg`, `stelqo-simbolo.svg`, `favicon-32px.png`, `favicon-180px-apple-touch.png`, `favicon-512px.png` (do kit).
- **Apagar** `identidade.html`.

### Tokens (substituir)

| Token | Antes | Depois (manual p. 23–24) |
|---|---|---|
| `--blue` | #374CFF | #0A33FF (Azul Stelqo) |
| `--blue-2` (hover) | #2335E6 | #0828D6 (Azul 600) |
| `--lav` (destaque no escuro) | #B8C7FF | #8EA6FF (Azul Claro) |
| `--ink` | #181B20 | #0B0E14 (Grafite Noite) |
| `--ink-2` | #3F444D | #3C4150 (Neutro 700) |
| `--muted` | #5F646E | #5E6372 (Neutro 600) |
| `--d-muted` | #A4A9B4 | #A6A9B3 (Neutro 400) |
| `--paper` | #F5F3EF | #F8F5F2 (Papel) |
| `--paper-2` | #ECE9E3 | #ECEAE6 (Neutro 100) |
| `--paper-3` | #E4E1DA | #E4E2DE (Neutro 200) |
| `--gray` | #DDE0E5 | #DDE4FF (Azul Gelo) |

Literais rgba que codificam as cores antigas (cabeçalho, sombra do `.btn-blue`, `.ph`, `--line`, `--d-line`, `.ftr-*`, CSS de cada página): trocar pelos RGB novos — `24,27,32`→`11,14,20`; `245,243,239`→`248,245,242`; `55,76,255`→`10,51,255`; `184,199,255`→`142,166,255`. Demais hex soltos do entorno (#FBFAF8, #F1EFEA, #D7D4CD, #E6E3DD, #6A6E76, #C9CCD3, #E6E7EA etc.) → tom mais próximo das escalas do manual (p. 24) ou `#FFFFFF`.

### Tipografia (manual p. 28–30)
- Google Fonts: **Plus Jakarta Sans** (400;500;600;700;800), **Instrument Serif** (regular + itálico), **Geist Mono** (400;500). *(Decisão do construtor, revisar:)* os mocks não mudam (Não-metas), então:
  - Instrument Serif regular continua carregada (Lúmen Odonto, opção "Editorial" do Laboratório, mocks da Clínica). Na marca Stelqo ela só é usada em itálico.
  - **Geist** continua carregada **só em `index.html`**, para a opção "Moderna" do Laboratório. Sai das demais páginas e de toda regra de marca (`--sans`).
- `--sans: "Plus Jakarta Sans", Arial, Helvetica, sans-serif`.
- Títulos (`.h-display`, `.h2`, `.h3`, menu mobile, nomes de serviço) em **Jakarta**, nunca em serifa romana:

| Classe | Desktop | Mobile | Entrelinha | Tracking | Peso |
|---|---|---|---|---|---|
| `.h-display` | 72px | 44px | 1,05 | −0,04em | 800 |
| `.h2` | 56px | 36px | 1,07 | −0,03em | 800 |
| `.h3` | 28px | 24px | 1,20 | −0,02em | 700 |
| `.h4` | 20px | 18px | 1,40 | −0,01em | 600 |
| corpo grande (`.lead`) | 18px | 17px | 1,55 | 0 | 400 |
| corpo (`.body`) | 16px | 16px | 1,60 | 0 | 400 |
| legenda (`.small`) | 14px | 14px | 1,45 | 0 | 500 |

  Fluido via `clamp()` entre os dois extremos. (Título 2 do manual, 40/30px, fica disponível se alguma seção precisar.)
- **Destaque**: `em` em título = Instrument Serif itálico, **sempre azul** (`--blue`; em `.dark`, `--lav` = #8EA6FF, pois #0A33FF sobre Grafite é reprovado na p. 26), **no fim do título**, 1 a 3 palavras. Remover `em` do meio de títulos e `em` sem cor.
- `em` fora de título (corpo) não vira serifa; ênfase em corpo = peso 600/700.
- Pesos: só 400, 500, 600, 700, 800; no máximo três por tela. Eliminar 300/450/550/650.
- **Rótulo** (`.eyebrow`): Jakarta 700, 12px, maiúsculas, tracking 0,16em, cor `--muted`, seguido de **linha azul curta** (28px × 2px, `--blue`; no escuro `--lav`) — abaixo ou após o texto, como na p. 32. Geist Mono fica só para dados técnicos (números de etapa, URLs de mock, códigos); `.mono`/`.tag` podem permanecer mono.
- Alinhamento à esquerda (centralizado só em peças curtas).

### Logo, favicon, título
- Cabeçalho: `<img src="assets/brand/stelqo-horizontal-positiva.svg" alt="Stelqo" height="34">` (≥34px de altura → ≥120px de largura, mínimo digital da p. 16). Link para `index.html`, `aria-label="Stelqo — página inicial"`.
- Rodapé (fundo Grafite): versão **negativa**.
- Remover `.sig`, `.mono-mark`, `.ftr-big` e o HTML correspondente.
- `<head>` de todas as páginas: favicon 32px, apple-touch 180px; `<title>` = "… — Stelqo" (home: "Stelqo — Sites para pequenos negócios" ou similar, ver Voz).
- Área de proteção: altura-x (0,43 H) livre em volta do logo.

### Grafismos (manual p. 25, 32)
- **Onda de Luz** no herói da home (não há arquivo no kit; desenhar em SVG inline): curvas translúcidas no gradiente `#0A33FF 0% → #3D6BFF 45% → transparente 100%`, 225°, entrando por um canto e **sangrando a borda**, no máximo 35% da área, nunca atrás de texto longo. Referência visual: capa do manual (p. 1) e mockup do site (p. 38). Substitui a grade/janelas flutuantes do herói atual — o conteúdo do "stage" (Tipografia/Paleta/Animações) pode sair. Respeitar `prefers-reduced-motion`.
- Faixas a 23° e Gradiente Profundo: opcionais, a critério do construtor (ex.: CTA band escura). No máximo um gradiente de destaque por tela.

### Botões e telas
- Um único botão azul por tela (p. 38). *(Decisão do construtor, revisar:)* o cabeçalho é sticky, então o CTA azul dele conta em toda tela no desktop. Regra:
  - CTA do cabeçalho permanece azul em todas as páginas, **exceto `contato.html`**, onde ele vira ink e o azul fica com o botão de envio do formulário.
  - Todos os demais `.btn-blue` de conteúdo (herói, CTA bands, `servicos.html`, `sobre.html`, `projetos.html`) viram **ink** (Grafite), ou claro sobre fundo escuro.
  - Abaixo de 960px (CTA do cabeçalho escondido) vale o mesmo markup; aceitar que ali nenhum botão azul aparece em algumas telas.
  - **Botão de envio em `contato.html` mantém a classe `btn-blue`**: `site.js:107` o localiza por `$('.send .btn-blue')`; trocar a classe quebra o envio ao CRM em silêncio.
- `.btn-blue` hover: `--blue-2`, sombra com `rgba(10,51,255,…)`.

### Ícones
- Traço 1,75px (`.ic` stroke-width 1.75), grade 24px, terminais/cantos arredondados — padrão Lucide. Trocar desenhos próprios por equivalentes Lucide quando existirem (seta, WhatsApp não existe no Lucide — manter), copiados como SVG inline (sem dependência nova).

### Voz e conteúdo (manual p. 9–10)
- Empresa: "a Stelqo constrói…", "fale com a Stelqo", "você". Bernardo em 3ª pessoa como fundador na página Sobre ("Quem constrói: Bernardo Corrêa, fundador"); manter que o cliente fala direto com quem constrói.
- Frase-assinatura **"Estrutura que impulsiona *evolução.*"** em local de destaque (herói ou CTA final da home).
- Rótulo do herói: "Sites para pequenos negócios" ou "Sites · Desenvolvimento web" — **não** "Sites · Sistemas · Plataformas" (oferta ainda não existe).
- Regras: frases ≤ 20 palavras; benefício antes de tecnologia; próximo passo claro no fim de cada bloco.
- Trocar jargão por benefício: "Layout responsivo" → "Funciona bem no celular"; "SEO técnico básico" → "Ajuda clientes a encontrar você no Google"; "Página única (one-page)" → "Tudo em uma página"; "Serviços em acordeão" → "Serviços fáceis de consultar"; "CRM" → "sistemas de atendimento".
- Remover vago/exagero: "experiências digitais modernas", "o melhor da sua empresa", "perfeitamente".
- Escada futura: uma linha em Serviços (ex.: "Também evoluímos para sistemas sob medida. Fale com a gente.") sem pacote/preço.
- Contatos reais mantidos: `bernat.correa@gmail.com`, WhatsApp +55 11 99815-0501, LinkedIn, GitHub. Rodapé: "© 2026 Stelqo." 
- Mensagens pré-preenchidas ("Olá, Bernardo! Vi seu portfólio…") no menu mobile de todas as páginas, no CTA e na prévia do formulário → "Olá, Stelqo! Vi o site e gostaria de conversar sobre um site." Alterar **só strings**; não tocar no fluxo de envio/CRM em `site.js`/`contato.html` (inclui a ocorrência em `site.js:111`).
- `sobre.html`: placeholder "[ADICIONAR OUTRAS TECNOLOGIAS E HABILIDADES CONFIRMADAS]" — remover a linha (manter só o que está confirmado).

### `clinica-horizonte.html` — fronteira mock × Stelqo *(decisão do construtor, revisar)*
- **Fica com as cores/fontes da clínica:** o que *mostra* o trabalho entregue: herói `.cs-hero` (fundo #112E2C, destaque menta #CFE3DB), galeria `.gal`, faixa `.phones`, telas e paleta da clínica e `.pillar .n`.
- **Vira Stelqo:** o que é *narração* da Stelqo: cabeçalho, rodapé, CTA band, rótulos, texto corrido e títulos de seção fora dos blocos acima (incluindo `.dec h3`, que passa para Jakarta). Dentro deles, `em` em título fica azul (#8EA6FF no escuro).
- Literais rgba antigos (`rgba(24,27,32,…)`, `rgba(245,243,239,…)`) trocados pelos novos em qualquer lugar da página, inclusive nos blocos da clínica, porque são tons neutros da marca antiga, e não cores da clínica.

### Foto
- `bernardo-retrato.jpg` permanece (real, luz natural — conforme p. 34).

## Verificação

- `grep` sem resultados fora dos mocks fictícios: `#374CFF`, `#2335E6`, `#181B20`, `#F5F3EF`, `#B8C7FF`, `rgba(24,27,32`, `rgba(245,243,239`, `rgba(55,76,255`, `rgba(184,199,255`, `family=Geist:` (exceto `index.html`, para o Laboratório), `Geist,` fora do `lab-data`/opção "Moderna", `mono-mark`, `sig-name`, `ftr-big`, `Bernardo Corrêa —` em `<title>`, `identidade.html`.
- Screenshots desktop (1440px) e mobile (390px) de cada página, comparados com p. 30 e 38 do manual.
- Contraste: texto em azul sobre escuro usa #8EA6FF.
- Formulário: prévia e links abrem com o texto novo; envio ao CRM **não** testado com lead real sem autorização.
- Menu mobile, Laboratório e animações funcionando; `prefers-reduced-motion` respeitado.

## Deixado ao construtor

- Ordem das tarefas, nomes de classes novas, desenho exato das curvas da Onda de Luz dentro da spec.
- Texto final de cada bloco, dentro das regras de voz acima.
- Uso opcional de Faixas a 23° / Gradiente Profundo.

## Em aberto (do usuário, não bloqueia)

- Domínio/e-mail `stelqo.com.br`: quando existir, trocar contatos.

## Pré-requisito de ambiente

- Disco C: com ~0,9 GB livre (estava em 0 durante a revisão). Extrair o kit, renderizar páginas do manual e tirar screenshots exige espaço. Liberar alguns GB antes da implementação.
