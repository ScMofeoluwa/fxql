// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0];
}
declare var currencyPair: any;
declare var buy: any;
declare var number: any;
declare var sell: any;
declare var cap: any;
declare var ws: any;
declare var lbrace: any;
declare var rbrace: any;
declare var nl: any;

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

interface NearleyToken {
  value: any;
  [key: string]: any;
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
}

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol =
  | string
  | { literal: any }
  | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
}

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {
      name: 'Statement',
      symbols: [
        'CurrencyPair',
        'ws',
        'lbrace',
        'nl',
        'ws',
        'Buy',
        'nl',
        'ws',
        'Sell',
        'nl',
        'ws',
        'Cap',
        'nl',
        'rbrace',
      ],
      postprocess: ([currencyPair, , , , , buy, , , sell, , , cap]) => ({
        sourceCurrency: currencyPair.split('-')[0],
        destinationCurrency: currencyPair.split('-')[1],
        buyPrice: parseFloat(buy),
        sellPrice: parseFloat(sell),
        capAmount: parseInt(cap),
      }),
    },
    {
      name: 'CurrencyPair',
      symbols: [
        lexer.has('currencyPair') ? { type: 'currencyPair' } : currencyPair,
      ],
      postprocess: (d) => d[0].text,
    },
    {
      name: 'Buy',
      symbols: [
        lexer.has('buy') ? { type: 'buy' } : buy,
        'ws',
        lexer.has('number') ? { type: 'number' } : number,
      ],
      postprocess: (d) => d[2].text,
    },
    {
      name: 'Sell',
      symbols: [
        lexer.has('sell') ? { type: 'sell' } : sell,
        'ws',
        lexer.has('number') ? { type: 'number' } : number,
      ],
      postprocess: (d) => d[2].text,
    },
    {
      name: 'Cap',
      symbols: [
        lexer.has('cap') ? { type: 'cap' } : cap,
        'ws',
        lexer.has('number') ? { type: 'number' } : number,
      ],
      postprocess: (d) => d[2].text,
    },
    { name: 'ws', symbols: [lexer.has('ws') ? { type: 'ws' } : ws] },
    {
      name: 'lbrace',
      symbols: [lexer.has('lbrace') ? { type: 'lbrace' } : lbrace],
    },
    {
      name: 'rbrace',
      symbols: [lexer.has('rbrace') ? { type: 'rbrace' } : rbrace],
    },
    { name: 'nl', symbols: [lexer.has('nl') ? { type: 'nl' } : nl] },
  ],
  ParserStart: 'Statement',
};

export default grammar;
