# Página Planos de cuidado — design

**Data:** 2026-11-17 · **Fonte do conteúdo:** HTML antigo do portfólio (página "Planos de cuidado", card 03 da home e de Serviços, FAQ da home) · **Regras:** spec do rebrand Stelqo + spec do modo escuro.

## Intenção
Trazer a oferta de planos mensais/anuais (hospedagem, domínio, parte técnica) para o site da Stelqo, como página própria, com a mesma cara do resto do site e dentro do manual da marca. Dá ao cliente um caminho único e com preço claro para "depois que o site está no ar".

## Decisões do usuário
1. **Planos substituem o pacote "Evolução e Manutenção".** Na home e em Serviços, o card/seção 03 vira "Planos de cuidado", com botão "Ver planos".
2. Mudanças maiores deixam de ser pacote: aparecem no plano Base (ajustes avulsos com orçamento rápido), no Gestão (novas páginas/layout/funcionalidades orçadas à parte) e no FAQ.
3. **Linha discreta abaixo dos dois planos:** "Quer evoluir o site com novas páginas ou funcionalidades? A Stelqo passa um orçamento sob medida." com link para Contato.
4. **Voz:** "a Stelqo" + "você"; onde a frase pede primeira pessoa, "nossa": "2 meses por nossa conta", "um mês por nossa conta".

## Abordagens
- **A. Página nova `planos.html` com componentes do site (escolhida).** Cabeçalho, rodapé, rótulo com linha azul, títulos, listas com check, FAQ em acordeão e faixa de CTA já existentes; CSS só do que for novo (cartões de plano, chave Mensal/Anual). Modo escuro vem de graça pelas variáveis de papel.
- B. Colar a página antiga e repintar. Traz Geist, monograma "Bc", voz "eu" e o motor de componentes do bundler. Recusada.
- C. Planos como seção dentro de Serviços. Página longa demais e sem link próprio para mandar ao cliente. Recusada.

## Conteúdo (da página antiga, voz ajustada)
- Herói: rótulo "Planos de cuidado"; título "Seu site no ar, *sem dor de cabeça.*"; texto sobre hospedagem, segurança e configurações; selos Opcional · Sem fidelidade · Domínio no seu nome.
- Planos com chave Mensal / Anual ("2 meses por nossa conta"):
  - **Base** — R$ 39/mês ("Pouco mais de R$ 1 por dia") · R$ 390/ano ("Equivale a R$ 32,50 por mês"). Hospedagem; certificado de segurança (HTTPS); configuração e gestão técnica do domínio; acompanhamento do funcionamento; correções técnicas de hospedagem e publicação. Nota: ajustes avulsos com orçamento rápido; renovação do domínio por conta do cliente.
  - **Gestão** — R$ 89/mês ("Menos de R$ 3 por dia") · R$ 890/ano ("Equivale a R$ 74,17 por mês"). Tudo do Base; renovação anual do domínio .br; uma alteração simples por mês; atendimento prioritário. Nota: novas páginas, layout e funcionalidades orçados à parte.
  - Rodapé dos planos: cobrança só quando o site vai ao ar; sem fidelidade; no anual, devolução dos meses não usados pelo valor mensal. Mais a linha da decisão 3.
- "O domínio é seu. Sempre." — 3 itens (no nome da sua empresa; a Stelqo cuida da parte técnica; quer sair? a Stelqo ajuda).
- "Como funciona" — 3 passos + caixa "Sem plano".
- Vantagens — Indique e ganhe (link WhatsApp com mensagem pronta "Olá, Stelqo! …") e Condição de lançamento para os primeiros 10 clientes.
- FAQ — as 8 perguntas da página antiga, voz ajustada.
- CTA final — "Seu site no ar. Você focado no seu negócio." → Contato e Serviços.

## Mudanças fora da página
- Menu (desktop e mobile, 6 páginas + nova): "Planos" entre Serviços e Sobre; numeração do mobile 01–06.
- Home: card 03 vira "Planos de cuidado" (a partir de R$ 39/mês, "Ver planos" → `planos.html`). FAQ: respostas sobre domínio/hospedagem, atualizar o site e "depois de publicado" passam a citar os planos.
- Serviços: seção 03 vira "Planos de cuidado" (`#planos`, link do "Ir para" junto); Essencial "Não inclui" ganha "Hospedagem e gestão técnica — opcionais, nos planos de cuidado".

## Fora do escopo
- Pagamento/assinatura online. Os botões levam a WhatsApp/Contato.
- Efeito "magnético" dos botões da página antiga.
- Mudar preços dos pacotes de site.

## Verificação
- `check-brand.sh` inclui `planos.html` e checa que toda página linka `planos.html` no menu.
- `theme-check.py` roda nas 7 páginas, claro e escuro, sem falhas.
- Capturas 1440 e 390, claro e escuro; chave Mensal/Anual troca valores; FAQ abre/fecha; overflow horizontal 0.
- Formulário de contato nunca enviado em teste.

## Deixado ao construtor
Nomes de classes, layout exato dos cartões de plano dentro dos padrões do site, texto final de cada bloco dentro das regras de voz.
