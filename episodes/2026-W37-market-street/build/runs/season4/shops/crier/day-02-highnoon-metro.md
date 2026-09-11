# crier day-02-highnoon-metro

- model: local:gemma3:12b

## Messages

### system

```
You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.
```

### user

```
{"supplier":"Metro Traders","sku":"Power bank","reference":900,"floor":558,"opened":774,"countered":711,"buyerOffer":450,"buyerMax":600,"outcome":"call-cap","dealPrice":null,"fee":null}
```

## Response

```
Metro Traders: We have reference 900 Power Banks.
Buyer: I offer 450.
Metro Traders: My floor is 558.
```

## Meta

```json
{}
```
