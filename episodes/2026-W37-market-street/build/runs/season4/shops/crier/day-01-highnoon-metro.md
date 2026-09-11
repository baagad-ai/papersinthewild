# crier day-01-highnoon-metro

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Metro Traders","sku":"Charger 20W","reference":450,"floor":279,"opened":387,"countered":355.5,"buyerOffer":180,"buyerMax":270,"outcome":"call-cap","dealPrice":null,"fee":null}
```

## Response

```
Metro Traders: "Reference 450, Charger 20W, floor is 279."
Buyer: "I offer 180."
Metro Traders: "My maximum is 270."
```

## Meta

```json
{}
```
