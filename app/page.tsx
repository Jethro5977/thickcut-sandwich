'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, CircleUserRound, Clock3, Home, Info, Leaf, Minus, Plus, ShoppingBag, Sparkles, UtensilsCrossed, Wheat, X } from 'lucide-react';

type Screen = 'home' | 'menu' | 'detail' | 'cart' | 'about' | 'done';
type Item = {
  id: number; name: string; tag: string; kcal: number; price: number; weight: string;
  image: string; note: string; summary: string;
  macros: { label: string; value: number }[];
  ingredients: { name: string; gram: string }[];
};

const items: Item[] = [
  { id: 1, name: '抹茶红豆乳酪三明治', tag: '甜系', kcal: 500, price: 28, weight: '约 260g', image: '/images/menu-08.png', note: '两片厚切吐司夹自制抹茶奶酪酱与红豆沙，甜味来自代糖，也可以尝试加奶冻。', summary: '抹茶奶酪酱 · 红豆沙 · 代糖', macros: [{ label: '蛋白质', value: 14 }, { label: '碳水', value: 52 }, { label: '脂肪', value: 24 }], ingredients: [{ name: '厚切吐司（2 片）', gram: '80g' }, { name: '奶油奶酪', gram: '150g' }, { name: '抹茶粉', gram: '10g' }, { name: '代糖', gram: '20g' }, { name: '红豆沙', gram: '60g' }] },
  { id: 2, name: '杨枝甘露椰奶三明治', tag: '水果', kcal: 450, price: 26, weight: '约 255g', image: '/images/menu-04.png', note: '红柚粒与椰香酸奶泥搭配当季芒果，果香清爽，入口不腻。', summary: '红柚粒 · 椰子粉 · 干嚼酸奶 · 芒果', macros: [{ label: '蛋白质', value: 10 }, { label: '碳水', value: 66 }, { label: '脂肪', value: 14 }], ingredients: [{ name: '厚切吐司（2 片）', gram: '80g' }, { name: '红柚粒', gram: '60g' }, { name: '椰子粉', gram: '15g' }, { name: '干嚼酸奶', gram: '20g' }, { name: '芒果', gram: '80g' }] },
  { id: 3, name: '咸蛋黄肉松贝贝厚蛋三明治', tag: '咸香', kcal: 414, price: 25, weight: '半个 200g', image: '/images/menu-07.png', note: '贝贝南瓜打成泥垫底，滑蛋厚厚一层，再用咸蛋黄和肉松提香。', summary: '滑蛋 · 贝贝南瓜 · 肉松 · 低卡沙拉酱', macros: [{ label: '蛋白质', value: 22 }, { label: '碳水', value: 38 }, { label: '脂肪', value: 16 }], ingredients: [{ name: '厚切吐司（2 片）', gram: '80g' }, { name: '滑蛋（2 个鸡蛋）', gram: '100g' }, { name: '贝贝南瓜', gram: '80g' }, { name: '肉松', gram: '15g' }, { name: '咸蛋黄', gram: '18g' }, { name: '低卡沙拉酱', gram: '20g' }] },
  { id: 4, name: '土豆泥烟熏鸡肉三明治', tag: '高蛋白', kcal: 600, price: 32, weight: '半个 300g', image: '/images/menu-06.png', note: '手压土豆泥混玉米粒，配烟熏鸡肉与蜂蜜芥末酱，是饱腹感最强的一款。', summary: '土豆泥 · 烟熏鸡肉 · 玉米粒 · 蜂蜜芥末', macros: [{ label: '蛋白质', value: 34 }, { label: '碳水', value: 62 }, { label: '脂肪', value: 20 }], ingredients: [{ name: '厚切吐司（2 片）', gram: '80g' }, { name: '土豆泥', gram: '120g' }, { name: '烟熏鸡肉', gram: '90g' }, { name: '玉米粒', gram: '30g' }, { name: '肉松', gram: '10g' }, { name: '蜂蜜芥末酱', gram: '15g' }, { name: '低卡沙拉酱', gram: '20g' }, { name: '黄瓜', gram: '30g' }] },
  { id: 5, name: '火腿芝士鸡扒蛋三明治', tag: '经典', kcal: 550, price: 30, weight: '半个约 300g', image: '/images/menu-05.png', note: '鸡扒现煎、芝士微融，包菜与番茄保留脆度，是怎么选都不会错的经典组合。', summary: '鸡扒 · 火腿 · 芝士片 · 包菜番茄', macros: [{ label: '蛋白质', value: 38 }, { label: '碳水', value: 44 }, { label: '脂肪', value: 22 }], ingredients: [{ name: '厚切吐司（2 片）', gram: '80g' }, { name: '鸡扒', gram: '100g' }, { name: '火腿', gram: '25g' }, { name: '芝士片', gram: '20g' }, { name: '鸡蛋', gram: '50g' }, { name: '包菜', gram: '40g' }, { name: '西红柿', gram: '30g' }, { name: '蜂蜜芥末酱', gram: '15g' }, { name: '低卡沙拉酱', gram: '15g' }] },
  { id: 6, name: '沙葱牛肉皮蛋三明治', tag: '咸香', kcal: 500, price: 30, weight: '半个约 300g', image: '/images/menu-01.png', note: '沙葱牛肉搭配皮蛋与煎蛋，小番茄提鲜，层次浓郁，带一点微辣风味。', summary: '沙葱牛肉 · 皮蛋 · 煎蛋 · 小番茄', macros: [{ label: '蛋白质', value: 32 }, { label: '碳水', value: 40 }, { label: '脂肪', value: 22 }], ingredients: [{ name: '厚切吐司（2 片）', gram: '80g' }, { name: '沙葱牛肉', gram: '80g' }, { name: '皮蛋', gram: '60g' }, { name: '煎蛋', gram: '50g' }, { name: '小西红柿', gram: '30g' }, { name: '生菜', gram: '40g' }] },
  { id: 7, name: '黑芝麻香蕉红薯泥三明治', tag: '甜系', kcal: 650, price: 29, weight: '约 350g', image: '/images/menu-02.png', note: '黑芝麻泥铺底，配红薯泥和新鲜香蕉片，再加奇亚籽花生酱，浓郁又饱腹。', summary: '黑芝麻泥 · 香蕉 · 红薯泥 · 奇亚籽花生酱', macros: [{ label: '蛋白质', value: 16 }, { label: '碳水', value: 78 }, { label: '脂肪', value: 28 }], ingredients: [{ name: '厚切吐司（2 片）', gram: '80g' }, { name: '黑芝麻粉', gram: '100g' }, { name: '炼乳', gram: '20g' }, { name: '牛奶', gram: '70g' }, { name: '香蕉', gram: '60g' }, { name: '奇亚籽花生酱', gram: '25g' }, { name: '红薯泥', gram: '80g' }] },
  { id: 8, name: '莓莓希腊酸奶三明治', tag: '水果', kcal: 300, price: 24, weight: '约 220g', image: '/images/menu-03.png', note: '轻盈低卡之选。希腊酸奶铺满，切开后放上新鲜蓝莓，酸甜细腻。', summary: '希腊酸奶 · 蓝莓 · 低卡清爽', macros: [{ label: '蛋白质', value: 12 }, { label: '碳水', value: 36 }, { label: '脂肪', value: 8 }], ingredients: [{ name: '厚切吐司（2 片）', gram: '80g' }, { name: '希腊酸奶', gram: '120g' }, { name: '蓝莓', gram: '30g' }] },
];

