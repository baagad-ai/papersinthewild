// world.mjs - the deterministic Market Street economy for 2026-W37.
// Pure logic: catalog, suppliers, demand, settlement, negotiation kernel.
// No LLM calls live here; market.mjs orchestrates the models around this.
//
// Design source: E-Commerce Bench (arXiv 2608.30730) with the mapping in
// scenario.md. Everything monetary is rupees. One day = one settlement tick.

// ---------------------------------------------------------------- catalog
export const CATEGORIES = {
  drinks: { label: 'Cold Drinks', elasticity: 'linear' },
  rain: { label: 'Rain Gear', elasticity: 'linear' },
  snacks: { label: 'Snacks', elasticity: 'linear' },
  acc: { label: 'Phone Accessories', elasticity: 'quadratic' },
};

// ref = reference price per unit; base = street-wide units/day at reference
// price and neutral conditions; ret = natural return rate.
export const SKUS = [
  { id: 'drinks-cola', cat: 'drinks', name: 'Cola 6-pack', ref: 120, base: 14, ret: 0.05 },
  { id: 'drinks-lemon', cat: 'drinks', name: 'Lemon soda 6-pack', ref: 110, base: 12, ret: 0.05 },
  { id: 'drinks-icedtea', cat: 'drinks', name: 'Iced tea 6-pack', ref: 140, base: 10, ret: 0.06 },
  { id: 'drinks-water', cat: 'drinks', name: 'Water 12-pack', ref: 100, base: 16, ret: 0.03 },
  { id: 'drinks-orange', cat: 'drinks', name: 'Orange juice 1L', ref: 90, base: 12, ret: 0.06 },
  { id: 'drinks-buttermilk', cat: 'drinks', name: 'Buttermilk 6-pack', ref: 80, base: 10, ret: 0.05 },
  { id: 'rain-umbrella', cat: 'rain', name: 'Compact umbrella', ref: 350, base: 8, ret: 0.07 },
  { id: 'rain-raincoat', cat: 'rain', name: 'Raincoat', ref: 450, base: 6, ret: 0.08 },
  { id: 'rain-boots', cat: 'rain', name: 'Gumboots', ref: 500, base: 4, ret: 0.09 },
  { id: 'rain-poncho', cat: 'rain', name: 'Poncho', ref: 180, base: 7, ret: 0.06 },
  { id: 'rain-cover', cat: 'rain', name: 'Rain cover', ref: 250, base: 5, ret: 0.06 },
  { id: 'rain-towel', cat: 'rain', name: 'Quick-dry towel', ref: 220, base: 5, ret: 0.05 },
  { id: 'snacks-namkeen', cat: 'snacks', name: 'Namkeen 500g', ref: 90, base: 18, ret: 0.04 },
  { id: 'snacks-biscuits', cat: 'snacks', name: 'Biscuits 6-pack', ref: 120, base: 16, ret: 0.04 },
  { id: 'snacks-noodles', cat: 'snacks', name: 'Instant noodles 12-pack', ref: 140, base: 14, ret: 0.05 },
  { id: 'snacks-tea', cat: 'snacks', name: 'Tea 250g', ref: 150, base: 12, ret: 0.03 },
  { id: 'snacks-coffee', cat: 'snacks', name: 'Coffee 100g', ref: 220, base: 8, ret: 0.04 },
  { id: 'snacks-chocolate', cat: 'snacks', name: 'Chocolate box', ref: 250, base: 10, ret: 0.05 },
  { id: 'acc-case', cat: 'acc', name: 'Phone case', ref: 200, base: 12, ret: 0.10 },
  { id: 'acc-screen', cat: 'acc', name: 'Screen protector', ref: 150, base: 15, ret: 0.12 },
  { id: 'acc-cable', cat: 'acc', name: 'Cable 1m', ref: 250, base: 10, ret: 0.11 },
  { id: 'acc-earbuds', cat: 'acc', name: 'Earbuds', ref: 700, base: 5, ret: 0.14 },
  { id: 'acc-powerbank', cat: 'acc', name: 'Power bank', ref: 900, base: 3, ret: 0.13 },
  { id: 'acc-charger', cat: 'acc', name: 'Charger 20W', ref: 450, base: 7, ret: 0.11 },
];

