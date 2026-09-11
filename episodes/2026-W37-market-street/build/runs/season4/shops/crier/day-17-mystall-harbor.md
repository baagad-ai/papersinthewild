# crier day-17-mystall-harbor

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Harbor Imports","sku":"Power bank","reference":900,"floor":585,"opened":765,"buyerOffer":765,"buyerMax":765,"outcome":"deal-open","dealPrice":765,"fee":null}
```

## Response

```
Harbor Imports: Power bank, reference 900. 
Buyer: I offer 765.
Harbor Imports: Deal open at 765.
```

## Meta

```json
{}
```