const filters = ['全部', '甜系', '水果', '咸香', '高蛋白', '经典'];
const kcalTone = (kcal: number) => kcal < 450 ? 'low' : kcal <= 500 ? 'mid' : 'high';

type WebMcpTool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown };
declare global { interface Document { modelContext?: { registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => void | Promise<void> } } }

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>('home');
  const [filter, setFilter] = useState('全部');
  const [selectedId, setSelectedId] = useState(1);
  const [detailQty, setDetailQty] = useState(1);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [note, setNote] = useState('');
  const [pickup, setPickup] = useState('今天 14:30');
  const [order, setOrder] = useState<{ id: string; price: number; kcal: number } | null>(null);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const visible = items.filter((item) => filter === '全部' || item.tag === filter);
  const lines = items.filter((item) => cart[item.id]);
  const totals = useMemo(() => lines.reduce((sum, item) => ({ count: sum.count + cart[item.id], price: sum.price + item.price * cart[item.id], kcal: sum.kcal + item.kcal * cart[item.id] }), { count: 0, price: 0, kcal: 0 }), [cart, lines]);

  const go = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const openItem = (id: number) => { setSelectedId(id); setDetailQty(1); go('detail'); };
  const bump = (id: number, amount: number) => setCart((current) => { const next = { ...current }; const value = (next[id] ?? 0) + amount; if (value <= 0) delete next[id]; else next[id] = value; return next; });
  const addSelected = () => { bump(selected.id, detailQty); go('cart'); };
  const submit = () => { setOrder({ id: `FA${Math.floor(Math.random() * 9000 + 1000)}`, price: totals.price, kcal: totals.kcal }); setCart({}); go('done'); };

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool: WebMcpTool = {
      name: 'stage_sandwich_order', title: '配置三明治预约', description: '按菜品编号和数量配置 FaFa 三明治预约单，并同步更新页面购物车。菜品编号为 1 至 8。',
      inputSchema: { type: 'object', properties: { items: { type: 'array', minItems: 1, items: { type: 'object', properties: { id: { type: 'integer', minimum: 1, maximum: 8 }, quantity: { type: 'integer', minimum: 1, maximum: 20 } }, required: ['id', 'quantity'], additionalProperties: false } }, note: { type: 'string', maxLength: 200 }, pickup: { type: 'string', maxLength: 50 } }, required: ['items'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const payload = input as { items?: Array<{ id?: number; quantity?: number }>; note?: string; pickup?: string };
        if (!Array.isArray(payload.items) || !payload.items.length) throw new Error('请至少选择一款三明治');
        const next: Record<number, number> = {};
        for (const line of payload.items) { if (!Number.isInteger(line.id) || !Number.isInteger(line.quantity) || !items.some((item) => item.id === line.id) || (line.quantity ?? 0) < 1 || (line.quantity ?? 0) > 20) throw new Error('菜品编号或数量无效'); next[line.id!] = line.quantity!; }
        setCart(next); setNote(payload.note ?? ''); if (payload.pickup) setPickup(payload.pickup); setScreen('cart');
        const result = items.filter((item) => next[item.id]).reduce((sum, item) => ({ count: sum.count + next[item.id], price: sum.price + item.price * next[item.id], kcal: sum.kcal + item.kcal * next[item.id] }), { count: 0, price: 0, kcal: 0 });
        return { status: 'staged', ...result, currency: 'CNY' };
      },
    };
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* unsupported context */ }
    return () => lifecycle.abort();
  }, []);

  return (
    <main className="app-shell">
      {screen !== 'detail' && screen !== 'done' && <Header cartCount={totals.count} onCart={() => go('cart')} />}
      {screen === 'detail' && <DetailHeader cartCount={totals.count} onBack={() => go('menu')} onCart={() => go('cart')} />}

      <div className="screen-area">
        {screen === 'home' && <HomeScreen onMenu={() => go('menu')} onOpen={openItem} />}
        {screen === 'menu' && <MenuScreen filter={filter} setFilter={setFilter} visible={visible} onOpen={openItem} onAdd={(id) => bump(id, 1)} />}
        {screen === 'detail' && <DetailScreen item={selected} qty={detailQty} setQty={setDetailQty} onAdd={addSelected} />}
        {screen === 'cart' && <CartScreen lines={lines} cart={cart} totals={totals} note={note} setNote={setNote} pickup={pickup} setPickup={setPickup} bump={bump} onMenu={() => go('menu')} onOpen={openItem} onSubmit={submit} />}
        {screen === 'about' && <AboutScreen />}
        {screen === 'done' && <DoneScreen order={order} pickup={pickup} onMenu={() => go('menu')} />}
      </div>

      {!['detail', 'done'].includes(screen) && <TabBar screen={screen} count={totals.count} go={go} />}
    </main>
  );
}