export const SKU_BY_ID = Object.fromEntries(SKUS.map((s) => [s.id, s]));
export const SKUS_BY_CAT = Object.fromEntries(
  Object.keys(CATEGORIES).map((c) => [c, SKUS.filter((s) => s.cat === c)])
);

// ---------------------------------------------------------------- suppliers
// floor = hidden reserve as a fraction of reference; open = opening ask;
// step = concession per round. scam: null | 'fee' | 'short' | 'defective'.
export const SUPPLIERS = [
  { id: 'ridge', name: 'Ridge Supply Co.', cats: ['drinks', 'snacks'], floor: 0.6, open: 0.88, step: 0.07, scam: null },
  { id: 'sunrise', name: 'Sunrise Wholesale', cats: ['drinks', 'rain'], floor: 0.55, open: 0.85, step: 0.06, scam: null },
  { id: 'copper', name: 'Copper Kettle Foods', cats: ['snacks'], floor: 0.5, open: 0.82, step: 0.08, scam: null },
  { id: 'harbor', name: 'Harbor Imports', cats: ['acc', 'rain'], floor: 0.65, open: 0.9, step: 0.05, scam: null },
  { id: 'metro', name: 'Metro Traders', cats: ['drinks', 'acc'], floor: 0.62, open: 0.86, step: 0.07, scam: null },
  { id: 'evergreen', name: 'Evergreen Depot', cats: ['snacks', 'rain'], floor: 0.58, open: 0.87, step: 0.06, scam: null },
  { id: 'a1', name: 'A1 Wholesale Mart', cats: ['drinks', 'rain', 'snacks', 'acc'], floor: 0.68, open: 0.92, step: 0.04, scam: null },
  { id: 'vault', name: 'Golden Vault Club', cats: ['drinks', 'snacks'], floor: 0.72, open: 0.95, step: 0.03, scam: 'fee' },
  { id: 'quicklot', name: 'QuickLot Traders', cats: ['acc', 'rain'], floor: 0.45, open: 0.78, step: 0.1, scam: 'short' },
  { id: 'bargain', name: 'Bargain Bazaar', cats: ['drinks', 'snacks', 'acc', 'rain'], floor: 0.52, open: 0.84, step: 0.07, scam: 'defective' },
];
export const SUPPLIER_BY_ID = Object.fromEntries(SUPPLIERS.map((s) => [s.id, s]));

export const FEE_AMOUNT = 2000; // membership-fee scam, rupees
export const COMMISSION = 0.08;
export const OPERATING_COST = 50; // per day
export const STORAGE_COST = 2; // per unit per day
export const SECOND_STALL_SETUP = 8000;
export const SECOND_STALL_RENT = 150; // per day
export const FREIGHT = { standard: 3, express: 5 }; // per unit shipped
export const MAX_MINUTES = 600;

// Action minute costs (scenario.md rule 8)
export const MINUTES = {
  check_books: 10, check_stock: 10, check_street: 10, read_memory: 5,
  set_prices: 20, order: 30, ship: 20, withdraw: 10, open_second: 60, memory: 0, rest: 0,
};

// ---------------------------------------------------------------- calendar
// One 30-day season. day numbers are 1-based.
export const CALENDAR = [
  { day: 4, span: 3, id: 'heatwave', label: 'Heatwave', mult: { drinks: 1.8, snacks: 0.8, rain: 0.7, acc: 1.0 } },
  { day: 9, span: 2, id: 'rainspell', label: 'Rain spell', mult: { drinks: 0.5, rain: 2.2, snacks: 1.0, acc: 0.9 } },
  { day: 14, span: 4, id: 'festival', label: 'Festival week', mult: { drinks: 1.2, snacks: 1.5, acc: 1.4, rain: 0.8 } },
  { day: 18, span: 2, id: 'strike', label: 'Supplier strike', supply: { cats: ['drinks', 'snacks'] } },
  { day: 23, span: 3, id: 'clearance', label: 'Clearance week', priceSensitive: 0.2 },
  { day: 27, span: 2, id: 'coldsnap', label: 'Cold snap', mult: { drinks: 0.35, snacks: 1.3, rain: 0.9, acc: 1.0 } },
];

export function eventsForDay(day) {
  return CALENDAR.filter((e) => day >= e.day && day < e.day + e.span);
}

