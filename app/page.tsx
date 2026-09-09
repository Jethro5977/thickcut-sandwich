'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Check, ChevronRight, Leaf, Minus, Plus, ShoppingBag, Sparkles, Wheat, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

type MenuItem = { id: number; name: string; shortName: string; tag: string; calories: number; approximate?: boolean; weight: string; price: number; ingredients: string[]; nutrition: { protein: number; carbs: number; fat: number }; imagePosition: string };

const menu: MenuItem[] = [
  { id: 1, name: '抹茶红豆乳酪三明治', shortName: '抹茶红豆乳酪', tag: '甜系', calories: 500, approximate: true, weight: '整份约 260g', price: 22, ingredients: ['全麦面包', '抹茶粉 10g', '奶油奶酪 150g', '代糖 20g', '低糖豆沙'], nutrition: { protein: 17, carbs: 62, fat: 21 }, imagePosition: '50% 5%' },
  { id: 2, name: '杨枝甘露椰奶三明治', shortName: '杨枝甘露椰奶', tag: '水果', calories: 450, approximate: true, weight: '整份约 250g', price: 21, ingredients: ['全麦面包', '红柚粒', '椰子粉', '干嚼酸奶', '鲜芒果'], nutrition: { protein: 13, carbs: 71, fat: 13 }, imagePosition: '78% 23%' },
  { id: 3, name: '咸蛋黄肉松贝贝厚蛋三明治', shortName: '咸蛋黄肉松贝贝厚蛋', tag: '咸香', calories: 414, weight: '半个 200g', price: 24, ingredients: ['全麦面包', '低卡沙拉酱', '肉松', '现做滑蛋', '贝贝南瓜'], nutrition: { protein: 22, carbs: 43, fat: 17 }, imagePosition: '20% 53%' },
  { id: 4, name: '土豆泥烟熏鸡肉三明治', shortName: '土豆泥烟熏鸡肉', tag: '高蛋白', calories: 600, weight: '半个 300g', price: 26, ingredients: ['全麦面包', '低卡沙拉酱', '肉松', '甜玉米粒', '烟熏鸡肉', '蜂蜜芥末酱', '脆黄瓜'], nutrition: { protein: 35, carbs: 68, fat: 21 }, imagePosition: '76% 58%' },
  { id: 5, name: '火腿芝士鸡扒蛋三明治', shortName: '火腿芝士鸡扒蛋', tag: '经典', calories: 550, approximate: true, weight: '半个约 300g', price: 28, ingredients: ['全麦面包', '蜂蜜芥末酱', '芝士片', '香煎鸡扒', '包菜', '番茄', '鸡蛋', '低卡沙拉酱'], nutrition: { protein: 39, carbs: 48, fat: 23 }, imagePosition: '48% 92%' },
];

const categories = ['全部', '甜系', '咸香', '水果', '高蛋白', '经典'];
const calorieTone = (calories: number) => calories < 450 ? 'cal-low' : calories <= 500 ? 'cal-mid' : 'cal-high';