function Logo() { return <div className="logo"><span><Leaf /></span><div><strong>FaFa</strong><small>厚切 · 健康三明治</small></div></div>; }

function Header({ cartCount, onCart }: { cartCount: number; onCart: () => void }) {
  return <header className="header"><Logo /><button className="today" onClick={onCart}><i />今日现做{cartCount > 0 && <b>{cartCount}</b>}</button></header>;
}

function DetailHeader({ cartCount, onBack, onCart }: { cartCount: number; onBack: () => void; onCart: () => void }) {
  return <header className="detail-header"><button onClick={onBack} aria-label="返回菜单"><ArrowLeft /></button><strong>菜品详情</strong><button onClick={onCart} aria-label="查看购物车"><ShoppingBag />{cartCount > 0 && <b>{cartCount}</b>}</button></header>;
}

function HomeScreen({ onMenu, onOpen }: { onMenu: () => void; onOpen: (id: number) => void }) {
  const featured = [items[7], items[5], items[2]];
  return <section className="home-screen">
    <div className="home-hero"><span className="hero-leaf"><Leaf /></span><p>FRESHLY MADE TODAY</p><h1>厚切，<br /><em>也可以很轻盈。</em></h1><div className="hero-copy">每一份都称重、记录、公开热量。<br />真材实料，吃得饱也吃得明白。</div><button onClick={onMenu}>浏览今日菜单 <ChevronRight /></button><div className="hero-rings" /></div>
    <div className="metrics"><div><strong>300–650</strong><small>kcal 热量区间</small></div><div><strong>8 款</strong><small>当季固定菜单</small></div><div><strong>现做</strong><small>预约后再组装</small></div></div>
    <div className="block-title"><div><small>WEEKLY PICKS</small><h2>本周推荐</h2></div><button onClick={onMenu}>全部 8 款 <ChevronRight /></button></div>
    <div className="featured-row">{featured.map((item) => <button className="featured-card" key={item.id} onClick={() => onOpen(item.id)}><img src={item.image} alt="" /><span>{item.name}</span><div><b>¥{item.price}</b><small>{item.kcal} kcal</small></div></button>)}</div>
    <a className="qr-card" href="/images/order-qr.png" target="_blank"><img src="/images/order-qr.png" alt="本站下单二维码" /><div><small>SCAN TO ORDER</small><strong>把菜单分享给朋友</strong><span>长按保存二维码 · 扫码浏览菜单</span></div><ChevronRight /></a>
  </section>;
}

