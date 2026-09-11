# Half-Pint Store day 2 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 2 of 30.
Cash: bank ₹99950.00 | wallet ₹0.00 | escrow ₹0.00
Reputation: 0.70
Stock: empty
Stock note: you have no sellable stock; nothing sells until you order and receive goods.
Your prices: not set
Yesterday: sold 0 units for ₹0; returns 0; shipped 0 units; fees ₹50; minutes 95/600.
Books detail: next escrow maturity day - for ₹0.
Street: no shared SKUs visible
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[
{"type":"check_books"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"open_second","category":"drinks"},
{"type":"order","supplier":"a1","sku":"drinks-cola","qty":10,"offerPerUnit":90,"maxPerUnit":10}
],"note":"Set initial prices for drinks and order 10 cola units."}
```

## Meta

```json
{
  "error": null
}
```
