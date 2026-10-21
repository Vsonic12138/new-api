/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { z } from 'zod'

export const cacheSearchSchema = z.object({
  cacheScope: z.enum(['self', 'all']).optional().catch(undefined),
  cacheDays: z
    .union([z.literal(1), z.literal(7), z.literal(30)])
    .optional()
    .catch(undefined),
  cacheModel: z.string().max(256).optional().catch(undefined),
})

export type CacheSearch = z.infer<typeof cacheSearchSchema>
