# Half-Pint Store day 15 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 15 of 30. Event: Festival week.
Cash: bank ₹86677.00 | wallet ₹2305.20 | escrow ₹837.20
Reputation: 0.75
Stock: drinks-cola 3
Your prices: drinks-cola=130
Pending shipments: 10 units (oldest day 12)
Yesterday: sold 4 units for ₹520; returns 0; shipped 0 units; fees ₹214; minutes 85/600.
Supplier messages: Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open, 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open.
Books detail: next escrow maturity day 16 for ₹358.8.
Street: The Kettle drinks-cola=230; Cold Corner drinks-cola=260; Pocket Mart drinks-cola=220; The Long Counter drinks-cola=168; Lantern Goods drinks-cola=200; Garden Gate drinks-cola=130
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[
{"type":"check_books"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"order","supplier":"a1","sku":"drinks-cola","qty":3,"offerPerUnit":125,"maxPerUnit":3},
{"type":"ship","freight":"standard"}
],"note":"Order remaining cola units, ship."}
```

## Meta

```json
{
  "error": null
}
```
