Helps shorten units for cssbattle.dev

# Usage

`> unit-golf [VALUE_TO_CONVERT]`

Where `VALUE_TO_CONVERT` is any whole or fractional number of the following units:

`px, vw, vh, in, cm, mm, pt, pc, em, ex, q, ch`

If the unit is ommitted (eg, `unit-golf 325`) it will default to pixels.

## Options

### `--tolerance`

Maximum difference in pixels that will be considered a match for a value. Defaults to `0.5`. Decreasing will yield more exact but less concise results and vice versa.

### `--width`

Viewport width for the purpose of calculating vw units. Defaults to `400`, which is what cssbattle currently uses.

### `--height`

Viewport height for the purpose of calculating vh units. Defaults to `300`, which is what cssbattle currently uses.

## Examples

```
> unit-golf 57.3vw

⛳  32ex (-0.19px)

172pt (+0.14px)
229px (-0.19px)
57.3vw (+0.01px)
76.4vh (+0.01px)
242.6q (+0.03px)
6.06cm (-0.15px)
60.6mm (-0.15px)
28.65ch (+0.01px)
14.32pc (-0.07px)
14.32em (-0.07px)
2.39in (+0.25px)
```

```
> unit-golf 57.3vw --tolerance 0

⛳  242.57q

60.64mm
171.89pt
...
```

Parens indicate how many pixels off each suggestion is from the target.
