# crier day-05-pocket-metro

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Metro Traders","sku":"Lemon soda 6-pack","reference":110,"floor":68.2,"opened":94.6,"buyerOffer":200,"buyerMax":300,"outcome":"deal-open","dealPrice":200,"fee":null}
```

## Response

```
Metro Traders: Lemon soda 6-pack, reference 110, floor 68.2, opened 94.6.
Buyer: I offer 200.
Metro Traders: Accepted.
```

## Meta

```json
{}
```
