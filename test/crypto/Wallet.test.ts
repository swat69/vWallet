import { VergeLightClient } from '../../src/crypto/Wallet'
import { bwsClientMock } from '../mocks/BWSClientMock'
import * as fs from 'fs'
import * as path from 'path'
import VergeCacheStore from '../../src/stores/VergeCacheStore'

describe('[Component] Wallet management system', () => {
  beforeEach(() => {
    VergeCacheStore.clean()
  })

  test('should fail if passphrase is empty', () => {
    const client = new VergeLightClient({})
    expect(() => client.createNewWallet('')).toThrowError(
      'No Empty passphrase allowed',
    )
  })

  test('Wallet creation should work and return a valid mnemonic', async () => {
    const client = new VergeLightClient(bwsClientMock())

    expect(client.isWalletReady()).toBe(false)
    expect(client.isWalletLocked()).toBe(false)
    expect(client.isWalletAlreadyExistent()).toBe(false)

    const data = await client.createNewWallet('mypass')

    expect(data).toBeDefined()
    expect(data.mnemonic).toBeDefined()
    expect(typeof data.mnemonic).toBe('string')
    expect(data.mnemonic.split(' ').length).toBe(12)
  })

  test('should fail if passphrase is empty', async () => {
    const client = new VergeLightClient(bwsClientMock())

    expect(client.isWalletReady()).toBe(false)
    expect(client.isWalletLocked()).toBe(false)
    expect(client.isWalletAlreadyExistent()).toBe(false)

    await client.createNewWallet('mypass')

    expect(client.isWalletReady()).toBe(true)
    expect(client.isWalletLocked()).toBe(false)
    expect(client.isWalletAlreadyExistent()).toBe(true)
  })
})
