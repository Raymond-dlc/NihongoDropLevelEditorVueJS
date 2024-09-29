import type { Chapter } from '@/model/Chapter'
import { getLanguageCode, Language } from '@/model/enums/Language'
import axios from 'axios'

export default {
  async getAllChapters(): Promise<Chapter[]> {
    const response = await axios.get(`/api/chapters?limit=9001`)

    if (response.status != 200) return Promise.reject('failed to load chapters')

    return response.data as Chapter[]
  },

  async getLatestChapter(): Promise<Chapter> {
    const response = await axios.get(`/api/chapters?_sort=-chapterId&limit=9000`)
    if (response.status != 200) return Promise.reject('failed to load chapters')

    const chapters = response.data as Chapter[]

    return chapters[0]
  },

  async addNewChapter(): Promise<Chapter> {
    const lastChapter = await this.getLatestChapter()

    if (lastChapter == null) {
      console.log('no last chapter, too bad')
      return Promise.reject('Error fetching last chapter.')
    }

    const newChapter: Chapter = {
      id: undefined,
      chapterId: lastChapter.chapterId + 1,
      description: 'New Chapter description',
      title: 'New Chapter',
      languageCode: getLanguageCode(Language.English)
    }

    const newChapterResponse = await axios.post(`/api/chapters`, newChapter)

    if (newChapterResponse.status >= 300) {
      console.log('failed to create chapter')
      return Promise.reject('Failed to create new chapter')
    }

    return newChapter
  },

  async addChapter(chapterId: number, language: Language) {
    const newChapter: Chapter = {
      id: undefined,
      chapterId: chapterId,
      languageCode: getLanguageCode(language),
      title: '',
      description: ''
    }

    const newChapterResponse = await axios.post(`/api/chapters`, newChapter)

    if (newChapterResponse.status >= 300) {
      console.log('failed to create chapter')
      return Promise.reject('Failed to create new chapter')
    }
  },

  async updateChapterTitle(chapterId: Number, newTitle: string) {
    const toUpdateChapter = (await axios.get(`/api/chapters?chapterId=${chapterId}`)).data[0] as Chapter
    toUpdateChapter.title = newTitle
    await axios.put(`/api/chapters/${toUpdateChapter.id}`, toUpdateChapter)
  },

  async updateChapterLocalization(chapterId: number, language:Language, newTitle: string, newDescription: string): Promise<Chapter> {
    const toUpdateChapter = (await axios.get(`/api/chapters?chapterId=${chapterId}&languageCode=${getLanguageCode(language)}`)).data[0] as Chapter
    toUpdateChapter.title = newTitle
    toUpdateChapter.description = newDescription
    await axios.put(`/api/chapters/${toUpdateChapter.id}`, toUpdateChapter)
    return toUpdateChapter
  },

  async getChapterForLanguage(chapterId: number, language: Language): Promise<Chapter> {
    let response = await axios.get(`/api/chapters?chapterId=${chapterId}&languageCode=${getLanguageCode(language)}`)
    const chapter:Chapter|undefined = response.data[0] as Chapter
    if (response.status == 404 || chapter == undefined) {
      await this.addChapter(chapterId, language)
      response = await axios.get(`/api/chapters?chapterId=${chapterId}&languageCode=${getLanguageCode(language)}`)
    }

    return response.data[0]
  },
  async fixChapters() {
    const all = await this.getAllChapters()
    for (const chapter of all) {
      const toUpdateChapter = (await axios.get(`/api/chapters/${chapter.id}`)).data as Chapter
      toUpdateChapter.languageCode = ''
      await axios.put(`/api/chapters/${chapter.id}`, toUpdateChapter)
    }
  }
}
