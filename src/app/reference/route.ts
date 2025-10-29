import { ApiReference } from '@scalar/nextjs-api-reference'

const config = {
  url: '/openapi.json',
  cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
}

export const GET = ApiReference(config)
