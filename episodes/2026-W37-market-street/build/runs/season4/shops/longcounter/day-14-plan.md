# The Long Counter day 14 plan

- model: local:mistral:7b

## Messages

### user

```
DAY 14 of 30. Event: Festival week.
Cash: bank ₹74074.00 | wallet ₹3499.68 | escrow ₹552.00
Reputation: 0.15
Stock: drinks-cola 27, drinks-lemon 67
Your prices: drinks-cola=168, drinks-lemon=132, drinks-icedtea=176, drinks-water=116, drinks-orange=108, drinks-buttermilk=96
Pending shipments: 6 units (oldest day 11)
Yesterday: sold 2 units for ₹300; returns 0; shipped 0 units; fees ₹372; minutes 125/600.
Supplier messages: Supplier: Lemon soda 6-pack, reference 110, floor 74.8. Buyer: I offer 155. Supplier: Deal open, 155. | Supplier: Lemon soda 6-pack, reference 110, floor 74.8. Buyer: I offer 155. Supplier: Deal open, 155. | Supplier: Lemon soda 6-pack, reference 110, floor 74.8. Buyer: I offer 155. Supplier: Deal open, 155. | Supplier: Lemon soda 6-pack, reference 110, floor 74.8. Buyer: I offer 155. Supplier: Deal open, 155.
Books detail: next escrow maturity day 15 for ₹276.
Street: The Kettle drinks-cola=220; The Kettle drinks-lemon=170; Cold Corner drinks-cola=260; Cold Corner drinks-lemon=240; Pocket Mart drinks-cola=220; Pocket Mart drinks-lemon=200
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
{"type":"order","supplier":"a1","sku":"drinks-lemon","qty":20,"offerPerUnit":155,"maxPerUnit":20},
{"type":"ship","freight":"standard"},
{"type":"open_second","category":"drinks"}
], "note":"Raise prices for lemons and check competition for rain gear during festival week"}
```

## Meta

```json
{
  "error": null
}
```
