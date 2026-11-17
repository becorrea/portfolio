// Seção 03 da home: "Veja como ficaria o seu". Monta a prévia (notebook + celular) a partir do nome e do ramo.
(function(){
  if (!document.getElementById('lab-desk')) return;
  var PALS = {
    sereno:  {label:'Sereno',  bg:'#F2F6F4',surf:'#FFFFFF',ink:'#12302C',mut:'#4B5F5B',acc:'#1F6F64',accInk:'#FFFFFF',soft:'#D3E6E0',line:'rgba(18,48,44,.14)'},
    classico:{label:'Clássico',bg:'#F6F1E8',surf:'#FFFDF8',ink:'#251E17',mut:'#66594B',acc:'#8A5A2B',accInk:'#FFFFFF',soft:'#EADCC6',line:'rgba(37,30,23,.14)'},
    vibrante:{label:'Vibrante',bg:'#F4F5FF',surf:'#FFFFFF',ink:'#14163A',mut:'#50547F',acc:'#374CFF',accInk:'#FFFFFF',soft:'#D8DEFF',line:'rgba(20,22,58,.14)'},
    noturno: {label:'Noturno', bg:'#15171C',surf:'#1F2229',ink:'#F2EFE8',mut:'#ABACB2',acc:'#D9BE82',accInk:'#15171C',soft:'#2A2E37',line:'rgba(242,239,232,.14)'}
  };

  /* Objetivos: 4 modelos cobrem quase todo pequeno negócio. Textos neutros quando o ramo não é reconhecido. */
  var GOALS = {
    agenda:   {label:'marca horário', pal:'sereno', h:'Seu horário marcado, sem espera.',
               items:[['Atendimento','45 min','R$ 90'],['Avaliação','30 min','R$ 60'],['Retorno','20 min','R$ 40']]},
    orcamento:{label:'pede orçamento', pal:'vibrante', h:'Conte o que você precisa. A resposta vem rápido.',
               items:['Serviço completo','Consultoria','Manutenção','Outro'], stat:['200','clientes atendidos']},
    produtos: {label:'escolhe produtos', pal:'classico', h:'O que você vende, a um clique do pedido.', tabs:['Destaques','Novidades','Kits','Vale-presente'],
               items:[['Mais vendido','O preferido dos clientes','R$ 42','box'],['Novidade','Chegou nesta semana','R$ 36','bottle'],['Edição especial','Feito sob encomenda','R$ 58','jar'],['Vale-presente','Para dar de presente','R$ 89','ticket']]},
    trabalhos:{label:'vê seus trabalhos', pal:'classico', h:'Trabalhos feitos com cuidado, do começo à entrega.',
               items:[['Cliente Padaria Lume','Entregue em 2025'],['Cliente Studio9','2024'],['Cliente Arco','2024']]}
  };

  /* Ramos reconhecidos (palavra-chave no texto digitado). Ordem importa: "barbearia" antes de "bar". */
  var RAMOS = [
    {k:['barb'], label:'Barbearia', goal:'agenda', prop:'chair', pal:'noturno', brand:'Navalha Barbearia', h:'Corte na régua, horário marcado.',
      items:[['Corte','40 min','R$ 55'],['Barba','30 min','R$ 40'],['Corte e barba','70 min','R$ 85']]},
    {k:['salao','cabel','manicur','unha','sobrancel'], label:'Salão de beleza', goal:'agenda', prop:'chair', pal:'classico', brand:'Studio Fio', h:'Seu cabelo do jeito que você imaginou.',
      items:[['Corte','50 min','R$ 90'],['Escova','40 min','R$ 70'],['Coloração','2 h','R$ 220']]},
    {k:['odont','dentist'], label:'Clínica odontológica', goal:'agenda', prop:'desk', pal:'sereno', brand:'Lúmen Odonto', h:'Cuidado que começa no primeiro sorriso.',
      items:[['Avaliação','30 min','Grátis'],['Limpeza','45 min','R$ 180'],['Clareamento','1 h','R$ 690']]},
    {k:['estet',' spa','massag','depil'], label:'Estética', goal:'agenda', prop:'chair', pal:'classico', brand:'Atelier Lírio', h:'Beleza com técnica, cuidado com você.',
      items:[['Limpeza de pele','60 min','R$ 180'],['Drenagem','50 min','R$ 150'],['Massagem','60 min','R$ 160']]},
    {k:[' pet','veterin','tosa'], label:'Pet shop', goal:'agenda', prop:'pet', pal:'vibrante', brand:'Patas & Cia', h:'Banho, tosa e carinho com hora marcada.',
      items:[['Banho','1 h','R$ 60'],['Banho e tosa','2 h','R$ 110'],['Consulta','30 min','R$ 150']]},
    {k:['academ','personal','crossfit','muscul',' luta','treino'], label:'Academia', goal:'agenda', prop:'fit', pal:'vibrante', brand:'Academia Pulso', h:'Treine no seu horário, com quem entende.',
      items:[['Aula experimental','1 h','Grátis'],['Avaliação física','40 min','R$ 80'],['Plano mensal','Acesso livre','R$ 129']]},
    {k:['pilates','yoga','danca','alonga'], label:'Pilates', goal:'agenda', prop:'fit', pal:'vibrante', brand:'Movimento Pilates', h:'Seu corpo em movimento, no seu horário.',
      items:[['Aula experimental','50 min','Grátis'],['Aula avulsa','50 min','R$ 90'],['Plano mensal','2x por semana','R$ 480']]},
    {k:['psic','terap','nutri','fisio','medic','clinic','fono'], label:'Psicologia', goal:'agenda', prop:'chair', pal:'sereno', brand:'Espaço Raiz', h:'Um espaço tranquilo para cuidar de você.',
      items:[['Primeira consulta','50 min','R$ 200'],['Sessão','50 min','R$ 180'],['Online','50 min','R$ 160']]},
    {k:['contab','contador'], label:'Contabilidade', goal:'orcamento', pal:'vibrante', brand:'Prisma Contábil', h:'Suas contas em ordem, seu negócio em frente.',
      items:['Abrir empresa','Contabilidade mensal','Trocar de contador','Imposto de renda'], stat:['180','empresas atendidas']},
    {k:['advoc','advog','jurid'], label:'Advocacia', goal:'orcamento', pal:'classico', brand:'Moura Advocacia', h:'Orientação clara para decisões importantes.',
      items:['Trabalhista','Família','Empresarial','Imóveis'], stat:['15','anos de atuação']},
    {k:['reform','constru','eletric','encan','pintur','obra','marido de aluguel','ar condicionado','refriger'], label:'Reformas', goal:'orcamento', pal:'classico', brand:'Prumo Reformas', h:'Sua obra no prazo, sem surpresa no fim.',
      items:['Reforma completa','Elétrica','Pintura','Pequenos reparos'], stat:['320','obras entregues']},
    {k:['grafic','marketing','agencia','consultor','informat','limpeza','seguro','despach','imobil','transport','mudanc'], label:'Consultoria', goal:'orcamento', pal:'vibrante', brand:'Norte Consultoria', h:'Conte o desafio. A gente volta com um plano.',
      items:['Diagnóstico','Projeto','Acompanhamento','Outro'], stat:['90','empresas atendidas']},
    {k:['restaur','pizz','hambur','lanch','bistr','comida','marmit','delivery','sushi',' bar ','boteco','churras'], label:'Pizzaria', goal:'produtos', pal:'noturno', nav:['Cardápio','Encomendas','Onde estamos'], brand:'Forno da Vila', h:'Massa de longa fermentação, forno a lenha.', tabs:['Pizzas','Massas','Sobremesas','Bebidas'],
      items:[['Margherita','Tomate, mozzarella e manjericão','R$ 58','pizza'],['Calabresa','Cebola roxa e azeitona','R$ 62','pizza2'],['Lasanha da casa','Serve duas pessoas','R$ 74','pasta'],['Tiramisù','Receita de família','R$ 28','cake']]},
    {k:['confeit','doce','bolo','padar','cafe','brigad','sorvet','acai'], label:'Confeitaria', goal:'produtos', pal:'classico', nav:['Cardápio','Encomendas','Onde estamos'], brand:'Doce Ofício', h:'Bolos e doces feitos sob encomenda.', tabs:['Bolos','Doces','Tortas','Café'],
      items:[['Bolo de morango','Massa branca e chantilly','R$ 120','cake'],['Torta de limão','Merengue maçaricado','R$ 85','pie'],['Caixa de brigadeiros','12 unidades','R$ 48','cake2'],['Café coado','Grãos do sul de Minas','R$ 9','cup']]},
    {k:['loja','moda','roupa','boutiq','acessor','present','decor','flor','artesan','cosmet','perfum','vela'], label:'Loja', goal:'produtos', pal:'vibrante', brand:'Casa Tramas', h:'Peças escolhidas uma a uma, para a sua casa.', tabs:['Novidades','Casa','Presentes','Promoções'],
      items:[['Vaso de cerâmica','Feito à mão em Cunha','R$ 140','vase'],['Vela de soja','Aroma de figo, 40 h','R$ 68','candle'],['Bolsa de linho','Tingimento natural','R$ 190','bag'],['Kit presente','Vela e vaso pequeno','R$ 180','candle']]},
    {k:['arquit','interior','paisag','jardin'], label:'Arquitetura', goal:'trabalhos', pal:'classico', pic:'arch', nav:['Projetos','Escritório','Contato'], brand:'Atelier Traço', h:'Casas pensadas para quem vive nelas.',
      items:[['Casa Jardim Europa','Residencial, 240 m², entregue em 2025'],['Apartamento Higienópolis','Interiores, 2024'],['Loja Oscar Freire','Comercial, 2024']]},
    {k:['fotog','video','filmag','tatu','tattoo','marcen','moveis','planejad','serralh','vidrac'], label:'Marcenaria', goal:'trabalhos', pal:'classico', pic:'arch', brand:'Veio Marcenaria', h:'Móveis sob medida, feitos para durar.',
      items:[['Casa no Alto da Lapa','Cozinha e sala, entregue em 2025'],['Apartamento Perdizes','Dormitórios, 2024'],['Escritório Vila Olímpia','Comercial, 2024']]}
  ];

  /* Mesmo ramo, outro objetivo: o conteúdo segue o ramo. */
  var ALT = {
    'Barbearia': {
      orcamento:{h:'Barbearia no seu evento. Peça um orçamento.', items:['Dia do noivo','Evento na empresa','Pacote para grupo','Outro'], stat:['4.800','cortes por ano']},
      produtos:{h:'O que a gente usa, para você levar para casa.', tabs:['Barba','Cabelo','Kits','Vale-presente'], items:[['Pomada modeladora','Efeito seco, 120 g','R$ 45','jar'],['Óleo para barba','Cedro e laranja, 30 ml','R$ 39','bottle'],['Kit barba completa','Óleo, balm e pente','R$ 129','box'],['Vale-presente','Corte e barba','R$ 85','ticket']]},
      trabalhos:{h:'Cortes feitos aqui, na régua.', lbl:'Nossa cadeira', items:[['Degradê navalhado','Corte, 40 min'],['Barba desenhada','Barba, 30 min'],['Social clássico','Corte, 40 min']]}},
    'Salão de beleza': {
      orcamento:{h:'Noiva, madrinha ou formatura? Monte o seu pacote.', items:['Noiva','Madrinhas','Formatura','Outro'], stat:['350','noivas atendidas']},
      produtos:{h:'Tratamento de salão, em casa.', tabs:['Cabelo','Unhas','Kits','Vale-presente'], items:[['Máscara de hidratação','Uso semanal, 250 g','R$ 79','jar'],['Óleo reparador','Pontas secas, 60 ml','R$ 59','bottle'],['Kit pós-química','Shampoo, máscara e óleo','R$ 189','box'],['Vale-presente','Escova e manicure','R$ 120','ticket']]},
      trabalhos:{h:'Antes e depois de quem passou por aqui.', lbl:'Nosso espaço', items:[['Morena iluminada','Coloração, 3 h'],['Corte long bob','Corte, 50 min'],['Noiva Mariana','Penteado e maquiagem, 2025']]}},
    'Clínica odontológica': {
      orcamento:{h:'Tratamento completo, com valor claro antes de começar.', items:['Implante','Aparelho','Lentes dentais','Outro'], stat:['2.400','pacientes atendidos']},
      produtos:{h:'Indicados pelo seu dentista.', tabs:['Clareamento','Higiene','Planos','Vale-presente'], items:[['Kit clareamento','Moldeira e gel, 2 semanas','R$ 490','box'],['Enxaguante sem álcool','500 ml','R$ 36','bottle'],['Gel para sensibilidade','30 g','R$ 48','jar'],['Plano de prevenção','2 limpezas por ano','R$ 290','ticket']]},
      trabalhos:{h:'Sorrisos que a gente ajudou a construir.', lbl:'Consultório', items:[['Lentes em porcelana','8 dentes, 2025'],['Alinhadores','Tratamento de 10 meses'],['Clareamento','3 sessões']]}},
    'Estética': {
      orcamento:{h:'Um plano de tratamento feito para a sua pele.', items:['Pacote facial','Pacote corporal','Pré-noiva','Outro'], stat:['1.100','clientes atendidas']},
      produtos:{h:'O cuidado continua em casa.', tabs:['Rosto','Corpo','Kits','Vale-presente'], items:[['Sérum vitamina C','30 ml','R$ 129','bottle'],['Hidratante facial','Pele mista, 50 g','R$ 98','jar'],['Kit rotina noturna','Sérum, creme e tônico','R$ 289','box'],['Vale-presente','Dia de spa','R$ 350','ticket']]},
      trabalhos:{h:'Resultados reais, com fotos de clientes.', lbl:'Nossa sala', items:[['Tratamento de manchas','6 sessões'],['Drenagem pós-parto','10 sessões'],['Limpeza profunda','1 sessão']]}},
    'Pet shop': {
      orcamento:{h:'Hotel e creche para o seu pet. Peça um orçamento.', items:['Hotelzinho','Creche','Adestramento','Outro'], stat:['1.500','pets atendidos']},
      produtos:{h:'Tudo para o seu pet, com entrega no bairro.', tabs:['Banho','Petiscos','Passeio','Pacotes'], items:[['Shampoo neutro','Pele sensível, 500 ml','R$ 42','bottle'],['Petisco natural','Frango desidratado, 100 g','R$ 29','jar'],['Kit passeio','Guia, coleira e saquinhos','R$ 119','box'],['Pacote 4 banhos','Vale por 2 meses','R$ 210','ticket']]},
      trabalhos:{h:'Os clientes mais fofos do bairro.', lbl:'Depois do banho', items:[['Thor, golden','Banho e tosa higiênica'],['Mel, shih tzu','Tosa bebê'],['Bento, vira-lata','Banho e hidratação']]}},
    'Academia': {
      orcamento:{h:'Planos para empresas e grupos.', items:['Plano empresa','Personal em grupo','Assessoria online','Outro'], stat:['40','empresas parceiras']},
      produtos:{h:'Planos e suplementos, direto pelo site.', tabs:['Planos','Suplementos','Acessórios','Vale-presente'], items:[['Plano trimestral','Acesso livre, 3 meses','R$ 339','ticket'],['Whey protein','Baunilha, 900 g','R$ 149','jar'],['Garrafa térmica','750 ml','R$ 59','bottle'],['Kit treino','Toalha, luva e garrafa','R$ 129','box']]},
      trabalhos:{h:'Resultados de quem treina com a gente.', lbl:'Nosso espaço', items:[['Ana, 34 anos','Menos 9 kg em 6 meses'],['Turma das 7h','Corrida de 10 km, 2025'],['Carlos, 52 anos','Voltou a correr']]}},
    'Pilates': {
      orcamento:{h:'Pilates na sua empresa ou em grupo.', items:['Aula na empresa','Grupo fechado','Gestantes','Outro'], stat:['600','alunos atendidos']},
      produtos:{h:'Pacotes de aulas e acessórios.', tabs:['Pacotes','Acessórios','Kits','Vale-presente'], items:[['Pacote 10 aulas','Vale por 3 meses','R$ 790','ticket'],['Garrafa de vidro','600 ml','R$ 69','bottle'],['Bolsa de treino','Linho, com bolso','R$ 149','bag'],['Kit gestante','Bola, faixa e guia','R$ 199','box']]},
      trabalhos:{h:'O estúdio e quem treina nele.', lbl:'Nosso estúdio', items:[['Turma das 7h','Pilates solo'],['Gestantes','Turma de terça'],['Estúdio Pinheiros','4 aparelhos']]}},
    'Psicologia': {
      orcamento:{h:'Palestras e programas para a sua empresa.', items:['Palestra','Saúde mental na empresa','Supervisão','Outro'], stat:['30','empresas atendidas']},
      produtos:{h:'Para cuidar de você entre as sessões.', tabs:['Guias','Cursos','Pacotes','Vale-presente'], items:[['Guia da ansiedade','E-book, 60 páginas','R$ 29','book'],['Diário de emoções','Caderno guiado','R$ 59','book'],['Pacote 4 sessões','Vale por 2 meses','R$ 680','ticket'],['Curso de sono','6 aulas online','R$ 190','box']]},
      trabalhos:{h:'Textos e palestras para quem quer entender mais.', lbl:'Consultório', items:[['Ansiedade no trabalho','Artigo, 6 min de leitura'],['Terapia online funciona?','Artigo, 4 min'],['Palestra na Casa Arco','Evento, 2025']]}},
    'Contabilidade': {
      agenda:{h:'Converse com um contador, sem compromisso.', items:[['Primeira conversa','30 min','Grátis'],['Revisão de impostos','1 h','R$ 250'],['Planejamento anual','2 h','R$ 600']]},
      produtos:{h:'Planos de contabilidade com preço fechado.', tabs:['Planos','MEI','Avulsos','Guias'], items:[['Plano MEI','Por mês','R$ 89','ticket'],['Declaração de IR','Pessoa física','R$ 250','book'],['Plano Simples','Até 5 funcionários, por mês','R$ 390','box'],['Guia do MEI','E-book gratuito','Grátis','book']]},
      trabalhos:{h:'Empresas que crescem com as contas em ordem.', lbl:'Escritório', items:[['Padaria Lume','Cliente desde 2019'],['Studio9','Abertura e contabilidade mensal'],['Arco Engenharia','Troca de contador, 2024']]}},
    'Advocacia': {
      agenda:{h:'Agende uma consulta com quem entende do assunto.', items:[['Primeira consulta','40 min','R$ 250'],['Consulta online','40 min','R$ 200'],['Análise de contrato','1 h','R$ 400']]},
      produtos:{h:'Serviços com preço fechado.', tabs:['Contratos','Empresas','Família','Guias'], items:[['Contrato de aluguel','Revisão completa','R$ 450','book'],['Abertura de empresa','Contrato social','R$ 900','box'],['Pacto antenupcial','Com escritura','R$ 1.200','book'],['Guia do inventário','E-book gratuito','Grátis','book']]},
      trabalhos:{h:'Casos em que a orientação certa fez diferença.', lbl:'Escritório', items:[['Acordo trabalhista','Resolvido em 4 meses'],['Inventário familiar','Concluído sem processo'],['Sociedade desfeita','Mediação, 2024']]}},
    'Reformas': {
      agenda:{h:'Agende a visita técnica, sem custo.', items:[['Visita técnica','1 h','Grátis'],['Reparo elétrico','2 h','R$ 180'],['Manutenção preventiva','Meio período','R$ 350']]},
      produtos:{h:'Pacotes de serviço com preço fechado.', tabs:['Pacotes','Elétrica','Hidráulica','Pintura'], items:[['Pintura de quarto','Até 12 m², com tinta','R$ 890','box'],['Troca de tomadas','Até 10 pontos','R$ 290','ticket'],['Revisão da casa','Elétrica e hidráulica','R$ 650','box'],['Chuveiro instalado','Com material','R$ 220','ticket']]},
      trabalhos:{h:'Obras entregues no prazo combinado.', pic:'arch', items:[['Casa Vila Mariana','Reforma completa, 2025'],['Cozinha Tatuapé','Elétrica e pintura, 2024'],['Loja Santana','Comercial, 2024']]}},
    'Consultoria': {
      agenda:{h:'Agende um diagnóstico gratuito de 30 minutos.', items:[['Diagnóstico','30 min','Grátis'],['Reunião de projeto','1 h','R$ 300'],['Mentoria','1 h','R$ 450']]},
      produtos:{h:'Comece com um pacote pronto.', tabs:['Pacotes','Cursos','Modelos','Mentorias'], items:[['Diagnóstico completo','Relatório em 7 dias','R$ 1.500','book'],['Curso de gestão','8 aulas online','R$ 390','ticket'],['Planilha de caixa','Modelo pronto','R$ 49','box'],['Mentoria mensal','4 encontros','R$ 1.600','ticket']]},
      trabalhos:{h:'Resultados que os clientes contam.', lbl:'Escritório', items:[['Padaria Lume','Faturamento 38% maior em 1 ano'],['Arco Engenharia','Processo comercial do zero'],['Studio9','Custos 20% menores']]}},
    'Pizzaria': {
      agenda:{h:'Reserve sua mesa. A massa já está descansando.', nav:['Cardápio','Reservas','Como chegar'], items:[['Mesa para 2','Até 2 h','Sem custo'],['Mesa para 6','Até 2 h','Sem custo'],['Rodízio da casa','Por pessoa','R$ 79']]},
      orcamento:{h:'Pizza no seu evento, com forno e pizzaiolo.', items:['Aniversário','Casamento','Evento na empresa','Outro'], stat:['260','eventos atendidos']},
      trabalhos:{h:'Da nossa cozinha para a sua mesa.', pic:['pizza','pasta','pizza2','cake'], lbl:'Saiu do forno', items:[['Margherita','Forno a lenha, 90 segundos'],['Lasanha da casa','Massa fresca'],['Calabresa','A mais pedida']]}},
    'Confeitaria': {
      agenda:{h:'Agende a retirada da sua encomenda.', nav:['Cardápio','Encomendas','Como chegar'], items:[['Retirada','Sábado, 10h','Sem custo'],['Degustação de bolos','30 min','R$ 40'],['Entrega','Até 8 km','R$ 15']]},
      orcamento:{h:'Bolo e doces para a sua festa, sob medida.', items:['Casamento','Aniversário','Corporativo','Outro'], stat:['900','festas adoçadas']},
      trabalhos:{h:'Bolos que já passaram por aqui.', pic:['cake','pie','cake2','cup'], lbl:'Encomenda pronta', items:[['Bolo da Helena','Casamento, 3 andares'],['Mesa de doces','Aniversário de 1 ano'],['Caixas de fim de ano','Corporativo, 2024']]}},
    'Loja': {
      agenda:{h:'Agende uma visita ou uma compra com hora marcada.', items:[['Visita à loja','30 min','Sem custo'],['Consultoria de decoração','1 h','R$ 150'],['Lista de presentes','45 min','Sem custo']]},
      orcamento:{h:'Presentes para empresas, com a sua marca.', items:['Brindes','Kits de fim de ano','Decoração de evento','Outro'], stat:['120','empresas atendidas']},
      trabalhos:{h:'Ambientes montados com peças da loja.', pic:['vase','candle','bag','candle'], lbl:'Vitrine', items:[['Sala Dona Carmen','Decoração, 2025'],['Vitrine de inverno','Loja, 2024'],['Mesa posta','Editorial, 2024']]}},
    'Arquitetura': {
      agenda:{h:'Agende uma conversa sobre o seu projeto.', items:[['Primeira conversa','1 h','Grátis'],['Visita ao imóvel','2 h','R$ 400'],['Consultoria','2 h','R$ 600']]},
      orcamento:{h:'Conte sobre o seu espaço. O orçamento vem em 48 horas.', items:['Residencial','Interiores','Comercial','Outro'], stat:['140','projetos entregues']},
      produtos:{h:'Projetos com escopo e preço fechados.', tabs:['Pacotes','Online','Consultoria','Guias'], items:[['Projeto de interiores','Até 60 m²','R$ 4.800','book'],['Consultoria online','Planta e lista de compras','R$ 890','ticket'],['Layout de cozinha','Com 3 opções','R$ 1.200','box'],['Guia da reforma','E-book gratuito','Grátis','book']]}},
    'Marcenaria': {
      agenda:{h:'Agende a medição, sem custo.', items:[['Medição','1 h','Grátis'],['Visita ao showroom','40 min','Sem custo'],['Projeto 3D','2 h','R$ 350']]},
      orcamento:{h:'Móvel sob medida, com orçamento em 48 horas.', items:['Cozinha','Dormitório','Home office','Outro'], stat:['410','ambientes entregues']},
      produtos:{h:'Peças prontas, feitas na nossa oficina.', tabs:['Mesas','Bancos','Prateleiras','Presentes'], items:[['Tábua de corte','Freijó, 40 cm','R$ 160','wood'],['Prateleira','Com mãos-francesas','R$ 280','wood'],['Banco de madeira','Cumaru, 45 cm','R$ 690','wood'],['Vale-presente','Qualquer peça','R$ 200','ticket']]}}
  };

  function norm(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(); }
  function find(txt){
    if (!txt.trim()) return null;
    var t = ' ' + norm(txt) + ' ';
    for (var i=0;i<RAMOS.length;i++) for (var j=0;j<RAMOS[i].k.length;j++) if (t.indexOf(RAMOS[i].k[j]) > -1) return RAMOS[i];
    return null;
  }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  /* ---------- ilustrações (cores vêm da paleta) ---------- */
  function dots(a, c){ return a.map(function(d){return '<circle cx="'+d[0]+'" cy="'+d[1]+'" r="'+d[2]+'" fill="'+c+'"/>';}).join(''); }
  function ringDots(n, r, rad, c){ var s=''; for(var i=0;i<n;i++){var a=i/n*Math.PI*2; s+='<circle cx="'+(50+Math.cos(a)*r).toFixed(1)+'" cy="'+(50+Math.sin(a)*r).toFixed(1)+'" r="'+rad+'" '+c+'/>';} return s; }
  function plate(inner){ return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" class="f-surf"/><circle cx="50" cy="50" r="39" class="f-bg" opacity=".55"/>'+inner+'</svg>'; }
  var LEAF = '<ellipse cx="62" cy="40" rx="5" ry="2.6" fill="#3E7A3A" transform="rotate(-35 62 40)"/><ellipse cx="66" cy="44" rx="5" ry="2.6" fill="#4C8B45" transform="rotate(20 66 44)"/>';
  var GLYPH = {
    pizza: plate('<circle cx="50" cy="50" r="35" fill="#E2A956"/><circle cx="50" cy="50" r="29.5" fill="#C8432B"/>'+dots([[40,40,6.5],[61,43,5.5],[48,61,6.5],[33,55,4.5],[63,62,5]],'#F7EBD3')+dots([[45,49,2.6],[57,55,2.6],[53,37,2.6],[38,64,2.4]],'#3E7A3A')),
    pizza2: plate('<circle cx="50" cy="50" r="35" fill="#DDA150"/><circle cx="50" cy="50" r="29.5" fill="#E7C66F"/>'+dots([[40,39,6],[60,42,6],[47,58,6],[64,60,5.5],[35,56,5]],'#A33A24')+'<path d="M44 46q6-5 12 0M52 66q5-4 10 0M30 46q4-3 8 0" stroke="#7B3B7A" stroke-width="2" fill="none" stroke-linecap="round"/>'+dots([[56,51,2.4],[42,66,2.4]],'#2E2A24')),
    pasta: plate('<rect x="22" y="26" width="56" height="48" rx="6" fill="#E9C46E"/><path d="M24 38h52M24 50h52M24 62h52" stroke="#C8432B" stroke-width="5" opacity=".8"/>'+dots([[36,32,4],[60,44,4],[44,56,4],[66,68,3.5]],'#F6EAD2')+LEAF),
    cake: plate('<circle cx="50" cy="50" r="33" fill="#F4DCE1"/>'+ringDots(14,27,3.4,'class="f-acc"')+dots([[50,50,8],[41,45,4.5],[59,45,4.5],[46,58,4.5],[56,58,4.5]],'#C23B4E')+'<ellipse cx="50" cy="42" rx="3" ry="1.6" fill="#4C8B45"/>'),
    cake2: '<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="10" class="f-surf"/>'+[24,50,76].map(function(x){return [24,50,76].map(function(y){return '<circle cx="'+x+'" cy="'+y+'" r="10.5" fill="#5A3322"/>'+dots([[x-3,y-3,1.2],[x+3,y-1,1.2],[x,y+3,1.2],[x-4,y+2,1.1],[x+2,y-5,1.1]],'#E8C79A');}).join('');}).join('')+'</svg>',
    pie: plate('<circle cx="50" cy="50" r="33" fill="#E3BA6A"/><circle cx="50" cy="50" r="28" fill="#F2E7A0"/>'+ringDots(9,16,7,'fill="#FFF8EE"')+'<circle cx="50" cy="50" r="8" fill="#FFF8EE"/><path d="M50 50L84 38" stroke="#C99A4E" stroke-width="1.5"/>'),
    cup: '<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="44" class="f-surf"/><rect x="78" y="44" width="16" height="12" rx="6" fill="#fff" stroke="rgba(0,0,0,.1)"/><circle cx="50" cy="50" r="31" fill="#fff" stroke="rgba(0,0,0,.08)"/><circle cx="50" cy="50" r="25" fill="#6B4129"/><path d="M50 62c-9-6-13-11-13-16a6.5 6.5 0 0 1 13-1 6.5 6.5 0 0 1 13 1c0 5-4 10-13 16z" fill="#E8CFB1"/></svg>',
    vase: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="93" rx="24" ry="4" fill="rgba(0,0,0,.12)"/><path d="M42 40h16l-1 6c10 6 14 15 14 26 0 13-9 21-21 21s-21-8-21-21c0-11 4-20 14-26z" class="f-acc"/><path d="M33 74c10 4 24 4 34 0" stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none"/><path d="M48 40C46 26 38 16 28 12M52 40c3-14 12-22 24-24M50 40V18" stroke="#4E7A55" stroke-width="2" fill="none"/><ellipse cx="29" cy="13" rx="9" ry="4.5" fill="#5C8C60" transform="rotate(-30 29 13)"/><ellipse cx="75" cy="16" rx="9" ry="4.5" fill="#6B9A63" transform="rotate(-15 75 16)"/><ellipse cx="50" cy="16" rx="4.5" ry="9" fill="#4E7A55"/></svg>',
    candle: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="92" rx="26" ry="4" fill="rgba(0,0,0,.12)"/><rect x="26" y="34" width="48" height="58" rx="8" fill="rgba(255,255,255,.6)" stroke="rgba(0,0,0,.1)"/><rect x="29" y="44" width="42" height="45" rx="6" fill="#F2EADB"/><rect x="34" y="58" width="32" height="16" rx="2" class="f-acc"/><path d="M50 44v-8" stroke="#2C2621" stroke-width="1.5"/><path d="M50 18c6 7 6 13 0 17-6-4-6-10 0-17z" fill="#F3A33C"/><path d="M50 26c2.5 3 2.5 6 0 8-2.5-2-2.5-5 0-8z" fill="#FFE29A"/></svg>',
    bag: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="93" rx="28" ry="4" fill="rgba(0,0,0,.12)"/><path d="M38 38c0-20 24-20 24 0" stroke="#5B4636" stroke-width="3.5" fill="none"/><path d="M24 36h52l4 54H20z" fill="#E6DCCB"/><path d="M22 66h56" stroke-width="10" style="stroke:var(--acc)"/><path d="M24 36h52l1 8H23z" fill="rgba(0,0,0,.06)"/></svg>'
,
    bottle: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="93" rx="20" ry="4" fill="rgba(0,0,0,.12)"/><rect x="42" y="8" width="16" height="13" rx="3" fill="#2C2621"/><path d="M40 21h20v8c8 3 10 8 10 14v41a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V43c0-6 2-11 10-14z" fill="#F2EADB" stroke="rgba(0,0,0,.08)"/><rect x="30" y="52" width="40" height="22" class="f-acc"/><rect x="36" y="60" width="20" height="3" rx="1.5" fill="#fff" opacity=".7"/></svg>',
    jar: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="92" rx="28" ry="4" fill="rgba(0,0,0,.12)"/><rect x="24" y="28" width="52" height="15" rx="4" class="f-acc"/><rect x="22" y="41" width="56" height="49" rx="10" fill="#F2EADB" stroke="rgba(0,0,0,.08)"/><rect x="32" y="56" width="36" height="18" rx="3" fill="#fff" opacity=".85"/><path d="M38 65h24" stroke="rgba(0,0,0,.22)" stroke-width="3" stroke-linecap="round"/></svg>',
    ticket: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="86" rx="34" ry="4" fill="rgba(0,0,0,.12)"/><g transform="rotate(-8 50 52)"><rect x="12" y="28" width="76" height="48" rx="7" class="f-acc"/><path d="M12 42h76" stroke="rgba(255,255,255,.3)" stroke-width="6"/><circle cx="70" cy="62" r="7" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/><path d="M22 62h30" stroke="rgba(255,255,255,.85)" stroke-width="3" stroke-linecap="round"/></g></svg>',
    box: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="92" rx="30" ry="4" fill="rgba(0,0,0,.12)"/><rect x="22" y="44" width="56" height="46" rx="4" fill="#E6DCCB"/><rect x="18" y="34" width="64" height="14" rx="3" fill="#EFE6D6" stroke="rgba(0,0,0,.06)"/><rect x="45" y="34" width="10" height="56" class="f-acc"/><path d="M50 34c-6-12-20-12-18-4 2 6 12 5 18 4zM50 34c6-12 20-12 18-4-2 6-12 5-18 4z" class="f-acc"/></svg>',
    book: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="92" rx="26" ry="4" fill="rgba(0,0,0,.12)"/><rect x="26" y="12" width="48" height="78" rx="4" class="f-acc"/><rect x="26" y="12" width="7" height="78" fill="rgba(0,0,0,.18)"/><rect x="40" y="30" width="26" height="4" rx="2" fill="#fff" opacity=".85"/><rect x="40" y="38" width="18" height="4" rx="2" fill="#fff" opacity=".6"/></svg>',
    wood: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="90" rx="34" ry="4" fill="rgba(0,0,0,.12)"/><rect x="16" y="30" width="68" height="56" rx="8" fill="#C08A55"/><circle cx="72" cy="40" r="4" fill="#8B5A2B"/><path d="M24 48c14-4 28 4 46 0M24 62c16 3 30-3 52 0M24 76c12-3 26 3 40 0" stroke="#9C6A3C" stroke-width="2" fill="none"/></svg>'
  };
  function arch(vb){
    var slats=''; for (var x=172;x<510;x+=12) slats+='<path class="a-slat" d="M'+x+' 136v78"/>';
    return '<svg viewBox="'+(vb||'0 0 600 420')+'" preserveAspectRatio="xMidYMid slice">'+
      '<rect width="600" height="420" class="a-sky"/><circle cx="486" cy="84" r="32" class="a-sun"/>'+
      '<path d="M0 300c80-30 160-36 240-20s150 10 360-26V420H0z" class="a-hill"/>'+
      '<circle cx="70" cy="266" r="48" class="a-tree"/><circle cx="116" cy="284" r="32" class="a-tree"/><circle cx="548" cy="272" r="42" class="a-tree"/>'+
      '<rect y="330" width="600" height="90" class="a-lawn"/>'+
      '<rect x="120" y="214" width="290" height="116" class="a-wall"/>'+
      '<rect x="140" y="236" width="150" height="94" class="a-glass"/><path class="a-refl" d="M152 244l40 76M182 244l32 60"/>'+
      '<rect x="320" y="250" width="34" height="80" class="a-door"/>'+
      '<rect x="160" y="136" width="350" height="78" class="a-wood"/>'+slats+
      '<rect x="210" y="152" width="250" height="44" class="a-glass"/><path class="a-refl" d="M222 156l18 36M246 156l14 28"/>'+
      '<rect x="160" y="214" width="350" height="9" class="a-shadow"/>'+
      '<rect x="430" y="342" width="140" height="18" rx="3" class="a-glass"/>'+
      '<path d="M336 330l-22 90" class="a-path"/>'+
      '<g class="dim"><path d="M120 372H410M120 366v12M410 366v12"/><text x="236" y="392">14,20 m</text><path d="M535 136V330M529 136h12M529 330h12"/><text x="546" y="238">7,60</text><path d="M160 116H510M160 110v12M510 110v12"/><text x="300" y="106">17,50 m</text></g>'+
      '</svg>';
  }
  var PROPS = {
    chair: '<rect x="700" y="182" width="118" height="70" rx="28" class="f-acc"/>'+
      '<rect x="684" y="226" width="150" height="34" rx="15" class="sc-acc2"/>'+
      '<path class="sc-ink" d="M700 260l-8 14M818 260l8 14"/>'+
      '<rect x="604" y="226" width="62" height="8" rx="4" class="sc-glow" opacity=".7"/><path d="M635 234V272" class="sc-st" opacity=".7"/>'+
      '<rect x="616" y="208" width="16" height="18" rx="3" fill="#fff" opacity=".8"/>',
    pet: '<ellipse cx="752" cy="270" rx="96" ry="8" fill="#000" opacity=".25"/>'+
      '<rect x="662" y="244" width="180" height="26" rx="13" class="sc-acc2"/><rect x="670" y="238" width="164" height="16" rx="8" class="f-acc"/>'+
      '<path d="M706 228c-20-2-32-14-34-32" fill="none" stroke="#B97E45" stroke-width="9" stroke-linecap="round"/>'+
      '<ellipse cx="752" cy="224" rx="54" ry="20" fill="#D9A066"/><ellipse cx="736" cy="214" rx="26" ry="7" fill="#E8B985" opacity=".7"/>'+
      '<ellipse cx="798" cy="238" rx="22" ry="6" fill="#E8B985"/>'+
      '<circle cx="806" cy="204" r="20" fill="#D9A066"/><ellipse cx="824" cy="212" rx="13" ry="9" fill="#F0C996"/><circle cx="835" cy="208" r="4" fill="#2A1E16"/>'+
      '<path d="M808 200q4 3 8 0" stroke="#2A1E16" stroke-width="2" fill="none" stroke-linecap="round"/>'+
      '<ellipse cx="793" cy="206" rx="8" ry="16" fill="#A86F3A" transform="rotate(22 793 206)"/>'+
      '<path d="M598 272l5-14h46l5 14z" class="f-acc"/><ellipse cx="626" cy="258" rx="23" ry="4" fill="#8B5A2B"/>'+
      '<circle cx="560" cy="262" r="10" fill="#E9C46E"/><path d="M551 258q9 6 18 0" stroke="#C8432B" stroke-width="2.5" fill="none"/>',
    fit: '<rect x="630" y="264" width="200" height="8" rx="4" class="f-acc"/>'+
      '<circle cx="748" cy="222" r="42" class="sc-acc2"/><path d="M714 206a38 38 0 0 1 56 -20" stroke="#fff" stroke-opacity=".28" stroke-width="5" fill="none" stroke-linecap="round"/>'+
      '<rect x="646" y="254" width="46" height="5" rx="2" fill="#C9CDD6"/><rect x="640" y="246" width="11" height="20" rx="3" class="sc-glow"/><rect x="687" y="246" width="11" height="20" rx="3" class="sc-glow"/>'+
      '<rect x="796" y="248" width="26" height="16" rx="8" class="sc-glow" opacity=".75"/>',
    desk: '<rect x="650" y="194" width="196" height="78" rx="8" class="sc-acc2"/><rect x="640" y="186" width="216" height="12" rx="6" class="sc-glow" opacity=".85"/>'+
      '<circle cx="748" cy="233" r="19" class="sc-glow" opacity=".9"/><text x="748" y="240" text-anchor="middle" class="sc-ini" data-ini></text>'+
      '<path d="M678 186a13 13 0 0 1 26 0z" fill="#E9C46E"/><circle cx="691" cy="171" r="2.5" fill="#E9C46E"/>'+
      '<path d="M815 168l-6-14M815 168l6-16M815 168v-18" stroke="#6E9B6A" stroke-width="2"/><circle cx="809" cy="153" r="6" class="f-acc"/><circle cx="822" cy="150" r="6" fill="#fff" opacity=".9"/><circle cx="815" cy="145" r="5" class="sc-glow"/>'+
      '<rect x="808" y="166" width="14" height="20" rx="4" fill="#fff" opacity=".85"/>'
  };
  function scene(vb, prop){
    return '<svg class="scene" viewBox="'+(vb||'0 0 940 350')+'" preserveAspectRatio="xMidYMid slice">'+
      '<rect x="-200" width="1340" height="350" class="sc-deep"/>'+
      '<path class="sc-wall" d="M500 0V272M620 0V272M860 0V272"/>'+
      '<rect x="-200" y="272" width="1340" height="80" class="sc-floor"/>'+
      '<rect x="-200" y="272" width="1340" height="2" class="sc-glow" opacity=".18"/>'+
      '<path d="M660 272V140a86 86 0 0 1 172 0V272Z" class="sc-glow" opacity=".2"/>'+
      '<path d="M674 272V142a72 72 0 0 1 144 0V272Z" class="sc-glow" opacity=".12"/>'+
      '<path d="M548 120L470 272H690L612 120Z" class="sc-glow" opacity=".07"/>'+
      '<circle cx="580" cy="112" r="120" class="sc-glow" opacity=".07"/><circle cx="580" cy="112" r="56" class="sc-glow" opacity=".12"/>'+
      '<path d="M580 0V86" class="sc-st" opacity=".6"/><path d="M552 114a28 28 0 0 1 56 0Z" class="sc-glow"/><ellipse cx="580" cy="115" rx="15" ry="4" fill="#fff" opacity=".9"/>'+
      (PROPS[prop]||PROPS.desk)+
      '<path d="M854 272l-9-40h44l-9 40z" class="sc-pot"/>'+
      '<ellipse cx="852" cy="210" rx="9" ry="26" class="sc-leaf" transform="rotate(-24 852 210)"/><ellipse cx="878" cy="206" rx="9" ry="28" class="sc-leaf" transform="rotate(18 878 206)"/><ellipse cx="866" cy="196" rx="8" ry="30" class="sc-leaf"/>'+
      '</svg>';
  }

  var NM = '<span data-nm></span>', MARK = '<span class="mark" data-ini></span>', RM = '<span data-rm></span>';
  var WA = '<span class="wa"><svg viewBox="0 0 24 24"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5zm5.3 13.3c-.2.6-1.3 1.2-1.8 1.2-.5.1-1.1.1-3.4-.9-2.8-1.2-4.6-4-4.7-4.200-.1-.2-1.1-1.500-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2z"/></svg></span>';
  function nav(links, cta, cls){ return '<div class="s-nav '+(cls||'')+'"><span class="s-logo">'+MARK+NM+'</span><span class="links">'+links.map(function(l){return '<span>'+l+'</span>';}).join('')+'</span>'+cta+'</div>'; }
  function mnav(cls, right){ return '<div class="m-nav '+(cls||'')+'"><span class="s-logo">'+MARK+NM+'</span>'+(right||'<span class="s-burger"></span>')+'</div>'; }
  function on(arr, idx, tag){ return arr.map(function(s,i){return '<span class="'+(i===idx?'on':'')+'">'+s+'</span>';}).join(''); }

  var LAYOUT = {
    agenda: {
      desk: function(c){
        var it = c.items;
        return '<div class="a-hero">'+scene(null,c.prop)+'<div class="shade"></div>'+nav(c.nav||['Serviços','Equipe','Como chegar'],'<span class="pill">Reservar</span>','lt')+
          '<div class="a-copy"><span class="rev"><span class="st">★★★★★</span><b>4,9</b> no Google, 127 avaliações</span><span class="kick">'+RM+' em Pinheiros</span><p class="h">'+c.h+'</p></div></div>'+
          '<div class="a-book card">'+
            '<div class="bk"><span>Serviço</span><b>'+it[2][0]+'</b></div>'+
            '<div class="bk"><span>Com quem</span><b><span class="avs"><i></i><i></i><i></i></span>Tanto faz</b></div>'+
            '<div class="bk"><span>Dia</span><b>Ter, 15 nov</b></div>'+
            '<div class="bk"><span>Horário</span><b class="t">14:00</b></div>'+
            '<div class="bk-go">Reservar</div></div>'+
          '<div class="a-menu">'+it.map(function(s){return '<div class="mi"><div><b>'+s[0]+'</b><i></i><em>'+s[2]+'</em></div><span>'+s[1]+'</span></div>';}).join('')+'</div>';
      },
      mob: function(c){
        var it = c.items;
        return '<div class="m-hero">'+scene('560 40 330 320',c.prop)+mnav('lt')+'</div>'+
          '<div class="m-cp"><span class="kick">'+RM+'</span><p class="h">'+c.h+'</p></div>'+
          '<div class="m-bk card"><span class="t">Escolha o serviço</span><div class="m-row">'+on(it.slice(1,3).map(function(s){return s[0];}),1)+'</div>'+
          '<span class="t">Terça, 15 de novembro</span><div class="m-row t">'+on(['09:30','14:00','16:30'],1)+'</div>'+
          '<span class="btn1">Reservar às 14:00</span></div>';
      }
    },
    orcamento: {
      desk: function(c){
        return nav(['Serviços','Quem somos','Clientes'],'<span class="pill">Falar no WhatsApp</span>')+
          '<div class="q-top"><div><span class="kick">'+RM+' para pequenas empresas</span><p class="h">'+c.h+'</p></div>'+
            '<div class="q-stat"><b>24h</b><span>para você receber<br>o orçamento</span></div></div>'+
          '<div class="q-form card">'+
            '<div class="qs done"><span class="qn">1</span><span class="ql">Do que você precisa?</span><div class="chips">'+on(c.items,1)+'</div></div>'+
            '<div class="qs done"><span class="qn">2</span><span class="ql">Para quando?</span><div class="seg">'+on(['Com urgência','Ainda este mês','Sem pressa'],1)+'</div></div>'+
            '<div class="qs"><span class="qn">3</span><span class="ql">Seu WhatsApp</span><span class="fld">(11) 9 8765-43<i class="caret"></i></span><span class="fld-n">Só para enviar o orçamento.</span></div>'+
            '<div class="q-go"><i></i><b>Receber orçamento</b><span>Sem compromisso</span></div></div>'+
          '<div class="q-proof"><span><b>'+c.stat[0]+'</b> '+c.stat[1]+'</span><span class="logos"><i style="font:800 15px var(--sans);letter-spacing:-.04em">arco</i><i style="font:italic 400 19px var(--serif)">Padaria Lume</i><i style="font:600 12px var(--mono);letter-spacing:.2em">VISTA</i><i style="font:700 14px var(--sans)">studio9</i></span></div>';
      },
      mob: function(c){
        return mnav()+'<div class="m-body"><span class="kick">'+RM+'</span><p class="h">'+c.h+'</p>'+
          '<div class="m-stat"><b>24h</b><span>para você receber<br>o orçamento</span></div>'+
          '<div class="card m-q"><span class="ql">1. Do que você precisa?</span><div class="chips">'+on(c.items.slice(0,3),1)+'</div>'+
          '<span class="ql">2. Para quando?</span><div class="m-row">'+on(['Urgente','Este mês','Sem pressa'],1)+'</div>'+
          '<span class="btn1">Receber orçamento</span></div></div>';
      }
    },
    produtos: {
      desk: function(c){
        var it = c.items;
        function pc(p, cls, tag, added){ return '<div class="pc card '+cls+'">'+(tag?'<span class="tagx">'+tag+'</span>':'')+'<span class="add'+(added?' on':'')+'">'+(added?'1':'+')+'</span><div class="s-pg">'+GLYPH[p[3]]+'</div><div class="pi"><div><b>'+p[0]+'</b><span>'+p[1]+'</span></div><em>'+p[2]+'</em></div></div>'; }
        return nav(c.nav||['Produtos','Sobre','Contato'],'<span class="cart"><i>2</i>Sacola</span>')+
          '<div class="p-head"><div><span class="kick">'+RM+'</span><p class="h">'+c.h+'</p></div><div class="tabs">'+on(c.tabs,0)+'</div></div>'+
          '<div class="p-grid">'+pc(it[0],'big','Mais pedido',true)+pc(it[1],'')+pc(it[2],'','',true)+pc(it[3],'wide')+'</div>'+
          '<div class="p-bar"><span>2 itens na sacola, <b>'+total(it)+'</b></span><span>Pedir pelo WhatsApp</span></div>';
      },
      mob: function(c){
        var it = c.items;
        return mnav('','<span class="cart"><i>2</i>Sacola</span>')+'<div class="m-tabs">'+on(c.tabs,0)+'</div>'+
          '<div class="m-body" style="padding-bottom:0"><p class="h" style="font-size:calc(26px * var(--hs))">'+c.h+'</p></div>'+
          '<div class="m-pg">'+it.map(function(p){return '<div class="m-pc card"><div class="s-pg">'+GLYPH[p[3]]+'</div><div><b>'+p[0]+'</b><em>'+p[2]+'</em></div></div>';}).join('')+'</div>'+
          '<div class="m-bar"><span>2 itens, <b>'+total(it)+'</b></span><span>Pedir</span></div>';
      }
    },
    trabalhos: {
      desk: function(c){
        var it = c.items;
        return nav(c.nav||['Trabalhos','Sobre','Contato'],'<span class="pill">Fale com a gente</span>')+
          '<div class="f"><div class="f-img">'+pic(c)+'</div>'+
          '<div class="f-side"><span class="kick">'+RM+'</span><p class="h">'+c.h+'</p>'+
            '<div class="f-proj"><span class="cnt">'+unit(c)+' 1 de 12</span><b>'+it[0][0]+'</b><span>'+it[0][1]+'</span></div>'+
            '<div class="f-th">'+thumbs(c)+'</div>'+
            '<span class="tl">Ver todos os '+unit(c).toLowerCase()+'s</span></div></div>';
      },
      mob: function(c){
        var it = c.items;
        return mnav()+'<div class="m-img">'+pic(c,'60 60 480 360')+'</div>'+
          '<div class="m-body"><span class="kick">'+RM+'</span><p class="h" style="font-size:calc(26px * var(--hs))">'+c.h+'</p>'+
          '<div class="f-proj"><span class="cnt">'+unit(c)+' 1 de 12</span><b>'+it[0][0]+'</b></div></div>'+WA;
      }
    }
  };
  function unit(c){ return c.pic === 'arch' ? 'Projeto' : 'Trabalho'; }
  function pic(c, vb){
    if (c.pic === 'arch') return '<div class="ren">'+arch(vb)+'</div><div class="bp">'+arch(vb)+'</div><span class="handle"></span><span class="f-lbl l">Projeto</span><span class="f-lbl r">Obra pronta</span>';
    var img = Array.isArray(c.pic) ? '<div class="gl">'+GLYPH[c.pic[0]]+'</div>' : scene(vb ? '560 60 330 300' : '540 70 380 290', c.prop);
    return img+'<span class="f-lbl r">'+(c.lbl||'Nosso espaço')+'</span>';
  }
  function thumbs(c){
    if (c.pic === 'arch') return '<i>'+arch('110 120 320 240')+'</i><i>'+arch('300 180 260 200')+'</i><i>'+arch('0 200 300 220')+'</i>';
    if (Array.isArray(c.pic)) return c.pic.slice(1).map(function(g){return '<i class="g">'+GLYPH[g]+'</i>';}).join('');
    return ['640 130 240 200','540 60 260 240','600 160 280 150'].map(function(v){return '<i>'+scene(v,c.prop)+'</i>';}).join('');
  }
  function money(s){ var m = /R\$ ([\d.]+)/.exec(s); return m ? +m[1].replace('.','') : 0; }
  function total(it){ return 'R$ ' + (money(it[0][2]) + money(it[2][2])); }

  /* ---------- estado ---------- */
  var st = {goal:'agenda', pal:'sereno', ty:'elegante', name:'', ramo:'Barbearia', match:null};
  var desk = document.getElementById('lab-desk'), mob = document.getElementById('lab-mob');
  var nmIn = document.getElementById('lab-nm'), rmIn = document.getElementById('lab-rm');
  var hint = document.getElementById('lab-hint'), cap = document.getElementById('lab-cap');

  document.getElementById('lab-ramos').innerHTML = RAMOS.map(function(r){return '<option value="'+r.label+'">';}).join('');
  var palRow = document.getElementById('lab-pals');
  Object.keys(PALS).forEach(function(k){
    var p = PALS[k], b = document.createElement('button');
    b.type='button'; b.className='opt'; b.dataset.pal=k; b.setAttribute('aria-pressed','false');
    b.innerHTML = '<span class="sw" aria-hidden="true"><i style="background:'+p.bg+'"></i><i style="background:'+p.acc+'"></i><i style="background:'+p.soft+'"></i></span>'+p.label;
    palRow.appendChild(b);
  });

  /* conteúdo do ramo quando ele usa o mesmo objetivo; senão, textos neutros do objetivo */
  function content(){
    var r = st.match, g = st.goal;
    var m = (r && (r.goal === g ? r : ALT[r.label] && ALT[r.label][g])) || GOALS[g];
    return {h:m.h, items:m.items, stat:m.stat, tabs:m.tabs, nav:m.nav, pic:m.pic, lbl:m.lbl, prop:r ? r.prop : null, brand:r ? r.brand : null};
  }
  function ramoLabel(){ var r = st.ramo.trim(); return r ? r.charAt(0).toUpperCase() + r.slice(1) : 'Seu negócio'; }
  function brand(){ return st.name.trim() || content().brand || 'Seu Negócio'; }
  function slug(s){ return norm(s).replace(/[^a-z0-9]/g,''); }
  function fillText(){
    var n = brand();
    document.querySelectorAll('[data-nm]').forEach(function(e){ e.textContent = n; });
    document.querySelectorAll('[data-ini]').forEach(function(e){ e.textContent = n.charAt(0).toUpperCase(); });
    document.querySelectorAll('[data-rm]').forEach(function(e){ e.textContent = ramoLabel(); });
    document.querySelectorAll('[data-slug]').forEach(function(e){ e.textContent = slug(n) || 'seunegocio'; });
  }
  function applyPal(){
    var p = PALS[st.pal];
    [desk, mob].forEach(function(el){
      ['bg','surf','ink','mut','acc','accInk','soft','line'].forEach(function(k){ el.style.setProperty('--'+k, p[k]); });
      el.classList.toggle('direto', st.ty === 'direto');
    });
  }
  function press(sel, attr, val){ document.querySelectorAll(sel).forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset[attr] === val)); }); }
  function status(){
    var r = st.ramo.trim(), g = GOALS[st.goal].label;
    if (!r) { hint.className = 'hint'; hint.textContent = 'Digite o seu ramo, qualquer que seja.'; }
    else if (st.match) { hint.className = 'hint ok'; hint.innerHTML = 'Montando um site para <b>' + esc(r.toLowerCase()) + '</b>, onde o cliente ' + g + '.'; }
    else { hint.className = 'hint'; hint.innerHTML = '<b>' + esc(r) + '</b> ainda não está nos exemplos, mas o site é feito do zero. Escolha abaixo o que o seu cliente faz no site.'; }
    cap.textContent = 'Prévia: ' + brand() + ', ' + ramoLabel().toLowerCase() + ', cliente ' + g + ', cores ' + PALS[st.pal].label + ', estilo ' + (st.ty === 'direto' ? 'Direto' : 'Elegante');
  }
  function render(){
    var c = content(), L = LAYOUT[st.goal];
    desk.innerHTML = '<div class="fade">'+L.desk(c)+'</div>';
    mob.innerHTML = '<div class="fade">'+L.mob(c)+'</div>';
    applyPal(); fillText(); status();
    press('[data-goal]','goal',st.goal); press('[data-pal]','pal',st.pal); press('[data-ty]','ty',st.ty);
  }

  rmIn.addEventListener('input', function(){
    st.ramo = rmIn.value;
    var m = find(st.ramo);
    if (m !== st.match) {
      st.match = m;
      if (m) { st.goal = m.goal; st.pal = m.pal; }
      render();
    } else { fillText(); status(); }
  });
  nmIn.addEventListener('input', function(){ st.name = nmIn.value; fillText(); status(); });
  document.getElementById('lab-goals').addEventListener('click', function(e){
    var b = e.target.closest('[data-goal]'); if(!b || b.dataset.goal === st.goal) return;
    st.goal = b.dataset.goal; st.pal = st.match ? st.match.pal : GOALS[st.goal].pal; render();
  });
  palRow.addEventListener('click', function(e){
    var b = e.target.closest('[data-pal]'); if(!b) return;
    st.pal = b.dataset.pal; applyPal(); press('[data-pal]','pal',st.pal); status();
  });
  document.getElementById('lab-types').addEventListener('click', function(e){
    var b = e.target.closest('[data-ty]'); if(!b) return;
    st.ty = b.dataset.ty; applyPal(); press('[data-ty]','ty',st.ty); status();
  });

  var stage = document.getElementById('lab-stage');
  function fit(){
    var w = stage.clientWidth, solo = w < 560;
    stage.classList.toggle('solo', solo);
    if (solo){
      var k = Math.min(1.1, w / 262);
      stage.style.setProperty('--k', k); stage.style.setProperty('--ch','540px');
      stage.style.setProperty('--cx', ((w - 262*k)/2) + 'px');
    } else {
      stage.style.setProperty('--k', w / 1152); stage.style.setProperty('--ch','690px'); stage.style.setProperty('--cx','0px');
    }
  }
  if (window.ResizeObserver) new ResizeObserver(fit).observe(stage); else window.addEventListener('resize', fit);
  st.match = find(st.ramo);
  if (st.match) { st.goal = st.match.goal; st.pal = st.match.pal; }
  fit(); render();
})();
