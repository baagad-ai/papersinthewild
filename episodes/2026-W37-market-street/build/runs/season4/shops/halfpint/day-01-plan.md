# Half-Pint Store day 1 plan

- model: local:llama3.2:3b

## Messages

### user

```
DAY 1 of 30.
You have NOT chosen your category yet. Add "category" to your plan: drinks | rain | snacks | acc. You cannot sell before choosing.
Cash: bank ₹100000.00 | wallet ₹0.00 | escrow ₹0.00
Reputation: 0.70
Stock: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[
{"type":"check_books"},
{"type":"check_stock"},
{"type":"check_street"},
{"type":"read_memory"},
{"type":"open_second","category":"drinks"}
],"note":"Choose drinks category to set initial prices and order supplies."}
```

## Meta

```json
{
  "error": null
}
```
