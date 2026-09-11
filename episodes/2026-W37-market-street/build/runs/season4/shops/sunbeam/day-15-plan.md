# Sunbeam Sundries day 15 plan

- model: local:gemma3:12b

## Messages

### user

```
DAY 15 of 30. Event: Festival week.
You have NOT chosen your category yet. Add "category" to your plan: drinks | rain | snacks | acc. You cannot sell before choosing.
Cash: bank ₹99300.00 | wallet ₹0.00 | escrow ₹0.00
Reputation: 0.70
Stock: empty
Yesterday: sold 0 units for ₹0; returns 0; shipped 0 units; fees ₹50; minutes 10/600.
Reply with your day plan JSON only.
```

## Response

```
```json
{"actions": [{"type": "check_street", "minutes": 10}, {"type": "order", "supplier": "ridge", "sku": "snacks-namkeen", "qty": 50, "offerPerUnit": 70, "maxPerUnit": 90}, {"type": "order", "supplier": "copper", "sku": "snacks-biscuits", "qty": 40, "offerPerUnit": 95, "maxPerUnit": 120}], "note": "Placing initial snack orders to prepare for festival week sales."}
```
```

## Meta

```json
{
  "error": null
}
```
