# Half-Pint Store day 24 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 24 of 30. Event: Clearance week.
Cash: bank ₹83730.00 | wallet ₹4566.00 | escrow ₹598.00
Reputation: 0.65
Stock: empty
Stock note: you have no sellable stock; nothing sells until you order and receive goods.
Your prices: drinks-cola=130
Pending shipments: 9 units (oldest day 21)
Yesterday: sold 2 units for ₹260; returns 0; shipped 0 units; fees ₹204; minutes 85/600.
Supplier messages: Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open, 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125.
Books detail: next escrow maturity day 25 for ₹358.8.
Street: The Long Counter drinks-cola=168; Lantern Goods drinks-cola=150; Garden Gate drinks-cola=80; Lucky Ledger drinks-cola=90
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[
{"type":"check_books"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"order","supplier":"a1","sku":"drinks-cola","qty":6,"offerPerUnit":125,"maxPerUnit":6},
{"type":"ship","freight":"standard"}
],"note":"Order and ship cola to restock."}
```

## Meta

```json
{
  "error": null
}
```
