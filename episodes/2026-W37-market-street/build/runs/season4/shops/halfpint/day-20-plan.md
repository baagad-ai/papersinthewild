# Half-Pint Store day 20 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 20 of 30.
Cash: bank ₹85298.00 | wallet ₹3810.00 | escrow ₹717.60
Reputation: 0.66
Stock: empty
Stock note: you have no sellable stock; nothing sells until you order and receive goods.
Your prices: drinks-cola=130
Pending shipments: 6 units (oldest day 18)
Yesterday: sold 3 units for ₹390; returns 0; shipped 0 units; fees ₹206; minutes 85/600.
Supplier messages: Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open, 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal at 125.
Books detail: next escrow maturity day 21 for ₹358.8.
Street: Cold Corner drinks-cola=280; The Long Counter drinks-cola=168; Lantern Goods drinks-cola=220; Garden Gate drinks-cola=100; Lucky Ledger drinks-cola=125
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
