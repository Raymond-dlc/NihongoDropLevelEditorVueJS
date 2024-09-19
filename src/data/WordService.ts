import type { Word } from '@/model/Word'
import axios from 'axios'

export default {

    async getAllWords(): Promise<Word[]> {
        const response = await axios.get(`/api/words?limit=9000`)

        if (response.status >= 300) return Promise.reject('Failed to load level')
        const allWords = response.data as Word[]

        return allWords
    }
}
