# Half-Pint Store day 7 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 7 of 30.
Cash: bank ₹96916.00 | wallet ₹0.00 | escrow ₹920.00
Reputation: 0.71
Stock: drinks-cola 16
Your prices: drinks-cola=125
Pending shipments: 4 units (oldest day 6)
Yesterday: sold 4 units for ₹500; returns 0; shipped 4 units; fees ₹82; minutes 85/600.
Supplier messages: Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 90. Supplier: 105.6. | A1 Wholesale Mart: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 110. A1 Wholesale Mart: Accepted, 20 units at 110. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open, 125.
Books detail: next escrow maturity day 8 for ₹460.
Street: The Kettle drinks-cola=180; Cold Corner drinks-cola=250; Pocket Mart drinks-cola=220; The Long Counter drinks-cola=168; Lantern Goods drinks-cola=170; Garden Gate drinks-cola=126
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[
{"type":"check_books"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"set_prices","prices":{"drinks-cola":130}},
{"type":"withdraw","amount":50}
],"note":"Adjust price to new offer, withdraw ₹50 to bank."}
```

## Meta

```json
{
  "error": null
}
```
