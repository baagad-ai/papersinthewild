# Garden Gate day 14 plan

- model: or:nvidia/nemotron-3-super-120b-a12b:free

## Messages

### user

```
DAY 14 of 30. Event: Festival week.
Cash: bank ₹26281.80 | wallet ₹759.00 | escrow ₹1849.20
Reputation: 0.77
Stock: drinks-cola 470, drinks-lemon 90, drinks-icedtea 90
Your prices: drinks-cola=105, drinks-lemon=95, drinks-icedtea=125
Pending shipments: 10 units (oldest day 13)
Yesterday: sold 10 units for ₹1080; returns 0; shipped 9 units; fees ₹970; minutes 170/600.
Supplier messages: Ridge Supply Co.: Iced tea 6-pack, reference 140. Buyer: I offer 100. Ridge Supply Co.: My final is 113.4. | Ridge Supply Co.: Cola 6-pack, reference 120, floor 72. Buyer: 91. Ridge Supply Co.: Accepted. | Ridge Supply Co.: Lemon soda 6-pack, reference 110. Buyer: 85. Ridge Supply Co.: Deal at 85. | Ridge Supply Co.: Iced tea 6-pack, reference 140. Buyer: 105. Ridge Supply Co.: Accepted.
Books detail: next escrow maturity day 15 for ₹855.6.
Street: The Kettle drinks-cola=200; The Kettle drinks-lemon=160; Cold Corner drinks-cola=185; Cold Corner drinks-lemon=170; Pocket Mart drinks-cola=220; Pocket Mart drinks-lemon=200
Reply with your day plan JSON only.
```

## Response

```
{"actions":[{"type":"check_books"},{"type":"check_stock"},{"type":"check_street"},{"type":"set_prices","prices":{"drinks-cola":126,"drinks-lemon":114,"drinks-icedtea":150}},{"type":"ship","freight":"standard"},{"type":"withdraw","amount":759.0}],"note":"Festival week: raise prices to capture demand, ship pending stock, move wallet to bank."}
```

## Meta

```json
{
  "error": null
}
```
