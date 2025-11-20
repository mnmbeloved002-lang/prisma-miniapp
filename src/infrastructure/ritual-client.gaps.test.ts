import { describe, it, expect } from 'vitest'
import * as client from './ritual-client'

describe('ritual-client gaps', () => {
  it('should have getRitualCached', () => {
    expect(client.getRitualCached).toBeDefined()
  })
})
