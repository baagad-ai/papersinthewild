# Garden Gate day 2 plan

- model: or:nvidia/nemotron-3-super-120b-a12b:free

## Messages

### user

```
DAY 2 of 30.
Cash: bank ₹90230.00 | wallet ₹0.00 | escrow ₹0.00
Reputation: 0.70
Stock: drinks-cola 100
Your prices: drinks-cola=130
Yesterday: sold 0 units for ₹0; returns 0; shipped 0 units; fees ₹50; minutes 105/600.
Supplier messages: Ridge Supply Co.: Cola 6-pack, reference 120, floor 72. Buyer: I offer 90. Ridge Supply Co.: Countered at 97.2.
Books detail: next escrow maturity day - for ₹0.
Street: Lantern Goods drinks-cola=120
Notebook: empty
Reply with your day plan JSON only.
```

## Response

```
{"actions":[{"type":"check_books"},{"type":"check_stock"},{"type":"check_street"},{"type":"set_prices":{"prices":{"drinks-cola":115}}},{"type":"order","supplier":"ridge","sku":"drinks-cola","qty":100,"offerPerUnit":95,"maxPerUnit":110},{"type":"ship","freight":"standard"},{"type":"check_stock"}],"note":"Set competitive price, order more cola to keep stock."}
```

## Meta

```json
{
  "error": null
}
```
