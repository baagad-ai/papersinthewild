# Pocket Mart day 1 plan

- model: local:phi4-mini:latest

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
```json
{
  "actions": [
    {"type": "open_second", "category": "drinks"},
    {"type": "set_prices", "prices": {}},
    {"type": "check_street"},
    {"type": "check_books"},
    {"type": "check_stock"},
    {"type": "memory", "op": "add", "index": 0, "title": "Initial Stock", "content": "empty"}
  ],
  "note": "Open drinks stall, set prices, check competitors, inventory, and add initial stock to memory."
}
```
```

## Meta

```json
{
  "error": null
}
```
