import type { LevelWord } from '@/model/LevelWord'
import axios from 'axios'

export default {

    async getAllLevelWords(): Promise<LevelWord[]> {
        const response = await axios.get(`/api/levelWords?limit=9000`)

        if (response.status >= 300) return Promise.reject('Failed to load level')

        return response.data as LevelWord[]
    }
}
