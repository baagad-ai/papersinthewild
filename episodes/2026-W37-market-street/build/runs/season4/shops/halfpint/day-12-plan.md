# Half-Pint Store day 12 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 12 of 30.
Cash: bank ₹87419.00 | wallet ₹1518.00 | escrow ₹478.40
Reputation: 0.74
Stock: drinks-cola 12
Your prices: drinks-cola=130
Pending shipments: 3 units (oldest day 11)
Yesterday: sold 3 units for ₹390; returns 0; shipped 1 units; fees ₹228; minutes 75/600.
Supplier messages: Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open, 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open, 125.
Books detail: next escrow maturity day 13 for ₹119.6.
Street: The Kettle drinks-cola=200; Cold Corner drinks-cola=185; Pocket Mart drinks-cola=220; The Long Counter drinks-cola=168; Lantern Goods drinks-cola=180; Garden Gate drinks-cola=100
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[
{"type":"check_books"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"order","supplier":"a1","sku":"drinks-cola","qty":1,"offerPerUnit":125,"maxPerUnit":1},
{"type":"ship","freight":"standard"}
],"note":"Order remaining cola unit, ship."}
```

## Meta

```json
{
  "error": null
}
```
