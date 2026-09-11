# Garden Gate day 1 plan

- model: or:nvidia/nemotron-3-super-120b-a12b:free

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
{"category":"drinks","actions":[{"type":"check_books"},{"type":"check_street"},{"type":"read_memory"},{"type":"order","supplier":"ridge","sku":"drinks-cola","qty":100,"offerPerUnit":90,"maxPerUnit":120},{"type":"ship","freight":"standard"},{"type":"check_stock"},{"type":"set_prices","prices":{"drinks-cola":130}}],"note":"Chose drinks, ordered test cola, set price slightly above reference."}
```

## Meta

```json
{
  "error": null
}
```