type WebMcpTool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown };
declare global { interface Document { modelContext?: { registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => void | Promise<void> } } }

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const visibleMenu = useMemo(() => menu.filter((item) => activeCategory === '全部' || item.tag === activeCategory), [activeCategory]);
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartItems = menu.filter((item) => cart[item.id]);
  const total = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool: WebMcpTool = {
      name: 'stage_sandwich_order',
      title: '加入厚切购物袋',
      description: '按菜品编号和数量配置一份三明治预订单，并同步更新页面购物袋。菜品编号为 1 到 5。',
      inputSchema: {
        type: 'object',
        properties: {
          items: { type: 'array', minItems: 1, items: { type: 'object', properties: { id: { type: 'integer', minimum: 1, maximum: 5 }, quantity: { type: 'integer', minimum: 1, maximum: 20 } }, required: ['id', 'quantity'], additionalProperties: false } },
          note: { type: 'string', maxLength: 200 },
        },
        required: ['items'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const payload = input as { items?: Array<{ id?: number; quantity?: number }>; note?: string };
        if (!Array.isArray(payload.items) || payload.items.length === 0) throw new Error('请至少选择一款三明治');
        const next: Record<number, number> = {};
        for (const item of payload.items) {
          if (!Number.isInteger(item.id) || !Number.isInteger(item.quantity) || !menu.some((entry) => entry.id === item.id) || (item.quantity ?? 0) < 1 || (item.quantity ?? 0) > 20) throw new Error('菜品编号或数量无效');
          next[item.id!] = item.quantity!;
        }
        const nextItems = menu.filter((item) => next[item.id]);
        const nextTotal = nextItems.reduce((sum, item) => sum + item.price * next[item.id], 0);
        setCart(next); setNote(typeof payload.note === 'string' ? payload.note : ''); setSubmitted(false);
        return { status: 'staged', itemCount: Object.values(next).reduce((sum, quantity) => sum + quantity, 0), total: nextTotal, currency: 'CNY' };
      },
    };
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* unsupported preview context */ }
    return () => lifecycle.abort();
  }, []);

  const changeQuantity = (id: number, amount: number) => {
    setSubmitted(false);
    setCart((current) => {
      const next = Math.max(0, (current[id] ?? 0) + amount);
      if (!next) { const clone = { ...current }; delete clone[id]; return clone; }
      return { ...current, [id]: next };
    });
  };

  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="brand-title">
        <nav className="topbar" aria-label="品牌导航">
          <a className="brand-mark" href="#top" aria-label="厚切三明治工坊首页"><span>厚</span><strong>厚切工坊</strong></a>
          <a className="about-link" href="#story">我们的坚持 <ChevronRight /></a>
        </nav>
        <div className="hero-copy" id="top">
          <p className="eyebrow"><Sparkles /> 每日新鲜现做</p>
          <h1 id="brand-title">每一口，<br />都看得见<span>真材实料。</span></h1>
          <p className="hero-subtitle">厚切 · 健康 · 热量透明</p>
          <a className="menu-jump" href="#menu">今日菜单 <ArrowDown /></a>
        </div>
        <div className="hero-image-wrap">
          <img src="/images/sandwich-board.png" alt="五款厚切三明治整齐摆放在烘焙纸上" />
          <div className="hero-stamp"><Leaf /><span>轻负担<br />好满足</span></div>
        </div>
      </section>

      <section className="menu-section" id="menu" aria-labelledby="menu-title">
        <div className="section-heading"><div><p className="section-kicker">TODAY'S MENU</p><h2 id="menu-title">今天想吃哪一款？</h2></div><span className="fresh-note"><span />5 款供应中</span></div>
        <div className="category-scroll" role="toolbar" aria-label="菜单分类">
          {categories.map((category) => <button className={activeCategory === category ? 'category active' : 'category'} key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}</button>)}
        </div>
        <div className="menu-list" aria-live="polite">
          {visibleMenu.map((item, index) => (
            <article className="menu-card" key={item.id} style={{ animationDelay: `${index * 70}ms` }}>
              <div className="food-photo">
                <img src="/images/sandwich-board.png" alt={item.name} style={{ objectPosition: item.imagePosition }} />
                <span className="item-number">0{item.id}</span>
                <span className={`calorie-badge ${calorieTone(item.calories)}`}><strong>{item.approximate ? '~' : ''}{item.calories}</strong><small>kcal</small></span>
              </div>
              <div className="card-body">
                <div className="card-title-row">
                  <div><span className="tag-pill">{item.tag}</span><h3>{item.name}</h3><p>{item.weight} · ¥{item.price}</p></div>
                  <button className={cart[item.id] ? 'quick-add added' : 'quick-add'} onClick={() => changeQuantity(item.id, 1)} aria-label={`添加${item.name}到购物袋`}>{cart[item.id] ? <Check /> : <Plus />}</button>
                </div>
                <Accordion className="ingredients-accordion">
                  <AccordionItem value={`item-${item.id}`}>
                    <AccordionTrigger>展开看完整用料与营养</AccordionTrigger>
                    <AccordionContent>
                      <div className="ingredient-list">{item.ingredients.map((ingredient) => <span key={ingredient}><Wheat />{ingredient}</span>)}</div>
                      <div className="nutrition-grid" aria-label="营养信息"><span><small>蛋白质</small><strong>{item.nutrition.protein}g</strong></span><span><small>碳水</small><strong>{item.nutrition.carbs}g</strong></span><span><small>脂肪</small><strong>{item.nutrition.fat}g</strong></span></div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story" id="story">
        <p className="section-kicker">WHY THICK CUT</p><h2>不藏配料，<br />也不藏热量。</h2>
        <p>我们把每一层食材都认真写出来。每天少量手作，用全麦面包、真实蔬果和现做蛋白质，叠成一份吃得饱也吃得明白的厚切三明治。</p>
        <div className="story-points"><span><Leaf />每日鲜作</span><span><Wheat />用料透明</span><span><Sparkles />热量可查</span></div>
      </section>

      <footer><strong>厚切三明治工坊</strong><p>扫码下单 · 新鲜现做</p><p className="contact">微信号：THICKCUT_PLACEHOLDER</p><small>所有热量与营养为预估值，实际可能有 ±10% 浮动</small></footer>

      <Drawer>
        <DrawerTrigger className="cart-bar" aria-label={`打开购物袋，已有${cartCount}件商品`}>
          <span className="bag-icon"><ShoppingBag />{cartCount > 0 && <b>{cartCount}</b>}</span>
          <span><small>{cartCount ? '已经选好' : '选一份今天的厚切'}</small><strong>{cartCount ? `${cartCount} 份 · ¥${total}` : '打开购物袋'}</strong></span><ChevronRight />
        </DrawerTrigger>
        <DrawerContent showSwipeHandle className="cart-drawer">
          <DrawerHeader className="drawer-heading"><DrawerTitle>你的厚切购物袋</DrawerTitle><DrawerDescription>{cartCount ? `共 ${cartCount} 份，新鲜现做` : '还没选好，去菜单加一份吧'}</DrawerDescription><DrawerClose className="drawer-close" aria-label="关闭购物袋"><X /></DrawerClose></DrawerHeader>
          <div className="cart-items">
            {!cartItems.length ? <div className="empty-cart"><ShoppingBag /><p>购物袋还是空的</p><span>从今天的 5 款厚切中挑一份</span></div> : cartItems.map((item) => (
              <div className="cart-item" key={item.id}><img src="/images/sandwich-board.png" alt="" style={{ objectPosition: item.imagePosition }} /><div><strong>{item.shortName}</strong><span>¥{item.price} / 份</span></div><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`减少${item.name}`}><Minus /></button><b>{cart[item.id]}</b><button onClick={() => changeQuantity(item.id, 1)} aria-label={`增加${item.name}`}><Plus /></button></div></div>
            ))}
          </div>
          {cartCount > 0 && <DrawerFooter className="drawer-footer"><label htmlFor="order-note">订单备注</label><textarea id="order-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="如：少酱、不要黄瓜、下午 3 点取…" /><div className="total-row"><span>合计</span><strong>¥{total}</strong></div><button className="submit-order" onClick={() => setSubmitted(true)}>{submitted ? <><Check />已生成订单，请联系微信确认</> : <>提交订单 <ChevronRight /></>}</button></DrawerFooter>}
        </DrawerContent>
      </Drawer>
    </main>
  );
}
