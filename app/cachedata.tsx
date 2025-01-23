'use client'

import React, { useEffect } from 'react'
import Container from '../components/container-setup'
import { useDispatch } from 'react-redux'
import { setPerfumes } from '@/redux/perfume/perfumeReducer'
import { UserType } from '@/types/user'
import { RecommendPerfume } from '@/utils/api/actions-client/perfume'
import {Perfume} from '@/types/perfume'

interface ProviderComponentProps {
  user: UserType
  children: React.ReactNode
}

const CacheData: React.FC<ProviderComponentProps> = ({ user, children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPerfumes = async () => {
      try {
        const data: Perfume[] = await RecommendPerfume()
        dispatch(setPerfumes(data))
      } catch (error) {
        console.error('Error fetching perfumes:', error)
      }
    }

    fetchPerfumes()
  }, [])
  return <Container user={user}>{children}</Container>
}

export default CacheData
