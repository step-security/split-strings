# split-strings@v1
> GitHub Action to split a string into parts using a delimiter with optional limit support.

---

## 🔥 Example Usage

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Split version string
        uses: step-security/split-strings@v1
        id: split
        with:
          string: 1.12.4
          separator: .
          limit: -1

      - name: Reference split parts
        run: |
          echo "Major: ${{ steps.split.outputs._0 }}"
          echo "Minor: ${{ steps.split.outputs._1 }}"
          echo "Patch: ${{ steps.split.outputs._2 }}"
```

## 💡 Inputs

| Input       | Required | Default | Description                                                                          | Example  |
|-------------|:--------:|:-------:|--------------------------------------------------------------------------------------|----------|
| `string`    | ✅       |         | The input string to be split                                                        | `1.12.4` |
| `separator` | ❌       | space   | The delimiter used to split the string. Defaults to a space character               | `.`      |
| `limit`     | ❌       | `-1`    |  Maximum number of parts to return. Use -1 to return all parts.                     | `-1`     |

---

## 📦 Outputs

| Output       | Description                                             | Example                     |
|--------------|---------------------------------------------------------|-----------------------------|
| `_${index}`  | Segments produced after splitting (e.g. `_0`, `_1`, ...) | `_0`: `1`<br>`_1`: `12`<br>`_2`: `4` |
| `length`     | Total number of output parts                            | `3`                         |

---
