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
      orders: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          id: number
          project_name: string | null
          size: number | null
          start_date: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          project_name?: string | null
          size?: number | null
          start_date?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          project_name?: string | null
          size?: number | null
          start_date?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string | null
          orderId: number | null
          price: number
          quantity: number
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          orderId?: number | null
          price?: number
          quantity?: number
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          orderId?: number | null
          price?: number
          quantity?: number
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_orderId_fkey"
            columns: ["orderId"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: number
          last_name: string | null
          user_type: number | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          user_type?: number | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          user_type?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