function MenuScreen({ filter, setFilter, visible, onOpen, onAdd }: { filter: string; setFilter: (value: string) => void; visible: Item[]; onOpen: (id: number) => void; onAdd: (id: number) => void }) {
  return <section className="menu-screen"><div className="menu-heading"><small>OUR MENU</small><h1>今天想吃哪一款？</h1><p>点击菜品查看完整用料与营养估算</p></div><div className="filter-row">{filters.map((value) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{value}</button>)}</div><div className="menu-grid">{visible.map((item) => <article className="dish-card" key={item.id}><button className="dish-main" onClick={() => onOpen(item.id)}><div className="dish-image"><img src={item.image} alt={item.name} /><span className="tag">{item.tag}</span><span className={`kcal ${kcalTone(item.kcal)}`}><b>{item.kcal}</b> kcal</span></div><div className="dish-copy"><h2>{item.name}</h2><p>{item.summary}</p></div></button><div className="dish-footer"><div><strong>¥{item.price}</strong><small>{item.weight}</small></div><button onClick={() => onAdd(item.id)} aria-label={`加入${item.name}`}><Plus />加入</button></div></article>)}</div><p className="estimate-note">所有热量与营养数据均按现有配方克重估算，实际可能有 ±10% 浮动</p></section>;
}

