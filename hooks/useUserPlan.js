import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'

export function useUserPlan(userId) {
  const [plan, setPlan] = useState('gratuit')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlan() {
      if (!userId) {
        setPlan('gratuit')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.rpc('get_user_active_plan', { user_id_param: userId })
        if (error) throw error
        setPlan(data || 'gratuit')
      } catch (err) {
        console.error('Error fetching plan:', err)
        setPlan('gratuit')
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [userId])

  return { plan, loading }
}
