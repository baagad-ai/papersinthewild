# crier day-14-highnoon-metro

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Metro Traders","sku":"Power bank","reference":900,"floor":558,"opened":711,"buyerOffer":711,"buyerMax":711,"outcome":"deal-open","dealPrice":711,"fee":null}
```

## Response

```
Metro Traders: Power bank, reference 900.
Buyer: I offer 711.
Metro Traders: Deal at 711.
```

## Meta

```json
{}
```
