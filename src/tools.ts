// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BazosClient } from './bazos-client.js';
import { SECTIONS, SORT_TYPES, DEFAULTS } from './config.js';
import type { Domain } from './config.js';
import { validateOffset, validateLimit, isValidSection, isValidSort } from './utils.js';

const client = new BazosClient();

const SECTION_DESCRIPTION = Object.entries(SECTIONS)
  .map(([code, name]) => `${code} = ${name}`)
  .join('\n');

const SORT_DESCRIPTION = SORT_TYPES.join(', ');

export function createServer(): Server {
  const server = new Server(
    {
      name: '@andrijdavid/bazos-mcp',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'search_ads',
          description:
            'Search ads on Bazos.cz or Bazos.sk. ' +
            'Returns a list of ads matching the criteria.',
          inputSchema: {
            type: 'object',
            properties: {
              domain: {
                type: 'string',
                enum: ['cz', 'sk'],
                description: 'Domain to search: cz or sk',
              },
              section: {
                type: 'string',
                description: `Section code. Available:\n${SECTION_DESCRIPTION}`,
              },
              query: {
                type: 'string',
                description: 'Search query string',
              },
              price_from: {
                type: 'number',
                description: 'Minimum price',
              },
              price_to: {
                type: 'number',
                description: 'Maximum price',
              },
              sort: {
                type: 'string',
                description: `Sort type. Available: ${SORT_DESCRIPTION}. For distance, provide latitude and longitude.`,
              },
              latitude: {
                type: 'number',
                description: 'Latitude (required when sort is distance)',
              },
              longitude: {
                type: 'number',
                description: 'Longitude (required when sort is distance)',
              },
              offset: {
                type: 'number',
                description: `Offset for pagination. Default: ${DEFAULTS.offset}. Must be a multiple of 20.`,
              },
              limit: {
                type: 'number',
                description: `Limit for pagination. Default: ${DEFAULTS.limit}. Must be a multiple of 20 up to 200.`,
              },
            },
            required: ['domain'],
          },
        },
        {
          name: 'get_ad_detail',
          description: 'Get detailed information about a specific ad by its ID.',
          inputSchema: {
            type: 'object',
            properties: {
              domain: {
                type: 'string',
                enum: ['cz', 'sk'],
                description: 'Domain: cz or sk',
              },
              ad_id: {
                type: 'string',
                description: 'The ad ID',
              },
            },
            required: ['domain', 'ad_id'],
          },
        },
        {
          name: 'get_user_ratings',
          description: 'Get user ratings by phone ID and/or email ID.',
          inputSchema: {
            type: 'object',
            properties: {
              domain: {
                type: 'string',
                enum: ['cz', 'sk'],
                description: 'Domain: cz or sk',
              },
              phone: {
                type: 'string',
                description: 'Phone ID of the user',
              },
              email: {
                type: 'string',
                description: 'Email ID of the user',
              },
              offset: {
                type: 'number',
                description: `Offset for pagination. Default: ${DEFAULTS.offset}.`,
              },
              limit: {
                type: 'number',
                description: `Limit for pagination. Default: ${DEFAULTS.limit}.`,
              },
            },
            required: ['domain'],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      if (name === 'search_ads') {
        const domain = (args?.domain as string) as Domain;
        const section = args?.section as string | undefined;
        const query = args?.query as string | undefined;
        const priceFrom = args?.price_from as number | undefined;
        const priceTo = args?.price_to as number | undefined;
        const sort = args?.sort as string | undefined;
        const latitude = args?.latitude as number | undefined;
        const longitude = args?.longitude as number | undefined;
        const offset = args?.offset as number | undefined;
        const limit = args?.limit as number | undefined;

        if (!domain || (domain !== 'cz' && domain !== 'sk')) {
          return {
            content: [
              {
                type: 'text',
                text: 'Invalid domain. Use "cz" or "sk".',
              },
            ],
            isError: true,
          };
        }

        const searchParams = {
          offset: offset !== undefined ? validateOffset(offset) : DEFAULTS.offset,
          limit: limit !== undefined ? validateLimit(limit) : DEFAULTS.limit,
          query,
          price_from: priceFrom,
          price_to: priceTo,
          latitude,
          longitude,
        };

        if (section && isValidSection(section)) {
          Object.assign(searchParams, { section });
        }

        if (sort && isValidSort(sort)) {
          Object.assign(searchParams, { sort });
        }

        const ads = await client.searchAds(domain, searchParams);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ads, null, 2),
            },
          ],
        };
      }

      if (name === 'get_ad_detail') {
        const domain = (args?.domain as string) as Domain;
        const adId = args?.ad_id as string;

        if (!domain || (domain !== 'cz' && domain !== 'sk')) {
          return {
            content: [
              {
                type: 'text',
                text: 'Invalid domain. Use "cz" or "sk".',
              },
            ],
            isError: true,
          };
        }

        if (!adId) {
          return {
            content: [
              {
                type: 'text',
                text: 'Missing ad_id.',
              },
            ],
            isError: true,
          };
        }

        const detail = await client.getAdDetail(domain, adId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(detail, null, 2),
            },
          ],
        };
      }

      if (name === 'get_user_ratings') {
        const domain = (args?.domain as string) as Domain;
        const phone = args?.phone as string | undefined;
        const email = args?.email as string | undefined;
        const offset = args?.offset as number | undefined;
        const limit = args?.limit as number | undefined;

        if (!domain || (domain !== 'cz' && domain !== 'sk')) {
          return {
            content: [
              {
                type: 'text',
                text: 'Invalid domain. Use "cz" or "sk".',
              },
            ],
            isError: true,
          };
        }

        const ratings = await client.getUserRatings(domain, {
          offset: offset !== undefined ? validateOffset(offset) : DEFAULTS.offset,
          limit: limit !== undefined ? validateLimit(limit) : DEFAULTS.limit,
          phone,
          email,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ratings, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export async function startServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
