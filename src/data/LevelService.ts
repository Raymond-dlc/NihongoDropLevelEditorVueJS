import type { Level } from '@/model/Level'
import axios from 'axios'

export default {

  async getLatestLevelForChapter(chapterId: string): Promise<Level | undefined> {
    const getLevelsResponse = await axios.get(`/api/levels?checkpointId=${chapterId}&_sort=-levelId&limit=9000`)

    if (getLevelsResponse.status >= 300) return Promise.reject('Failed to load level')
    const currentChapterLevels = getLevelsResponse.data as Level[]

    return currentChapterLevels[0]
  },

  async getLatestLevel(): Promise<Level> {
    const getLevelsResponse = await axios.get(`/api/levels?_sort=-levelId&limit=9000`)

    if (getLevelsResponse.status >= 300) return Promise.reject('Failed to load level')
    const currentChapterLevels = getLevelsResponse.data as Level[]

    return currentChapterLevels[0]
  }
}