function DetailScreen({ item, qty, setQty, onAdd }: { item: Item; qty: number; setQty: (value: number) => void; onAdd: () => void }) {
  return <section className="detail-screen"><div className="detail-photo"><img src={item.image} alt={item.name} /></div><div className="detail-body"><div className="detail-tags"><span>{item.tag}</span><span>{item.weight}</span></div><h1>{item.name}</h1><p className="detail-note">{item.note}</p><div className="nutrition-card"><div className="calorie-title"><div><small>整份热量</small><strong>{item.kcal}<em>kcal</em></strong></div><span>约占日均 2000 kcal 的<br /><b>{Math.round(item.kcal / 20)}%</b></span></div><div className="calorie-track"><i style={{ width: `${Math.min(100, item.kcal / 7)}%` }} /></div><div className="macro-row">{item.macros.map((macro) => <div key={macro.label}><strong>{macro.value}<small>g</small></strong><span>{macro.label}</span></div>)}</div></div><div className="ingredients-title"><h2>用料 · 克重公开</h2><small>按当前配方</small></div><div className="ingredient-card">{item.ingredients.map((ingredient) => <div key={ingredient.name}><span><i />{ingredient.name}</span><strong>{ingredient.gram}</strong></div>)}</div><div className="green-note"><Leaf />酱料自制，甜系使用代糖；如有过敏或特殊饮食需求，请在预约备注中说明。</div></div><div className="detail-action"><div><button onClick={() => setQty(Math.max(1, qty - 1))}><Minus /></button><strong>{qty}</strong><button onClick={() => setQty(qty + 1)}><Plus /></button></div><button onClick={onAdd}>加入购物车 · ¥{item.price * qty}</button></div></section>;
}

function CartScreen({ lines, cart, totals, note, setNote, pickup, setPickup, bump, onMenu, onOpen, onSubmit }: { lines: Item[]; cart: Record<number, number>; totals: { count: number; price: number; kcal: number }; note: string; setNote: (value: string) => void; pickup: string; setPickup: (value: string) => void; bump: (id: number, amount: number) => void; onMenu: () => void; onOpen: (id: number) => void; onSubmit: () => void }) {
  if (!lines.length) return <section className="empty-screen"><div className="empty-icon"><ShoppingBag /></div><h1>购物车还是空的</h1><p>去菜单挑一份厚切三明治吧<br />每一款都真材实料、热量透明</p><button onClick={onMenu}>浏览菜单 <ChevronRight /></button><div className="quick-title">热销推荐</div><div className="quick-grid">{[items[2], items[7], items[0]].map((item) => <button key={item.id} onClick={() => onOpen(item.id)}><img src={item.image} alt="" /><span>{item.name}</span><b>¥{item.price}</b></button>)}</div></section>;
  return <section className="cart-screen"><div className="page-title"><small>YOUR ORDER</small><h1>预约清单</h1><p>{totals.count} 份三明治，确认后为你新鲜制作</p></div><div className="cart-list">{lines.map((item) => <article key={item.id}><button className="cart-photo" onClick={() => onOpen(item.id)}><img src={item.image} alt="" /></button><div className="cart-copy"><strong>{item.name}</strong><span>{item.kcal * cart[item.id]} kcal · ¥{item.price * cart[item.id]}</span></div><div className="stepper"><button onClick={() => bump(item.id, -1)}><Minus /></button><b>{cart[item.id]}</b><button onClick={() => bump(item.id, 1)}><Plus /></button></div></article>)}</div><div className="order-card"><div className="summary-title"><span>本单合计</span><b>{totals.kcal} <small>kcal</small></b><strong>¥{totals.price}</strong></div><label><span><Clock3 />预计自取时间</span><input value={pickup} onChange={(event) => setPickup(event.target.value)} placeholder="如：今天 14:30" /></label><label><span><Info />订单备注</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="例：沙拉酱减半、切开、不要黄瓜…" /></label></div><button className="checkout" onClick={onSubmit}>提交预约 · ¥{totals.price}<ChevronRight /></button><p className="checkout-note">提交后请通过微信确认，自取前 10 分钟现做</p></section>;
}

