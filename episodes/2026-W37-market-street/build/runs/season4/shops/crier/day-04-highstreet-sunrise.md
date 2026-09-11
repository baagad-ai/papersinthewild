# crier day-04-highstreet-sunrise

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Sunrise Wholesale","sku":"Lemon soda 6-pack","reference":110,"floor":60.5,"opened":93.5,"countered":86.9,"buyerOffer":85,"buyerMax":100,"outcome":"aborted","dealPrice":null,"fee":null}
```

## Response

```
Sunrise Wholesale: Lemon soda 6-pack, reference 110, floor 60.5.
Buyer: I offer 85.
Sunrise Wholesale: Countered at 86.9.
```

## Meta

```json
{}
```
