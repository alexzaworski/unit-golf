helps shorten pixel units for cssbattle.dev

# usage

`node unit-golf [pixels] [allowedPixelOffset] [resultPrecision]`

```
node unit-golf 325

Best: 86mm, offset by: -0.08 pixels

Rest:
344q (offset: -0.08)
325px (offset: 0)
8.6cm (offset: -0.08)
245pt (offset: 0.39)
45.3ex (offset: -0.11)
20.3em (offset: -0.2)
81.3vw (offset: 0.2)
3.39in (offset: 0.44)
108.3vh (offset: -0.1)
```

you can adjust the allowed pixel offset (default 0.5) and the precision of results (default 2)

```
node unit-golf 325 0 3

Best: 325px, offset by: 0 pixels

Rest:
81.25vw (offset: 0)
8.602cm (offset: -0.01)
3.385in (offset: -0.04)
86.022mm (offset: 0)
45.316ex (offset: 0)
344.086q (offset: 0)
20.313em (offset: 0.01)
244.706pt (offset: 0)
108.333vh (offset: 0)
```
