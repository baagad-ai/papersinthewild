# crier day-04-longcounter-a1

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"A1 Wholesale Mart","sku":"Cola 6-pack","reference":120,"floor":81.6,"opened":110.4,"buyerOffer":160,"buyerMax":30,"outcome":"deal-open","dealPrice":160,"fee":null}
```

## Response

```
Supplier: We have Cola 6-pack, reference 120, floor 81.6, opened at 110.4.
Buyer: I offer 160.
Supplier: Deal at 160.
```

## Meta

```json
{}
```
