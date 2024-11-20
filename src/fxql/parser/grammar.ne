@preprocessor typescript

@{%
const moo = require('moo');

const lexer = moo.compile({
    currencyPair: /[A-Z]{3}-[A-Z]{3}/,
    buy: /BUY/,
    sell: /SELL/,
    cap: /CAP/,
    number: /[0-9]+(?:\.[0-9]+)?/,
    ws: /[ \t]+/,
    nl: { match: /\n/, lineBreaks: true },
    lbrace: '{',
    rbrace: '}',
  });
%}

@lexer lexer
Statement -> CurrencyPair ws lbrace nl ws Buy nl ws Sell nl ws Cap nl rbrace {%
  ([currencyPair, , , , , buy, , , sell, , , cap]) => ({
      sourceCurrency: currencyPair.split('-')[0],
      destinationCurrency: currencyPair.split('-')[1],
      buyPrice: parseFloat(buy),
      sellPrice: parseFloat(sell),
      capAmount: parseInt(cap)
    })
%} 

CurrencyPair -> %currencyPair {% d => d[0].text %}
Buy -> %buy ws %number {% d => d[2].text %}
Sell -> %sell ws %number {% d => d[2].text %}
Cap -> %cap ws %number {% d => d[2].text %}

ws -> %ws
lbrace -> %lbrace
rbrace -> %rbrace
nl -> %nl
