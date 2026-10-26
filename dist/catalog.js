(() => {
  const products = [
    {
        "id": "conceito-scooter",
        "name": "Scooter elétrica · exemplo",
        "brand": "Ilustrativo",
        "type": "scooter",
        "use": "Cidade · exemplo visual",
        "tag": "Ilustrativo",
        "image": "https://cdn.mediablog.mediapark.uz/corecms/post-thumbnails/01K1JES6SN0XNVFZ01V2CB1S8A.webp",
        "source": "#colecao",
        "description": "Imagem demonstrativa para visualizar a organização do catálogo. Não representa produto, versão, especificação ou estoque da loja.",
        "facts": [
            "A confirmar",
            "A confirmar",
            "Sob consulta"
        ],
        "factLabels": [
            "Autonomia",
            "Versão",
            "Disponibilidade"
        ]
    },
    {
        "id": "conceito-bike",
        "name": "E-bike · exemplo",
        "brand": "Ilustrativo",
        "type": "bike",
        "use": "Trajeto · exemplo visual",
        "tag": "Ilustrativo",
        "image": "https://monarcbikes.com/cdn/shop/files/Tracer-Superior-Side2.png?v=1782182100&width=1400",
        "source": "#colecao",
        "description": "Imagem demonstrativa. Produto e disponibilidade precisam ser confirmados com a loja.",
        "facts": [
            "A confirmar",
            "A confirmar",
            "Sob consulta"
        ],
        "factLabels": [
            "Autonomia",
            "Versão",
            "Disponibilidade"
        ]
    },
    {
        "id": "conceito-patinete",
        "name": "Patinete · exemplo",
        "brand": "Ilustrativo",
        "type": "patinete",
        "use": "Último trecho · exemplo",
        "tag": "Ilustrativo",
        "image": "https://i05.appmifile.com/467_item_hu/12/08/2025/bec4608a80448b9a4a90929090a60bd7.png?q=85&thumb=1&w=900",
        "source": "#colecao",
        "description": "Imagem demonstrativa. Não atribui modelo ou ficha à loja.",
        "facts": [
            "A confirmar",
            "A confirmar",
            "Sob consulta"
        ],
        "factLabels": [
            "Autonomia",
            "Versão",
            "Disponibilidade"
        ]
    },
    {
        "id": "conceito-triciclo",
        "name": "Triciclo · exemplo",
        "brand": "Ilustrativo",
        "type": "trike",
        "use": "Conforto · exemplo visual",
        "tag": "Ilustrativo",
        "image": "https://www.pashley.co.uk/cdn/shop/products/pashley-alecs-e-cargo-trike-side-view_ba1894c5-6461-44a0-9b64-7422251e629a_1800x.jpg?v=1674642067",
        "source": "#colecao",
        "description": "Imagem demonstrativa; modelo, especificações, preço e estoque dependem da confirmação da loja.",
        "facts": [
            "A confirmar",
            "A confirmar",
            "Sob consulta"
        ],
        "factLabels": [
            "Autonomia",
            "Versão",
            "Disponibilidade"
        ]
    }
];
  const category = { bike: 'E-bike', scooter: 'Scooter', patinete: 'Patinete', trike: 'Triciclo elétrico', mono: 'Monociclo', moped: 'Moped elétrica' };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const catalog = $('#catalog');
  const saved = new Set(read('saved-voltix-mobilidade-eletrica-conceito', []));
  let cart = read('cart-voltix-mobilidade-eletrica-conceito', {}), active = 'todos', query = '', sort = 'featured';
  let compare = new Set(), compareMode = false;
  let timer;

  function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private browsing can disable storage. */ } }
  function toast(message) { const node = $('#toast'); node.textContent = message; node.classList.add('show'); clearTimeout(timer); timer = setTimeout(() => node.classList.remove('show'), 2400); }
  function productCard(p) {
    const facts = p.facts || [category[p.type], p.use.split(' · ')[0], 'Sob consulta'];
    const factLabels = p.factLabels || ['Categoria', 'Perfil', 'Ficha'];
    const backup = { scooter: products.find(x => x.id === 'segway-zt3'), patinete: products.find(x => x.id === 'riley-rs1'), bike: products.find(x => x.id === 'windhorse-f2'), trike: products.find(x => x.id === 'alecs-trike'), mono: products.find(x => x.id === 'inmotion-v11y'), moped: products.find(x => x.id === 'benzina-zero') }[p.type];
    return `<article class="card reveal" data-id="${p.id}"><div class="card-media"><span class="card-topline">${p.tag}</span><label class="compare-check" style="display:${compareMode ? 'flex' : 'none'}"><input type="checkbox" data-compare="${p.id}" ${compare.has(p.id) ? 'checked' : ''}> Comparar</label><img src="${p.image}" data-fallback="${backup?.image || ''}" alt="${p.brand} ${p.name}, ${category[p.type]}" loading="lazy" onerror="if(this.dataset.fallback&amp;&amp;this.src!==this.dataset.fallback){this.src=this.dataset.fallback}else{this.closest('.card-media').classList.add('image-error')}"></div><div class="card-meta"><span class="tag">${p.brand} / ${category[p.type]}</span><button class="heart ${saved.has(p.id) ? 'saved' : ''}" aria-label="Salvar ${p.name}" aria-pressed="${saved.has(p.id)}">${saved.has(p.id) ? '♥' : '♡'}</button></div><div class="card-info"><div><h3>${p.name}</h3><div class="subtitle">${p.use}</div></div><div class="price">Consultar</div></div><div class="specs">${facts.map((fact, i) => `<div class="spec"><span>${factLabels[i] || 'Ficha'}</span><strong>${fact}</strong></div>`).join('')}</div><div class="card-foot"><button class="inspect" data-detail="${p.id}">Ver detalhes <span>↗</span></button><button class="card-cta" data-add="${p.id}">Adicionar</button></div></article>`;
  }
  function filtered() {
    let list = products.filter(p => (active === 'todos' || p.type === active) && (!query || `${p.name} ${p.brand} ${p.use} ${category[p.type]}`.toLowerCase().includes(query)));
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }
  function render() {
    const list = filtered();
    $('#filterCount').textContent = `${String(list.length).padStart(2, '0')} EXEMPLOS ILUSTRATIVOS`;
    catalog.innerHTML = list.length ? list.map(productCard).join('') : '<div class="empty-state">Nenhum veículo encontrado. Tente outro nome ou categoria.</div>';
    $$('[data-add]', catalog).forEach(b => b.onclick = () => add(b.dataset.add));
    $$('[data-detail]', catalog).forEach(b => b.onclick = () => detail(b.dataset.detail));
    $$('[data-compare]', catalog).forEach(b => b.onchange = () => setCompare(b.dataset.compare, b.checked));
    $$('.heart', catalog).forEach(b => b.onclick = () => toggleSaved(b.closest('.card').dataset.id));
    $$('[data-category]').forEach(a => a.onclick = () => setFilter(a.dataset.category));
    revealNew();
  }
  function revealNew() { $$('.reveal:not(.in)').forEach(el => { if (!('IntersectionObserver' in window)) el.classList.add('in'); else observer.observe(el); }); }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } }), { threshold: .08 }) : { observe(el) { el.classList.add('in'); }, unobserve() {} };
  function setFilter(value) { active = value; $$('.filter').forEach(b => { const selected = b.dataset.filter === value; b.classList.toggle('active', selected); b.setAttribute('aria-pressed', String(selected)); }); render(); }
  function toggleSaved(id) { saved.has(id) ? saved.delete(id) : saved.add(id); write('saved-voltix-mobilidade-eletrica-conceito', [...saved]); render(); toast(saved.has(id) ? 'Modelo salvo' : 'Modelo removido dos salvos'); }
  function setCompare(id, checked) { if (checked && compare.size >= 3) { toast('Compare até 3 modelos por vez'); render(); return; } checked ? compare.add(id) : compare.delete(id); $('#compareCount').textContent = compare.size; drawCompare(); }
  function drawCompare() { const list = [...compare].map(id => products.find(p => p.id === id)).filter(Boolean); $('#compareItems').innerHTML = list.map(p => `<div class="compare-item"><b>${p.name}</b>${p.brand} · ${category[p.type]}<br>${p.use}<br>${(p.facts || ['Ficha técnica sob consulta']).join(' · ')}<br>Preço: consulte a loja</div>`).join(''); $('#comparePanel').classList.toggle('open', list.length > 0); }
  function add(id) { cart[id] = (cart[id] || 0) + 1; write('cart-voltix-mobilidade-eletrica-conceito', cart); paintCart(); toast('Adicionado à sua seleção'); }
  function quantity(id, delta) { cart[id] = (cart[id] || 0) + delta; if (cart[id] <= 0) delete cart[id]; write('cart-voltix-mobilidade-eletrica-conceito', cart); paintCart(); }
  function paintCart() {
    const entries = Object.entries(cart).filter(([id, q]) => products.some(p => p.id === id) && q > 0);
    const count = entries.reduce((n, [, q]) => n + q, 0);
    $('#bagCount').textContent = count; $('#cartTotalCount').textContent = `(${count})`;
    $('#cartItems').innerHTML = entries.length ? entries.map(([id, q]) => { const p = products.find(x => x.id === id); return `<div class="drawer-basket"><strong>${p.name}</strong><div class="quantity"><button data-minus="${id}" aria-label="Remover uma unidade">−</button><span>${q}</span><button data-plus="${id}" aria-label="Adicionar uma unidade">+</button></div><small>${p.brand} · ${category[p.type]} · preço sob consulta</small></div>`; }).join('') : '<p class="drawer-note">Sua seleção está vazia. Explore o catálogo e adicione modelos para consultar com a loja.</p>';
    
    const body = encodeURIComponent(entries.map(([id, q]) => `${products.find(p => p.id === id).name} — quantidade ${q}`).join('\n'));
    $('#cartContact').href = `https://wa.me/5519990037604?text=${encodeURIComponent('Olá, quero consultar estes modelos: ') + body}`;
    $$('[data-minus]').forEach(b => b.onclick = () => quantity(b.dataset.minus, -1)); $$('[data-plus]').forEach(b => b.onclick = () => quantity(b.dataset.plus, 1));
  }
  let returnFocus = null;
  function focusable(container) { return $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])', container).filter(el => el.getAttribute('aria-hidden') !== 'true' && el.offsetParent !== null); }
  function trapFocus(event, container) {
    if (event.key !== 'Tab') return;
    const items = focusable(container);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  }
  function openDrawer() { returnFocus = document.activeElement; $('#cartPanel').classList.add('open'); $('#scrim').classList.add('on'); $('#cartPanel').setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); $('#cartClose').focus(); }
  function closeDrawer() { const wasOpen = $('#cartPanel').classList.contains('open'); $('#cartPanel').classList.remove('open'); $('#scrim').classList.remove('on'); $('#cartPanel').setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); if (wasOpen) returnFocus?.focus(); }
  function detail(id) { const p = products.find(x => x.id === id); const facts = p.facts || ['Ficha técnica detalhada sob consulta']; const labels = p.factLabels || ['Ficha']; returnFocus = document.activeElement; $('#modalContent').innerHTML = `<div class="modal-grid"><img src="${p.image}" alt="${p.brand} ${p.name}" onerror="this.style.display='none'"><div><span class="eyebrow">${p.brand} / ${category[p.type]}</span><h2 id="modalTitle">${p.name}</h2><p>${p.description}</p><div class="modal-specs"><div>Categoria<b>${category[p.type]}</b></div><div>Uso<b>${p.use}</b></div><div>Preço<b>Sob consulta</b></div><div>Disponibilidade<b>Consulte a loja</b></div>${facts.map((fact, i) => `<div>${labels[i] || 'Ficha'}<b>${fact}</b></div>`).join('')}</div><a class="product-source" href="#colecao">Voltar ao catálogo ↗</a><p class="fine">Imagem ilustrativa. Estoque, versão, preço e especificações devem ser confirmados com a loja.</p><button class="primary modal-add">Adicionar à seleção ↗</button></div></div>`; $('#modalBack').classList.add('open'); $('#modalBack').setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); $('#modalClose').focus(); $('.modal-add').onclick = () => { add(p.id); closeModal(); openDrawer(); }; }
  function closeModal() { const wasOpen = $('#modalBack').classList.contains('open'); $('#modalBack').classList.remove('open'); $('#modalBack').setAttribute('aria-hidden', 'true'); if (!$('#cartPanel').classList.contains('open')) document.body.classList.remove('no-scroll'); if (wasOpen && !$('#cartPanel').classList.contains('open')) returnFocus?.focus(); }

  $$('.filter').forEach(b => b.onclick = () => setFilter(b.dataset.filter));
  $('#catalogSearch').oninput = e => { query = e.target.value.trim().toLowerCase(); render(); };
  $('#sortSelect').onchange = e => { sort = e.target.value; render(); };
  $('#searchBtn').onclick = () => { $('#colecao').scrollIntoView({ behavior: 'smooth' }); $('#catalogSearch').focus(); };
  $('#cartBtn').onclick = openDrawer; $('#cartClose').onclick = closeDrawer; $('#scrim').onclick = closeDrawer;
  $('#modalClose').onclick = closeModal; $('#modalBack').onclick = e => { if (e.target === e.currentTarget) closeModal(); };
  $('#compareTrigger').onclick = () => { compareMode = !compareMode; $('#compareTrigger').setAttribute('aria-pressed', String(compareMode)); render(); toast(compareMode ? 'Marque até 3 modelos para comparar' : 'Comparação fechada'); };
  $('#compareClose').onclick = () => { compare.clear(); drawCompare(); render(); };
  document.addEventListener('keydown', e => {
    if ($('#modalBack').classList.contains('open')) {
      if (e.key === 'Escape') { closeModal(); return; }
      trapFocus(e, $('.modal'));
    } else if ($('#cartPanel').classList.contains('open')) {
      if (e.key === 'Escape') { closeDrawer(); return; }
      trapFocus(e, $('#cartPanel'));
    }
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); $('#catalogSearch').focus(); }
  });
  document.documentElement.classList.add('js');
  render(); paintCart(); drawCompare();
})();
