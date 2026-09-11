# The Long Counter day 20 plan

- model: local:mistral:7b

## Messages

### user

```
DAY 20 of 30.
Cash: bank ₹63558.00 | wallet ₹5120.16 | escrow ₹309.12
Reputation: 0.19
Stock: drinks-cola 22, drinks-lemon 113
Your prices: drinks-cola=168, drinks-lemon=230, drinks-icedtea=176, drinks-water=116, drinks-orange=108, drinks-buttermilk=96
Pending shipments: 1 units (oldest day 19)
Yesterday: sold 1 units for ₹168; returns 1; shipped 1 units; fees ₹472; minutes 165/600.
Supplier messages: Supplier: Lemon soda 6-pack, reference 110, floor 74.8. Buyer: I offer 155. Supplier: Accepted. | Supplier: Lemon soda 6-pack, reference 110, floor 74.8. Buyer: I offer 155. Supplier: Deal open at 155. | Supplier: Lemon soda 6-pack, reference 110, floor 74.8. Buyer: I offer 155. Supplier: Deal open, maximum 10. | Supplier: Lemon soda 6-pack, reference 110, floor 74.8. Buyer: I offer 155. Supplier: Deal at 155.
Books detail: next escrow maturity day 21 for ₹154.56.
Street: Cold Corner drinks-cola=280; Cold Corner drinks-lemon=275; Half-Pint Store drinks-cola=130; Lantern Goods drinks-cola=220; Lantern Goods drinks-lemon=200; High Street Traders drinks-lemon=180
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
  {"actions":[
{"type":"check_books"},
{"type":"check_stock"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"order","supplier":"a1","sku":"drinks-lemon","qty":10,"offerPerUnit":155,"maxPerUnit":10},
{"type":"ship","freight":"express"},
{"type":"set_prices","prices":{"drinks-lemon":250}},
{"type":"open_second","category":"rain"}
], "note":"increase lemon price, restock lemons, express ship pending order, open a rain stall"}
```

## Meta

```json
{
  "error": null
}
```
