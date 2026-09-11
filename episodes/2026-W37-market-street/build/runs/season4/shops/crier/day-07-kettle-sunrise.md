# crier day-07-kettle-sunrise

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Sunrise Wholesale","sku":"Buttermilk 6-pack","reference":80,"floor":44,"opened":68,"buyerOffer":110,"buyerMax":130,"outcome":"deal-open","dealPrice":110,"fee":null}
```

## Response

```
Sunrise Wholesale: Buttermilk 6-pack, reference 80.
Buyer: I offer 110.
Sunrise Wholesale: Accepted.
```

## Meta

```json
{}
```
