import { useEffect } from 'react'

import Hero from '../components/Hero'
import { API_URL } from '../components/Games'

const HomePage = () => {
  useEffect(() => {
    fetch(API_URL).catch(() => {
      // Warm-up request only.
    })
  }, [])

  return (
    <>
    <Hero />
    </>
  )
}

export default HomePage
