import type { Chapter } from '@/model/Chapter'
import axios from 'axios'

export default {
    async getAllChapters(): Promise<Chapter[]> {
        const response = await axios.get(`/api/chapters?limit=9001`)

        if (response.status != 200) return Promise.reject("failed to load chapters")

        return response.data as Chapter[]
    },

    async getLatestChapter(): Promise<Chapter> {
        const response = await axios.get(`/api/chapters?_sort=-chapterId&limit=9000`)
        if (response.status != 200) return Promise.reject("failed to load chapters")

        const chapters = response.data as Chapter[]

        return chapters[0]
    },

    async addNewChapter(): Promise<Chapter> {
        const lastChapter = await this.getLatestChapter()

        if (lastChapter == null) {
            console.log("no last chapter, too bad")
            return Promise.reject("Error fetching last chapter.");
        }

        const newChapter: Chapter = {
            id: undefined,
            chapterId: lastChapter.chapterId + 1,
            description: "New Chapter description",
            title: "New Chapter"
        }

        const newChapterResponse = await axios.post(`/api/chapters`, newChapter)

        console.log("network response: " + newChapterResponse.data)
        console.log("network response: " + newChapterResponse.status)
        console.log("network response: " + newChapterResponse.statusText)
        if (newChapterResponse.status >= 300) {
            console.log("failed to create chapter")
            return Promise.reject("Failed to create new chapter")
        }

        return newChapter
    },

    async updateChapterTitle(chapterId: Number, newTitle: string) {
        const toUpdateChapter = (await axios.get(`/api/chapters?chapterId=${chapterId}`)).data[0] as Chapter
        toUpdateChapter.title = newTitle
        await axios.put(`/api/chapters/${toUpdateChapter.id}`, toUpdateChapter)
    },

    async updateChapterDescription(chapterId: Number, newDescription: string): Promise<Chapter> {
        const toUpdateChapter = (await axios.get(`/api/chapters?chapterId=${chapterId}`)).data[0] as Chapter
        toUpdateChapter.description = newDescription
        await axios.put(`/api/chapters/${toUpdateChapter.id}`, toUpdateChapter)
        return toUpdateChapter
    }
}