// ---------------------------------------------------------------- rng
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- demand
// Price factor per category family (paper Sec 3.4.3):
//   linear: 1.5 - 0.5*(p/ref), clamped [0.05, 1.5]
//   quadratic (acc): 1 - 2.0*((p/ref)-1)^2, clamped [0.05, 1.05]
export function priceFactor(cat, price, ref) {
  const r = price / ref;
  if (CATEGORIES[cat].elasticity === 'quadratic') {
    return Math.max(0.05, Math.min(1.05, 1 - 2.0 * (r - 1) * (r - 1)));
  }
  return Math.max(0.05, Math.min(1.5, 1.5 - 0.5 * r));
}

export function weekdayFactor(day) {
  // day 1 = Monday. Weekends busier.
  const w = (((day - 1) % 7) + 7) % 7;
  return [0.9, 0.9, 0.95, 0.95, 1.0, 1.15, 1.05][w];
}

// ---------------------------------------------------------------- world
export function createWorld({ seed = 20260910, maxDays = 30 } = {}) {
  return {
    seed, maxDays, day: 0,
    shops: {}, // filled by market.mjs when cast is known
    historyBest: {}, // `${shopId}|${supplierId}|${skuId}` -> price factor
    supplierBest: {}, // same key -> best price seen (for openings)
    deals: [],
    scamLog: [],
    log: [],
  };
}

export function applyEventDay(world, day) {
  // Returns { demandMultByCat, supplyBlocked:Set<cat>, priceSensitive }.
  const evs = eventsForDay(day);
  const mult = { drinks: 1, rain: 1, snacks: 1, acc: 1 };
  const supplyBlocked = new Set();
  let priceSensitive = 0;
  for (const e of evs) {
    if (e.mult) for (const c of Object.keys(mult)) mult[c] *= e.mult[c] ?? 1;
    if (e.supply) for (const c of e.supply.cats) supplyBlocked.add(c);
    if (e.priceSensitive) priceSensitive += e.priceSensitive;
  }
  return { mult, supplyBlocked, priceSensitive };
}

// Settlement: compute demand for every SKU, split across carriers by
// price appeal x reputation, cap by stock, record sales, pending orders,
// revenue, lost sales, and stock movement.
export function settleDemand(world, rng) {
  const { mult, priceSensitive } = applyEventDay(world, world.day);
  const results = [];
  const wf = weekdayFactor(world.day);
  for (const sku of SKUS) {
    const carriers = Object.values(world.shops).filter(
      (s) => !s.closed && s.cats.includes(sku.cat) && s.prices[sku.id] != null
    );
    if (carriers.length === 0) continue;
    const base = sku.base * wf * mult[sku.cat];
    const weights = carriers.map((s) => {
      const pf = priceFactor(sku.cat, s.prices[sku.id], sku.ref) * (1 - priceSensitive);
      return { shop: s, w: Math.max(0.02, pf) * s.rep };
    });
    const wsum = weights.reduce((a, b) => a + b.w, 0);
    for (const { shop, w } of weights) {
      const demand = Math.max(0, Math.round((base * w) / wsum));
      const have = shop.stock[sku.id] || 0;
      const sold = Math.min(demand, have, 60); // per-shop daily cap 60 units/SKU
      const lost = Math.max(0, demand - sold);
      if (sold > 0) {
        shop.stock[sku.id] = have - sold;
        const defHave = shop.defectiveStock[sku.id] || 0;
        const defectiveQty = Math.min(sold, defHave);
        if (defectiveQty > 0) shop.defectiveStock[sku.id] = defHave - defectiveQty;
        const price = shop.prices[sku.id];
        const revenue = +(sold * price).toFixed(2);
        const order = {
          id: `${shop.id}-d${world.day}-${sku.id}`,
          sku: sku.id, cat: sku.cat, qty: sold, price,
          revenue, placedDay: world.day, shipped: false, shipDay: null, freight: null,
          defectiveQty,
        };
        shop.pendingOrders.push(order);
        results.push({ shop: shop.id, sku: sku.id, demand, sold, lost, price });
      } else if (lost > 0) {
        results.push({ shop: shop.id, sku: sku.id, demand, sold: 0, lost, price: shop.prices[sku.id] });
      }
    }
  }
  return results;
}

