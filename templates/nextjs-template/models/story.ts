import { IAppUserDTO } from "./app-user"

export interface Story {
    id: string
    userId: string
    user: IAppUserDTO
    mediaUrl: string
    mediaType: "image" | "video"
    listingId?: string
    createdAt: string
    templateId: number
    title?: string
    description?: string
    views?: number
    clickRate?: number
    completionRate?: number
  }
  