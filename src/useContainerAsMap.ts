import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Container, KeyedData } from './types'


export default function useContainerAsMap<T extends KeyedData>(inputData?: Container<T>): Map<string, T> {
  const inputDataAsMap = useMemo<Map<string, T>>(() => {
    if (inputData === undefined) {
      return new Map()
    }
    if (inputData instanceof Map) {
      return inputData
    }
    if (inputData instanceof Array) {
      return new Map(inputData.map((data) => {
        const key = data.key ?? uuidv4()
        return [key, data]
      }))
    }
    return new Map(Object.entries(inputData))
  }, [inputData])

  return inputDataAsMap
}
