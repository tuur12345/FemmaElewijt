export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    role: 'user' | 'admin'
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    name?: string | null
                    role?: 'user' | 'admin'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    role?: 'user' | 'admin'
                    created_at?: string
                }
            }
            activities: {
                Row: {
                    id: string
                    title: string
                    description: string
                    cover_image_url: string | null
                    date: string
                    start_time: string
                    location: string
                    price_text: string
                    max_participants: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    cover_image_url?: string | null
                    date: string
                    start_time: string
                    location: string
                    price_text: string
                    max_participants?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    cover_image_url?: string | null
                    date?: string
                    start_time?: string
                    location?: string
                    price_text?: string
                    max_participants?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            registrations: {
                Row: {
                    id: string
                    activity_id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    activity_id: string
                    user_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    activity_id?: string
                    user_id?: string
                    created_at?: string
                }
            }
            activity_photos: {
                Row: {
                    id: string
                    activity_id: string
                    url: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    activity_id: string
                    url: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    activity_id?: string
                    url?: string
                    created_at?: string
                }
            }
        }
    }
}
