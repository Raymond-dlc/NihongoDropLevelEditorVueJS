import type { LevelConnection } from '@/model/LevelConnection'
import axios from 'axios'

export default {

    async getAllLevelConnections(): Promise<LevelConnection[]> {
        const response = await axios.get(`/api/levelConnections?limit=9000`)

        if (response.status >= 300) return Promise.reject('Failed to load level')

        return response.data as LevelConnection[]
    }
}
