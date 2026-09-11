# crier day-02-pocket-ridge

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Ridge Supply Co.","sku":"Cola 6-pack","reference":120,"floor":72,"opened":105.6,"buyerOffer":144,"buyerMax":250,"outcome":"deal-open","dealPrice":144,"fee":null}
```

## Response

```
Ridge Supply Co.: Cola 6-pack, reference 120, floor 72.
Buyer: I offer 144.
Ridge Supply Co.: Accepted.
```

## Meta

```json
{}
```
