# Latif Home: site de empilhadeiras

Site estático da Latif Home (Lauro de Freitas, BA). Tem uma apresentação 3D da empilhadeira Kyron KYD30 que acompanha a rolagem, o catálogo de empilhadeiras e paleteiras e o pedido de orçamento pelo WhatsApp.

O site não precisa de build, banco de dados nem dependências: é HTML, CSS e JavaScript puros. O three.js (motor 3D) vem incluído na pasta `vendor/`, então o site não depende de CDN.

## Estrutura

```
index.html              Página única: textos fixos, seções e importação dos scripts
assets/css/styles.css   Visual do site (cores, tipografia, layout)
assets/js/app.js        Catálogo, preços, fichas técnicas, capítulos do 3D e WhatsApp
assets/js/scene.js      Modelo 3D, iluminação e animação pela rolagem
assets/img/             Fotos dos produtos e imagem de compartilhamento (og-image.jpg)
vendor/three/           three.js r169 (licença MIT)
favicon.svg             Ícone da aba
vercel.json             Cache e cabeçalhos de segurança na Vercel
```

## Testar no computador

O 3D usa módulos JavaScript, que não funcionam abrindo o `index.html` com dois cliques. Use um servidor local, dentro da pasta do projeto:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Depois abra `http://localhost:3000` (serve) ou `http://localhost:8000` (Python).

## Subir no GitHub

```bash
git init
git add .
git commit -m "Site Latif Home"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/latif-home.git
git push -u origin main
```

Se o repositório já existe, copie o conteúdo desta pasta para ele e faça commit e push normalmente.

## Publicar na Vercel

1. Acesse vercel.com e entre com a conta do GitHub.
2. Clique em **Add New → Project** e importe o repositório.
3. Em **Framework Preset**, escolha **Other**.
4. Deixe **Build Command** e **Output Directory** vazios. O site é servido a partir da raiz.
5. Clique em **Deploy**.

Depois disso, cada `git push` na branch `main` publica uma nova versão automaticamente.

Para usar um domínio próprio, vá em **Settings → Domains** no projeto da Vercel.

### Depois de ter o endereço final

No `index.html`, troque o endereço da imagem de compartilhamento por um endereço completo. Isso faz o WhatsApp, o Facebook e o LinkedIn mostrarem a prévia com a imagem:

```html
<meta property="og:image" content="https://SEU-DOMINIO/assets/img/og-image.jpg">
```

## Onde editar

| O que mudar | Arquivo | Onde |
|---|---|---|
| Número do WhatsApp | `assets/js/app.js` | `const CONTATO` no início do arquivo |
| Número exibido no contato | `index.html` | seção `id="contato"`, link `id="wa-num"` |
| Preços, fichas e descrições | `assets/js/app.js` | lista `const CARGA` |
| Ordem dos produtos no catálogo | `assets/js/app.js` | `const ORDER` |
| Textos e câmera de cada capítulo do 3D | `assets/js/app.js` | `window.CHAPTERS` |
| Números da ficha da KYD30 e tabela de modelos | `index.html` | seção `id="ficha"` |
| Cores e fontes | `assets/css/styles.css` | bloco `:root` no início |
| Fotos dos produtos | `assets/img/` | mantenha o mesmo nome do arquivo `.webp` |

## Observações

- O modelo 3D é ilustrativo, e o site avisa isso na própria apresentação. Ele foi recriado em código a partir das fotos do catálogo e não é o arquivo CAD do fabricante.
- No celular, o sombreamento de contato do 3D fica desligado para manter a rolagem fluida.
- As fontes vêm do Google Fonts. Se elas não carregarem, o site usa a fonte do sistema.
