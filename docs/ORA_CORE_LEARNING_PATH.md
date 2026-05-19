# ORA Core Learning Path

## Logical reading order for ORA Core, GrenaPrompt and GPV2

**Version:** 0.1  
**Purpose:** make the public GitHub comfortable to read, learn and navigate.  
**Owner:** Xavier Fleriag / Twins Productions

---

## 1. Why this page exists

The ORA ecosystem is intentionally modular.

That is useful for architecture, but it can make the GitHub difficult to approach for a new reader.

This page gives a simple reading path.

It answers:

```text
Where should I start?
What should I read next?
Which repository owns which layer?
Which documents are foundational?
```

---

## 2. Short map

```text
GrenaPrompt        = human-machine prompt language
FGP                = governance around GrenaPrompt
GPV2               = compact governed execution packet
Gibberlink         = compact symbolic state language
Gibberlink_Glyph   = optional glyph / phonetic bridge
GLK                = canonical archive and retrieval key
Rosetta Translator = backend translation / compilation / validation layer
ORA Essences       = compressed behavioral micro-modules
Runtime            = executable bootstrap and tests
RAG                = retrieval and memory context layer
```

---

## 3. Recommended beginner path

### Step 1 - Understand GrenaPrompt

Start here if you are new.

Read:

- [GrenaPrompt Foundational Whitepaper](https://github.com/TwinsProductionAI/grenaprompt-linked/blob/main/docs/GRENAPROMPT_FOUNDATIONAL_WHITEPAPER.md)
- [GrenaPrompt Glossary](https://github.com/TwinsProductionAI/grenaprompt-linked/blob/main/docs/GRENAPROMPT_GLOSSARY.md)

Goal:

```text
Understand JSON + EN + FR and double reading.
```

---

### Step 2 - Understand FGP

Read:

- [FGP Framework GrenaPrompt](https://github.com/TwinsProductionAI/grenaprompt-linked/blob/main/docs/FGP_FRAMEWORK_GRENAPROMPT.md)

Goal:

```text
Understand how GrenaPrompt is stabilized, audited and governed.
```

---

### Step 3 - Understand GPV2

Read:

- [GPV2 Foundational Note](GPV2_FOUNDATIONAL_NOTE.md)

Goal:

```text
Understand GPV2 as GP compacted, structured, routable and governed.
```

---

### Step 4 - Understand symbolic transport

Read:

- [Gibberlink Foundational Whitepaper](https://github.com/TwinsProductionAI/grenaprompt-linked/blob/main/docs/GIBBERLINK_FOUNDATIONAL_WHITEPAPER.md)
- [Gibberlink_Glyph Foundational Note](https://github.com/TwinsProductionAI/grenaprompt-linked/blob/main/docs/GIBBERLINK_GLYPH_FOUNDATIONAL_NOTE.md)
- [GLK Foundational Note](https://github.com/TwinsProductionAI/grenaprompt-linked/blob/main/docs/GLK_FOUNDATIONAL_NOTE.md)

Goal:

```text
Understand compact symbolic states, glyph extensions and canonical keys.
```

---

### Step 5 - Understand Rosetta Translator

Read:

- [GPV2 Rosetta Translator Foundational Note](https://github.com/TwinsProductionAI/ora-core-specs/blob/main/specs/gpv2/ROSETTA_TRANSLATOR_FOUNDATIONAL_NOTE.md)
- [Rosetta Canonical Flow Examples](https://github.com/TwinsProductionAI/ora-core-specs/tree/main/specs/gpv2/examples/rosetta_canonical_flow)

Goal:

```text
Understand how human intent becomes JSON, HGOV, GL, GL_G, HASH, ROUTE and NATIVE_FINAL.
```

---

### Step 6 - Understand ORA Essences

Read:

- [ORA Essences Foundational Note](https://github.com/TwinsProductionAI/ora-core-runtime/blob/main/docs/ESSENCES_FOUNDATIONAL_NOTE.md)
- [ORA Essence Language Map](https://github.com/TwinsProductionAI/ora-core-runtime/blob/main/docs/ORA_ESSENCE_LANGUAGE_MAP.md)

Goal:

```text
Understand compressed behavioral micro-modules and symbolic essence routes.
```

---

### Step 7 - Inspect the 22-module architecture

Read:

- [GPV2 Module Index](GPV2/README.md)
- [Modules Manifest](GPV2/modules_manifest.json)
- [22 Modules Reference](ORA_CORE_OS_22_Modules_GPV2.md)

Goal:

```text
Understand the ORA Core OS module order and dependency map.
```

---

### Step 8 - Move to executable runtime

Read:

- [ora-core-runtime](https://github.com/TwinsProductionAI/ora-core-runtime)

Goal:

```text
Inspect GPV2 parsing, GL/GL_G primitives, ESSENCE_ME and H-NERONS runtime tests.
```

---

### Step 9 - Move to retrieval and memory

Read:

- [ora-core-rag](https://github.com/TwinsProductionAI/ora-core-rag)

Goal:

```text
Understand retrieval, RAG Governor, audit traces and memory context routing.
```

---

## 4. Repository roles

| Order | Repository | Role |
| ---: | --- | --- |
| 1 | `ora-core-os` | Main architecture, install order and learning path. |
| 2 | `ora-core-runtime` | Executable bootstrap runtime, essences, tests and backend modules. |
| 3 | `ora-core-rag` | Retrieval layer and RAG Governor. |
| 4 | `ora-core-specs` | Technical specifications, Rosetta and backend GPV2 docs. |
| 5 | `grenaprompt-linked` | GrenaPrompt, FGP, Gibberlink, Gibberlink_Glyph and GLK language layer. |
| 6 | `ora-core-neroflux` | Cognitive flow-control module. |

---

## 5. Learning tracks

### Non-technical reader

```text
GrenaPrompt -> FGP -> GPV2 Foundational Note -> Rosetta examples
```

### Prompt engineer

```text
GrenaPrompt -> FGP -> GPV2 -> Rosetta examples -> ORA Essence Language Map
```

### Developer

```text
GPV2 Foundational Note -> GPV2 backend specs -> runtime -> tests -> RAG
```

### Trainer / educator

```text
GrenaPrompt -> GrenaPrompt Free Pack -> Rosetta examples -> cohort curriculum
```

### Architect

```text
Learning Path -> GPV2 modules -> manifests -> specs -> runtime -> RAG
```

---

## 6. What not to do

Do not start with every repository at once.

Do not read runtime code before understanding GPV2 basics.

Do not treat GL_G or glyphs as decorative language.

Do not treat NATIVE_FINAL as the truth source.

Do not compress away uncertainty.

---

## 7. Golden path

For most readers, the recommended order is:

```text
1. GrenaPrompt
2. FGP
3. GPV2
4. Rosetta Translator
5. Examples
6. ORA Essences
7. Modules Manifest
8. Runtime
9. RAG
```

---

## 8. Final summary

```text
GrenaPrompt teaches how to write.
FGP teaches how to govern the writing.
GPV2 teaches how to compact and route.
Rosetta teaches how to translate between layers.
Essences teach how behavior is activated.
Runtime teaches how the system executes.
RAG teaches how context is retrieved.
```

This page is the recommended public entry map for the ORA Core GitHub ecosystem.
