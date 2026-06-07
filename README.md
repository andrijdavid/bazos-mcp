# Bazos-MCP

[![npm version](https://img.shields.io/npm/v/@andrijdavid/bazos-mcp.svg)](https://www.npmjs.com/package/@andrijdavid/bazos-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@andrijdavid/bazos-mcp.svg)](https://www.npmjs.com/package/@andrijdavid/bazos-mcp)
[![License: AGPL-3.0](https://img.shields.io/npm/l/@andrijdavid/bazos-mcp.svg)](./LICENSE)
[![Release](https://github.com/andrijdavid/bazos-mcp/actions/workflows/release.yml/badge.svg)](https://github.com/andrijdavid/bazos-mcp/actions/workflows/release.yml)
[![Node.js](https://img.shields.io/node/v/@andrijdavid/bazos-mcp.svg)](https://nodejs.org)

MCP server for interacting with [Bazos.cz](https://www.bazos.cz), [Bazos.sk](https://www.bazos.sk), [Bazos.at](https://www.bazos.at), and [Bazos.pl](https://www.bazos.pl).



## Features

- Search ads across all sections on Czech, Slovak, Austrian, and Polish Bazos.
- Retrieve detailed ad information.
- Fetch user ratings by phone/email ID.

## Installation

```bash
npm install -g @andrijdavid/bazos-mcp
```

## Usage

Add to your MCP client configuration (e.g. Claude Desktop):

```json
{
  "mcpServers": {
    "bazos": {
      "command": "npx",
      "args": ["-y", "@andrijdavid/bazos-mcp"]
    }
  }
}
```

## Tools

### search_ads

Search ads with filters.

Arguments:
- `domain`: `"cz"`, `"sk"`, `"at"`, or `"pl"`
- `section`: Section code (e.g. `AU` for Auto)
- `query`: Search query string
- `price_from`: Minimum price
- `price_to`: Maximum price
- `sort`: `date`, `price_asc`, `price_desc`, `distance`
- `latitude` / `longitude`: Required when sort is `distance`
- `offset`: Pagination offset (multiples of 20)
- `limit`: Page size (multiples of 20, max 200)

### get_ad_detail

Get full details for an ad.

Arguments:
- `domain`: `"cz"`, `"sk"`, `"at"`, or `"pl"`
- `ad_id`: The ad ID

### get_user_ratings

Get user ratings.

Arguments:
- `domain`: `"cz"`, `"sk"`, `"at"`, or `"pl"`
- `phone`: Phone ID
- `email`: Email ID
- `offset`: Pagination offset
- `limit`: Page size

## Sections

| Code | Name |
|------|------|
| AU | Auto |
| DE | Deti |
| DU | Dum a Zahrada |
| EL | Elektro |
| FO | Foto |
| HU | Hudba |
| KN | Knihy |
| MO | Mobily |
| MT | Motorky |
| NA | Nabytek |
| OB | Obleceni |
| PC | PC |
| PR | Prace |
| RE | Reality |
| SL | Sluzby |
| SP | Sport |
| ST | Stroje |
| VS | Vstupenky |
| ZV | Zvirata |
| OS | Ostatni |

## Disclaimer

This project is not affiliated with or endorsed by Bazos.cz, Bazos.sk, Bazos.at, or Bazos.pl. The author is not responsible for any consequences arising from use of this software. The code is provided "as is", without warranty of any kind.

## License

GNU AGPL-3.0. See [LICENSE](./LICENSE).
