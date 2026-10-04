'use client'

import { useCallback, useEffect, useState } from 'react'
// import { searchProducts } from '@/lib/products'
import { trackEvent } from '@/lib/tracking'
import type { Product } from '@/types/types'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true)
        // const searchResults = searchProducts(query)
        setResults([])
        trackEvent('SEARCH', { query, resultCount: 0 })
        setIsSearching(false)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
  }, [])

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
  }
}