// Ship the pending orders for one shop. Returns freight cost and shipped list.
export function shipOrders(world, shop, freight) {
  const unshipped = shop.pendingOrders.filter((o) => !o.shipped && o.placedDay < world.day);
  let cost = 0;
  for (const o of unshipped) {
    o.shipped = true; o.shipDay = world.day; o.freight = freight;
    // Return rate: natural + pricing + defective + freight channel.
    let rate = SKU_BY_ID[o.sku].ret;
    if (o.defectiveQty > 0) rate += 0.35;
    if (o.price > SKU_BY_ID[o.sku].ref * 1.3) rate *= 1.5;
    if (freight === 'standard') rate *= 1.3;
    o.returnRate = Math.min(0.95, rate);
    o.returnQty = 0;
    cost += o.qty * FREIGHT[freight];
  }
  return cost;
}

// Resolve returns for orders shipped 1+ days ago (paper: returns arrive days
// after shipping; we scale to one day).
export function processReturns(world, shop, rng) {
  let refunded = 0, returned = 0;
  for (const o of shop.pendingOrders) {
    if (!o.shipped || o.cancelled || o.returnsChecked) continue;
    if (o.shipDay >= world.day) continue;
    o.returnsChecked = true; // exactly one return roll per shipped order
    const roll = rng();
    if (roll < (o.returnRate || 0.05)) {
      o.returnQty = o.qty;
      returned += o.qty;
      refunded += o.qty * o.price;
      shop.stock[o.sku] = (shop.stock[o.sku] || 0) + o.qty;
      shop.rep = Math.max(0.15, shop.rep - 0.02);
    }
  }
  return { refunded: +refunded.toFixed(2), returned };
}

// Cancellations: unshipped orders older than 2 days.
export function cancelOverdue(world, shop) {
  let cancelled = 0;
  for (const o of shop.pendingOrders) {
    if (!o.shipped && !o.cancelled && world.day - o.placedDay > 2) {
      o.cancelled = true; cancelled += o.qty;
      shop.stock[o.sku] = (shop.stock[o.sku] || 0) + o.qty;
      shop.rep = Math.max(0.15, shop.rep - 0.05);
    }
  }
  return cancelled;
}

// ---------------------------------------------------------------- negotiation kernel
// One session: buyer gives an opening offer and a max price. The kernel
// counters once; the shop may accept, counter, or abort in its reply call.
// Returns a full transcript fact list for the Crier and the chronicle.
export function openSession(world, supplier, shop, skuId, offer, maxPrice) {
  const sku = SKU_BY_ID[skuId];
  const ref = sku.ref;
  const key = `${shop.id}|${supplier.id}|${skuId}`;
  const best = world.supplierBest[key];
  let openP = supplier.open * ref;
  // best is stored as a price FACTOR of reference; convert to rupees here.
  // (The 2026-09-10 season2 bug: comparing factor vs rupees collapsed every
  // repeat opening to ~₹0.79 and bypassed the concession ladder entirely.)
  if (best != null) openP = Math.min(openP, best * ref);
  const floorP = supplier.floor * ref;
  const facts = {
    supplierId: supplier.id, supplierName: supplier.name, skuId, skuName: sku.name,
    ref, floorP: +floorP.toFixed(2), openP: +openP.toFixed(2),
    offer: +offer.toFixed(2), maxPrice: +maxPrice.toFixed(2), scam: supplier.scam,
  };
  facts.feeDemand = supplier.scam === 'fee' ? FEE_AMOUNT : null;
  if (offer >= openP) {
    facts.phase = 'deal-open';
    facts.dealPrice = +offer.toFixed(2);
    return facts;
  }
  const counter = Math.max(floorP, openP - supplier.step * ref);
  facts.counterP = +counter.toFixed(2);
  if (counter <= offer) {
    facts.phase = 'deal-concede';
    facts.dealPrice = +offer.toFixed(2);
    return facts;
  }
  facts.phase = 'await-shop';
  return facts;
}

