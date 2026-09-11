# crier day-13-highstreet-sunrise

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Sunrise Wholesale","sku":"Lemon soda 6-pack","reference":110,"floor":60.5,"opened":87,"buyerOffer":87,"buyerMax":90,"outcome":"deal-open","dealPrice":87,"fee":null}
```

## Response

```
Sunrise Wholesale: Lemon soda 6-pack, reference 110, floor 60.5.
Buyer: 87.
Sunrise Wholesale: Deal at 87.
```

## Meta

```json
{}
```
