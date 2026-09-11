# Half-Pint Store day 13 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 13 of 30.
Cash: bank ₹87061.00 | wallet ₹1637.60 | escrow ₹717.60
Reputation: 0.75
Stock: drinks-cola 10
Your prices: drinks-cola=130
Pending shipments: 3 units (oldest day 12)
Yesterday: sold 3 units for ₹390; returns 0; shipped 3 units; fees ₹224; minutes 75/600.
Supplier messages: Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open, 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open.
Books detail: next escrow maturity day 14 for ₹358.8.
Street: The Kettle drinks-cola=200; Cold Corner drinks-cola=185; Pocket Mart drinks-cola=220; The Long Counter drinks-cola=168; Lantern Goods drinks-cola=180; Garden Gate drinks-cola=105
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[
{"type":"check_books"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"withdraw","amount":50}
],"note":"Withdraw ₹50 to bank and monitor supplier messages."}
```

## Meta

```json
{
  "error": null
}
```
