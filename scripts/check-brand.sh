#!/usr/bin/env bash
# Conformidade com o manual da marca Stelqo. Uso: bash scripts/check-brand.sh
# Sai 0 e imprime OK quando nada da identidade antiga sobrou.
# ponytail: grep de strings, não parser de CSS — pega resto da marca antiga, não valida layout.
cd "$(dirname "$0")/.." || exit 2
PAGES="index.html projetos.html servicos.html sobre.html contato.html clinica-horizonte.html"
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
fail=0

# Cópias para checagem; em index.html os mocks do Laboratório viram linhas vazias (mantém numeração).
for p in $PAGES; do
  if [ "$p" = index.html ]; then
    awk '/id="laboratorio"/{lab=1} /id="lab-tpl"/{tpl=1} {print (lab||tpl)?"":$0} lab&&/<\/section>/{lab=0}' "$p" > "$tmp/$p"
  else
    cp "$p" "$tmp/$p"
  fi
done
FILES=$(for p in $PAGES; do echo "$tmp/$p"; done)
[ -f assets/css/stelqo.css ] && FILES="$FILES assets/css/stelqo.css"

no() { # padrão não pode aparecer
  local hits; hits=$(grep -nF -- "$1" $FILES 2>/dev/null | sed "s#$tmp/##" | cut -c1-110)
  if [ -n "$hits" ]; then echo "FAIL: '$1'"; echo "$hits" | head -5 | sed 's/^/    /'; fail=1; fi
}
for pat in '#374CFF' '#2335E6' '#181B20' '#F5F3EF' '#B8C7FF' '#ECE9E3' '#E4E1DA' '#3F444D' '#5F646E' '#A4A9B4' \
  'rgba(24,27,32' 'rgba(245,243,239' 'rgba(55,76,255' 'rgba(184,199,255' '"Geist",' 'Geist,' \
  'mono-mark' 'sig-name' 'ftr-big' '— Bernardo Corrêa' 'Bernardo Corrêa —' '© 2026 Bernardo' \
  'font-weight:550' 'font:450' 'font:550' 'font:650' '[ADICIONAR' 'identidade.html' 'Vi seu portfólio' 'Vi%20seu%20portf'; do
  no "$pat"
done

# Geist só pode ser carregada em index.html (opção "Moderna" do Laboratório).
for p in $PAGES; do
  [ "$p" = index.html ] && continue
  grep -qF 'family=Geist:' "$p" && { echo "FAIL: 'family=Geist:' em $p"; fail=1; }
done

# Toda página usa o CSS, o logo e o favicon oficiais.
for p in $PAGES; do
  for need in 'assets/css/stelqo.css' 'assets/brand/stelqo-horizontal-positiva.svg' 'assets/brand/favicon-32px.png'; do
    grep -qF "$need" "$p" || { echo "FAIL: $p sem $need"; fail=1; }
  done
done

grep -qF 'Olá, Bernardo!' assets/js/site.js && { echo "FAIL: 'Olá, Bernardo!' em assets/js/site.js"; fail=1; }
[ -e identidade.html ] && { echo "FAIL: identidade.html ainda existe"; fail=1; }

[ $fail = 0 ] && echo OK
exit $fail
