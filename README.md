# excel-formula-ast

A lightweight, dependency-free TypeScript library that parses raw Microsoft Excel formulas into well‑structured, strongly‑typed Abstract Syntax Trees (ASTs). Perfect for analysis, transformation, or formula tooling—without needing Excel or Office integration.

> Inspired by [psalaets/excel-formula-ast](https://github.com/psalaets/excel-formula-ast), this parser reimagines the approach using a Pratt (TDOP) parser instead of a Shunting Yard algorithm, improving readability, control, and extensibility.

![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Parser](<https://img.shields.io/badge/Parser-Pratt%20(TDOP)-blueviolet>)
![Runtime](https://img.shields.io/badge/Runtime-0%20Dependencies-lightgrey)
![Excel](https://img.shields.io/badge/Excel-Compatible-yellowgreen)

---

## ✨ Highlights

| Feature                       | Description                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Fully lossless token stream   | Lexer preserves every character—sheet names, errors, quotes, and all.                                                |
| Pratt (TDOP) parser           | Operator precedence, prefix/postfix disambiguation, ranges, spills (`%`) all handled via a precedence-driven design. |
| Structured transform pipeline | Clean post-processing via optional AST passes like `collapseBinary` and `normalizeFilters`.                          |
| Type-safe & dependency-free   | Published as both ESM and CJS, with full `.d.ts` support and no runtime dependencies.                                |
| Diagnostic-friendly AST       | Every node and token includes source `loc` offsets to enable mapping back to original input.                         |

---

## 📦 Installation

```bash
npm i excel-formula-ast
```

---

## 🚀 Quick Start

```ts
import { parseFormula } from "excel-formula-ast";

const ast = parseFormula('=SUM(FILTER(A1:C10,(B:B="West")*(C:C>1000)))');
console.dir(ast, { depth: null });
```

Each node in the tree includes precise `loc.start` and `loc.end` positions, ideal for linting, diagnostics, or source mapping.

---

## 🧐 Example: Formula → AST

### Input

```txt
=IF(
  AND(ISNUMBER(B2), B2>100),
  TEXT(TODAY(), "mm/dd/yyyy"),
  IF(ISBLANK(C2), "Missing", "Check")
)
```

### Output (JSON)

```jsonc
{
  "type": "IF",
  "args": [
    {
      "type": "AND",
      "args": [
        { "type": "ISNUMBER", "args": [{ "type": "CELL", "value": "B2" }] },
        {
          "type": ">",
          "args": [
            { "type": "CELL", "value": "B2" },
            { "type": "NUMBER", "value": 100 }
          ]
        }
      ]
    },
    {
      "type": "TEXT",
      "args": [
        { "type": "TODAY" },
        { "type": "LITERAL", "value": "mm/dd/yyyy" }
      ]
    },
    {
      "type": "IF",
      "args": [
        { "type": "ISBLANK", "args": [{ "type": "CELL", "value": "C2" }] },
        { "type": "LITERAL", "value": "Missing" },
        { "type": "LITERAL", "value": "Check" }
      ]
    }
  ]
}
```

---

## 📊 Supported Excel Functions

Supports over 50 Excel worksheet functions across logical, lookup, math, text, and dynamic array categories.

| Category                 | Examples                                                                          |
| ------------------------ | --------------------------------------------------------------------------------- |
| Logical / Error Handling | `IF`, `AND`, `OR`, `NOT`, `IFERROR`, `IFNA`, `ISERROR`, `ISBLANK`, `ISNUMBER`     |
| Lookup & Reference       | `INDEX`, `MATCH`, `VLOOKUP`, `XLOOKUP`, `CHOOSE`                                  |
| Math & Trigonometry      | `SUM`, `ROUND`, `ABS`, `FLOOR`, `CEILING`, `MIN`, `MAX`, `RANK`, `ROUNDUP`, etc.  |
| Text                     | `TEXT`, `LEFT`, `RIGHT`, `SUBSTITUTE`, `TEXTJOIN`, `VALUE`, `LEN`, `CONCAT`, etc. |
| Statistical              | `COUNT`, `COUNTA`, `AVERAGE`, `SUMIF`, `SUMIFS`, `COUNTIF`, `COUNTBLANK`          |
| Dynamic Arrays           | `LET`, `LAMBDA`, `FILTER`, `UNIQUE`, `SORT`, `SEQUENCE`, `RANDARRAY`, `SORTBY`    |

---

## ⚙️ Architecture Overview

```bash
string → tokenize → guessToken → prattParse → collapseBinary → normalizeFilters → AST
```

### Components

- `lexer/` — Regex-based tokenizer (longest-match)
- `parser/` — Pratt parser with binding power table
- `transforms/` — Optional AST passes
- `types/` — All type definitions and function metadata
- `parseFormula.ts` — High-level orchestrator

---

## 📅 Testing

- Lexer snapshots
- Round‑trip validation (AST → string → Excel)
- Complex transform edge cases

```bash
npm test         # Full test suite
npm run test:lex # Lexer-only tests
```

---

## ⚠️ Limitations

- Array constants `{}` currently opaque
- No full handling of intersection (space) or union (comma) yet
- Spill ranges (`#`) are not parsed

---

## 🛠️ Extend It

| Task                  | Where to Modify                                  |
| --------------------- | ------------------------------------------------ |
| Add new function      | `types/functions.ts`                             |
| New token type        | `lexer/patterns.ts`                              |
| Custom transform pass | `transforms/` + export via `transforms/index.ts` |
| Modify precedence     | `parser/pratt.ts`                                |

---

## 📄 License

MIT © 2025 Chris Moran

_This parser is a standalone tool built atop the structure and semantics of Microsoft Excel formulas. It is not affiliated with or endorsed by Microsoft._