function AboutScreen() { return <section className="about-screen"><div className="about-photo"><img src="/images/menu-08.png" alt="抹茶红豆乳酪三明治" /><span>从一份认真称重的早餐开始</span></div><div className="page-title"><small>ABOUT FAFA</small><h1>FaFa 的坚持</h1></div><p className="about-copy">从家庭厨房开始，八款配方反复调整。每一种食材上秤称重后才夹进面包——所以我们敢把克重和热量都写在菜单上。</p><div className="values"><article><span><Wheat /></span><div><h2>称重出品</h2><p>食材按配方称重，热量误差尽量控制在 ±10% 内。</p></div></article><article><span><Leaf /></span><div><h2>清爽酱料</h2><p>自制低卡沙拉酱与蜂蜜芥末，甜系使用代糖。</p></div></article><article><span><Sparkles /></span><div><h2>当日现做</h2><p>不隔夜、不预制，确认预约后再组装。</p></div></article></div><div className="contact-card"><img src="/images/order-qr.png" alt="菜单二维码" /><div><small>CONTACT US</small><strong>微信：TwiceTwice1 / DoncicX</strong><span>营业 09:00–17:00（周一休）<br />预约自取 · 3 公里内配送</span></div></div><p className="estimate-note">孕期、过敏或特殊饮食需求请提前告知</p></section>; }

function DoneScreen({ order, pickup, onMenu }: { order: { id: string; price: number; kcal: number } | null; pickup: string; onMenu: () => void }) { return <section className="done-screen"><div className="done-check"><Check /></div><small>RESERVATION RECEIVED</small><h1>已收到你的预约</h1><p>请在微信上发送订单号，确认自取时间。<br />三明治将在你到店前 10 分钟现做。</p><div className="receipt"><div><span>订单号</span><strong>{order?.id}</strong></div><div><span>预计自取</span><strong>{pickup}</strong></div><div><span>合计</span><strong>¥{order?.price}</strong></div><div><span>总热量</span><strong>{order?.kcal} kcal</strong></div></div><div className="done-contact"><CircleUserRound /><div><span>添加微信确认预约</span><strong>TwiceTwice1 / DoncicX</strong></div></div><button onClick={onMenu}>继续浏览菜单</button></section>; }

function TabBar({ screen, count, go }: { screen: Screen; count: number; go: (screen: Screen) => void }) {
  const tabs: { key: Screen; label: string; icon: typeof Home }[] = [{ key: 'home', label: '首页', icon: Home }, { key: 'menu', label: '菜单', icon: UtensilsCrossed }, { key: 'cart', label: '购物车', icon: ShoppingBag }, { key: 'about', label: '我们', icon: Leaf }];
  return <nav className="tab-bar" aria-label="主导航">{tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.key} className={screen === tab.key ? 'active' : ''} onClick={() => go(tab.key)}><span><Icon />{tab.key === 'cart' && count > 0 && <b>{count}</b>}</span><small>{tab.label}</small></button>; })}</nav>;
}
