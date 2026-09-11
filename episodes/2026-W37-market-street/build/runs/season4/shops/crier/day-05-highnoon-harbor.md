# crier day-05-highnoon-harbor

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Harbor Imports","sku":"Earbuds","reference":700,"floor":455,"opened":595,"buyerOffer":595,"buyerMax":595,"outcome":"deal-open","dealPrice":595,"fee":null}
```

## Response

```
Harbor Imports: Earbuds, reference 700.
Buyer: I offer 595.
Harbor Imports: Accepted.
```

## Meta

```json
{}
```