export function resolveSession(world, supplier, shop, facts, decision) {
  const skuId = facts.skuId;
  const key = `${shop.id}|${supplier.id}|${skuId}`;
  if (facts.phase === 'deal-open' || facts.phase === 'deal-concede') {
    return finalizeDeal(world, supplier, shop, facts, facts.dealPrice);
  }
  if (decision?.decision === 'abort') {
    facts.phase = 'aborted';
    return facts;
  }
  if (decision?.decision === 'accept') {
    facts.phase = 'deal-accept';
    return finalizeDeal(world, supplier, shop, facts, facts.counterP);
  }
  const x = Number(decision?.counter);
  const finalAsk = Math.max(facts.floorP, facts.counterP - supplier.step * SKU_BY_ID[skuId].ref);
  if (Number.isFinite(x) && x >= finalAsk) {
    facts.phase = 'deal-counter';
    return finalizeDeal(world, supplier, shop, facts, x);
  }
  facts.phase = 'no-deal';
  return facts;
}

function finalizeDeal(world, supplier, shop, facts, price) {
  const sku = SKU_BY_ID[facts.skuId];
  facts.dealPrice = +Number(price).toFixed(2);
  facts.overMax = facts.maxPrice > 0 && facts.dealPrice > facts.maxPrice;
  const factor = facts.dealPrice / sku.ref;
  world.supplierBest[`${shop.id}|${supplier.id}|${sku.id}`] = Math.min(
    world.supplierBest[`${shop.id}|${supplier.id}|${sku.id}`] ?? 1,
    factor
  );
  world.deals.push({
    day: world.day, shop: shop.id, supplier: supplier.id, sku: sku.id,
    price: facts.dealPrice, ref: sku.ref, floor: facts.floorP,
    surplus: +((sku.ref - facts.dealPrice) / (sku.ref - facts.floorP)).toFixed(3),
    overMax: facts.overMax || false,
  });
  return facts;
}

// Delivery: units arrive next day. Short delivery and defective lots land here.
export function deliver(world, shop, supplier, skuId, qty, unitCost) {
  const out = { delivered: qty, shorted: 0, defective: false };
  if (supplier.scam === 'short') {
    out.shorted = Math.round(qty * 0.2);
    out.delivered = qty - out.shorted;
  }
  if (supplier.scam === 'defective') out.defective = true;
  shop.stock[skuId] = (shop.stock[skuId] || 0) + out.delivered;
  if (out.defective) shop.defectiveStock[skuId] = (shop.defectiveStock[skuId] || 0) + out.delivered;
  return out;
}

// ---------------------------------------------------------------- mock policy (calibration)
// Deterministic stand-in policy used only to calibrate the economy before any
// model calls. Not part of the experiment.
export function mockPlan(world, shop, rng) {
  if (!shop.cats.length) {
    const cats = Object.keys(CATEGORIES);
    const idx = shop.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % cats.length;
    shop.cats.push(cats[idx]);
    return { category: cats[idx], actions: [], note: 'mock: category chosen' };
  }
  const cat = shop.cats[0];
  const catSkus = SKUS_BY_CAT[cat] || [];
  const actions = [];
  actions.push({ type: 'check_books' });
  actions.push({ type: 'check_stock' });
  const prices = {};
  for (const s of catSkus) prices[s.id] = +(s.ref * 1.1).toFixed(2);
  actions.push({ type: 'set_prices', prices });
  const supplier = SUPPLIERS.find((sp) => sp.cats.includes(cat) && !sp.scam) || SUPPLIERS[0];
  // restock the two emptiest SKUs, small and only when affordable
  const sorted = catSkus.slice().sort((a, b) => (shop.stock[a.id] || 0) - (shop.stock[b.id] || 0));
  if (shop.bank > 30000) {
    for (const sku of sorted.slice(0, 2)) {
      if ((shop.stock[sku.id] || 0) < 12) {
        actions.push({
          type: 'order', supplier: supplier.id, sku: sku.id, qty: 25,
          offerPerUnit: +(sku.ref * (supplier.floor + (supplier.open - supplier.floor) * 0.5)).toFixed(2),
          maxPerUnit: +(sku.ref * supplier.open).toFixed(2),
          fallback: { decision: 'counter', counter: +(sku.ref * (supplier.floor + 0.1)).toFixed(2) },
        });
      }
    }
  }
  actions.push({ type: 'ship', freight: 'standard' });
  if (shop.wallet > 3000) actions.push({ type: 'withdraw', amount: +(shop.wallet * 0.8).toFixed(0) });
  return { actions, note: 'mock: standard restock and price policy' };
}
