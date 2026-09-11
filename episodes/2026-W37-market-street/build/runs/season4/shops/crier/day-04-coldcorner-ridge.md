# crier day-04-coldcorner-ridge

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Ridge Supply Co.","sku":"Cola 6-pack","reference":120,"floor":72,"opened":96,"buyerOffer":100,"buyerMax":110,"outcome":"deal-open","dealPrice":100,"fee":null}
```

## Response

```
Ridge Supply Co.: Cola 6-pack, reference 120, floor 72.
Buyer: I offer 100.
Ridge Supply Co.: Accepted.
```

## Meta

```json
{}
```
