const pos = {
    "n": "noun",
    "v": "verb",
    "a": "adjective",
    "s": "ajective satellite",
    "r": "adverb"
}

const pointerSymbols = {
    "noun": {
        "!": "Antonym",
        "@": "Hypernym",
        "@i": "Instance Hypernym",
        "~": "Hyponym",
        "~i": "Instance Hyponym",
        "#m": "Member holonym",
        "#s": "Substance holonym",
        "#p": "Part holonym",
        "%m": "Member meronym",
        "%s": "Substance meronym",
        "%p": "Part meronym",
        "=": "Attribute",
        "+": "Derivationally related form",
        ";c": "Domain of synset - TOPIC",
        "-c": "Member of this domain - TOPIC",
        ";r": "Domain of synset - REGION",
        "-r": "Member of this domain - REGION",
        ";u": "Domain of synset - USAGE",
        "-u": "Member of this domain - USAGE"
    },
    "verb": {
        "!": "Antonym",
        "@": "Hypernym",
        "~": "Hyponym",
        "*": "Entailment",
        ">": "Cause",
        "^": "Also see",
        "$": "Verb Group",
        "+": "Derivationally related form",
        ";c": "Domain of synset - TOPIC",
        ";r": "Domain of synset - REGION",
        ";u": "Domain of synset - USAGE"
    },
    "adjective": {
        "!": "Antonym",
        "&": "Similar to",
        "<": "Participle of verb",
        "\\": "Pertainym (pertains to noun)",
        "=": "Attribute",
        "^": "Also see",
        ";c": "Domain of synset - TOPIC",
        ";r": "Domain of synset - REGION",
        ";u": "Domain of synset - USAGE",        
    },
    "adverb": {
        "!": "Antonym",
        "\\": "Derived from adjective",
        ";c": "Domain of synset - TOPIC",
        ";r": "Domain of synset - REGION",
        ";u": "Domain of synset - USAGE"
    }
}

module.exports = { pos, pointerSymbols }