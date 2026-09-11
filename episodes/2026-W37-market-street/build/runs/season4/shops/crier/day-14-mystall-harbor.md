# crier day-14-mystall-harbor

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Harbor Imports","sku":"Power bank","reference":900,"floor":585,"opened":810,"countered":765,"buyerOffer":590,"buyerMax":605,"outcome":"aborted","dealPrice":null,"fee":null}
```

## Response

```
Harbor Imports: We’re asking 900.
Buyer: 590 is my offer.
Harbor Imports: We’ll take 765.
```

## Meta

```json
{}
```
