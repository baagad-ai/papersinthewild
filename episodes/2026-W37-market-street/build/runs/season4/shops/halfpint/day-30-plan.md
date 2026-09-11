# Half-Pint Store day 30 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 30 of 30.
Cash: bank ₹81067.00 | wallet ₹5570.40 | escrow ₹598.00
Reputation: 0.65
Stock: drinks-cola 2
Your prices: drinks-cola=130
Pending shipments: 6 units (oldest day 27)
Yesterday: sold 4 units for ₹520; returns 0; shipped 0 units; fees ₹212; minutes 35/600.
Supplier messages: Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal open at 125. | Supplier: Cola 6-pack, reference 120, floor 81.6. Buyer: I offer 125. Supplier: Deal for 6 at 125.
Books detail: next escrow maturity day 31 for ₹119.6.
Street: The Long Counter drinks-cola=170; Lantern Goods drinks-cola=100; Garden Gate drinks-cola=100
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[
{"type":"check_books"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"withdraw","amount":800}
],"note":"Withdraw entire balance to bank and close season."}
```

## Meta

```json
{
  "error": null
}
```
