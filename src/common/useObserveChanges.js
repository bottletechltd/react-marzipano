import { useEffect, useState } from 'react'
import { produce } from 'immer'
import isEqual from 'lodash.isequal'
import uniqid from 'uniqid'


/**
 * Observe changes to items and output which specific items changed.
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
 * If an item that isn't currently being tracked has been added, it is placed in
 * 'added'.
 * If an item doesn't exist in items anymore but is still being tracked, it is
 * removed from the lookup table, and placed in 'deleted'.
 * If either of the above two are true, or the item has previously been added, but
 * is not the 'same' (according to the eqFuncSame function) (by default uses
 * eqFuncPresent for both 'present' and 'same'), then it is placed in 'updated'.
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
      [itemsLookup, [], [], []],
      ([draftItemsLookup, draftAdded, draftUpdated, draftDeleted]) => {
        const neededKeys = new Set()

        for (const item of items) {
          const existingKey = item.key
            ? (draftItemsLookup.has(item.key) ? item.key : null)
            : Array.from(draftItemsLookup.keys()).find(
              key => eqFuncPresent(draftItemsLookup.get(key), item))

          const sameFunc = eqFuncSame || eqFuncPresent
          const outdated = existingKey && !sameFunc(item, draftItemsLookup.get(existingKey))

          const key = existingKey || uniqid()

          if (!existingKey) {
            draftItemsLookup.set(key, item)
            draftAdded.push(key)
            draftUpdated.push(key)
          } else if (outdated) {
            draftItemsLookup.set(key, item)
            draftUpdated.push(key)
          }

          neededKeys.add(key)
        }

        for (const key of Array.from(draftItemsLookup.keys())) {
          if (!neededKeys.has(key)) {
            draftItemsLookup.delete(key)
            draftUpdated.push(key)
            draftDeleted.push(key)
          }
        }
      })

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

  return [itemsLookup, added, updated, deleted]
}

export default useObserveChanges
