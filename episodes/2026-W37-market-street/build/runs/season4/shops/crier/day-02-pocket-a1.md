# crier day-02-pocket-a1

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"A1 Wholesale Mart","sku":"Water 12-pack","reference":100,"floor":68,"opened":92,"buyerOffer":120,"buyerMax":300,"outcome":"deal-open","dealPrice":120,"fee":null}
```

## Response

```
Supplier: Water 12-pack, reference 100, floor 68.
Buyer: I offer 120.
Supplier: Deal open at 120.
```

## Meta

```json
{}
```
