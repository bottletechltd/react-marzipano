import { useEffect, useState } from 'react'
import { produce } from 'immer'
import uniqid from 'uniqid'


/**
 * Observe changes to items and output which specific items changed.
 *
 * It does this by returning a lookup table for each item, and returning
 * arrays of keys that are updated whenever an item is either new, has been
 * previously added but is outdated, or an old item has been deleted.
 *
 * The goal is to allow changes for specific items within a larger iterable to
 * be observed, and functions to be run only for items which have changed.
 *
 * The returned added, updated, and deleted arrays are of keys to be used with
 * the provided lookup table.
 *
 * The way it assigns keys to items is first, it checks whether each item has
 * the 'key' field (this is a way for a consumer of this function to provide
 * their own keys for items, and is a performance optimization). If it does, it
 * uses that.
 * If not, then it will assign the item a unique id the first time it is added to
 * the lookup table.
 *
 * When changes happen to items, the hook differentiates between whether items
 * are being added, modified, or deleted.
 *
 * The difference between 'added' and 'modified' is determined by the item's 'key'
 * field, and the functions eqFuncPresent and eqFuncSame.
 * An item is 'exists' in the lookup table if the item has a 'key' field, and this
 * key can be found in the lookup table. Or, in the case that the item has no 'key'
 * field, whether any corresponding value in the lookup table returns true for
 * eqFuncPresent(item, value). (eqFuncPresent is Object.is by default)
 * An item is 'added' to the lookup table when no value in the lookup table 'exists'
 * for that item.
 * An item is 'modified' if a corresponding value in the lookup table 'exists', AND
 * eqFuncSame(item, value) returns false (i.e. they are not the same value anymore).
 * If eqFuncSame has not been provided then eqFuncPresent is used instead.
 * An item is 'deleted' if it exists in the lookup table but doesn't in items
 * anymore.
 *
 * The key field gives a small performance boost to lookups, allowing 'exist' checks
 * to happen in O(1) time as opposed to iterating over the whole table
 */
function useObserveChanges(items, eqFuncPresent = Object.is, eqFuncSame = null) {
  const [itemsLookup, setItemsLookup] = useState(new Map())
  const [added, setAdded] = useState([])
  const [updated, setUpdated] = useState([])
  const [deleted, setDeleted] = useState([])

  useEffect(() => {
    const [newItemsLookup, addedKeys, updatedKeys, deletedKeys] = produce(
      ([draftItemsLookup, draftAdded, draftUpdated, draftDeleted]) => {
        const neededKeys = []

        for (const item of items) {
          const existingKey = item.key
            ? (draftItemsLookup.has(item.key) ? item.key : null)
            : draftItemsLookup.keys().find(key => eqFuncPresent(draftItemsLookup[key], item))
          const sameFunc = eqFuncSame || eqFuncPresent
          const outdated = existingKey && !sameFunc(item, draftItemsLookup[existingKey])

          const key = existingKey || uniqid()

          if (!existingKey) {
            draftItemsLookup.set(key, item)
            draftAdded.push(key)
          } else if (outdated) {
            draftUpdated.push(key)
          }

          neededKeys.push(key)
        }

        for (const key of Array.from(draftItemsLookup.keys())) {
          if (!neededKeys.has(key)) {
            draftItemsLookup.delete(key)
            draftDeleted.push(key)
          }
        }
      }, [itemsLookup, [], [], []])

    if (addedKeys.length > 0 || updatedKeys.length > 0 || deletedKeys.length > 0) {
      setItemsLookup(newItemsLookup)
    }
    if (addedKeys.length > 0) {
      setAdded(addedKeys)
    }
    if (updatedKeys.length > 0) {
      setUpdated(updatedKeys)
    }
    if (deletedKeys.length > 0) {
      setDeleted(deletedKeys)
    }
  }, [items, eqFuncPresent, eqFuncSame, itemsLookup])

  return { itemsLookup, added, updated, deleted }
}

export default useObserveChanges
