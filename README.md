# @andrijdavid/bazos-mcp

MCP server for interacting with [Bazos.cz](https://www.bazos.cz) and [Bazos.sk](https://www.bazos.sk) classifieds.

## Features

- Search ads across all sections on both Czech and Slovak Bazos.
- Retrieve detailed ad information.
- Fetch user ratings by phone/email ID.
- Built-in evasion: randomised user agents, device IDs, and request jitter to avoid detection.

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
- `domain`: `"cz"` or `"sk"`
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
- `domain`: `"cz"` or `"sk"`
- `ad_id`: The ad ID

### get_user_ratings

Get user ratings.

Arguments:
- `domain`: `"cz"` or `"sk"`
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

## License

GNU AGPL-3.0. See [LICENSE](./LICENSE).
