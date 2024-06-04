export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      catalog_OLD: {
        Row: {
          category: string | null
          client: string | null
          cost: number | null
          description: string | null
          id: string
          notes: string | null
          revenue: number | null
          SKU: number | null
          UOM: string | null
        }
        Insert: {
          category?: string | null
          client?: string | null
          cost?: number | null
          description?: string | null
          id?: string
          notes?: string | null
          revenue?: number | null
          SKU?: number | null
          UOM?: string | null
        }
        Update: {
          category?: string | null
          client?: string | null
          cost?: number | null
          description?: string | null
          id?: string
          notes?: string | null
          revenue?: number | null
          SKU?: number | null
          UOM?: string | null
        }
        Relationships: []
      }
      "catalog-pricing": {
        Row: {
          _hd_extract_time: string | null
          _hd_price: number | null
          _hd_SKU: string | null
          _lowes_extract_time: string | null
          _lowes_price: number | null
          _lowes_SKU: string | null
          id: number
        }
        Insert: {
          _hd_extract_time?: string | null
          _hd_price?: number | null
          _hd_SKU?: string | null
          _lowes_extract_time?: string | null
          _lowes_price?: number | null
          _lowes_SKU?: string | null
          id?: number
        }
        Update: {
          _hd_extract_time?: string | null
          _hd_price?: number | null
          _hd_SKU?: string | null
          _lowes_extract_time?: string | null
          _lowes_price?: number | null
          _lowes_SKU?: string | null
          id?: number
        }
        Relationships: []
      }
      conversation_users: {
        Row: {
          conversation: number
          created_at: string
          id: number
          user: string
        }
        Insert: {
          conversation: number
          created_at?: string
          id?: number
          user: string
        }
        Update: {
          conversation?: number
          created_at?: string
          id?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_conversation_users_conversation_fkey"
            columns: ["conversation"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_conversation_users_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          contractor_id: string | null
          created_at: string | null
          date_time: string | null
          id: number
          location: unknown | null
          name: string | null
          order_id: number | null
          type: string | null
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string | null
          date_time?: string | null
          id?: number
          location?: unknown | null
          name?: string | null
          order_id?: number | null
          type?: string | null
        }
        Update: {
          contractor_id?: string | null
          created_at?: string | null
          date_time?: string | null
          id?: number
          location?: unknown | null
          name?: string | null
          order_id?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      "Homedepot-PriceHistory": {
        Row: {
          created_at: string
          id: number
          Price: number | null
          SKU: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          Price?: number | null
          SKU?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          Price?: number | null
          SKU?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          order: number | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          order?: number | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          order?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_invoices_order_fkey"
            columns: ["order"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      line_items: {
        Row: {
          cost_category: string | null
          cost_code: number | null
          created_at: string
          description: string | null
          id: number
          material_Id: number | null
          name: string
          name_clean: string
          notes: string | null
          options: string | null
          uom: string | null
        }
        Insert: {
          cost_category?: string | null
          cost_code?: number | null
          created_at?: string
          description?: string | null
          id?: number
          material_Id?: number | null
          name: string
          name_clean: string
          notes?: string | null
          options?: string | null
          uom?: string | null
        }
        Update: {
          cost_category?: string | null
          cost_code?: number | null
          created_at?: string
          description?: string | null
          id?: number
          material_Id?: number | null
          name?: string
          name_clean?: string
          notes?: string | null
          options?: string | null
          uom?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_lineitems_MaterialId_fkey"
            columns: ["material_Id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      Lowes_PriceHistory: {
        Row: {
          created_at: string
          id: number
          Price: number | null
          SKU: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          Price?: number | null
          SKU?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          Price?: number | null
          SKU?: string | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          description: string | null
          group: string | null
          id: number
          link_to_material: string | null
          manufacturer: string | null
          model: string | null
          name: string | null
          retail_price: number | null
          sku: string | null
          supplier: string | null
          unit_of_measurement: string | null
        }
        Insert: {
          description?: string | null
          group?: string | null
          id: number
          link_to_material?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string | null
          retail_price?: number | null
          sku?: string | null
          supplier?: string | null
          unit_of_measurement?: string | null
        }
        Update: {
          description?: string | null
          group?: string | null
          id?: number
          link_to_material?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string | null
          retail_price?: number | null
          sku?: string | null
          supplier?: string | null
          unit_of_measurement?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          conversation: number | null
          created_at: string
          id: number
          sent_by_user: string | null
          text: string | null
        }
        Insert: {
          conversation?: number | null
          created_at?: string
          id?: number
          sent_by_user?: string | null
          text?: string | null
        }
        Update: {
          conversation?: number | null
          created_at?: string
          id?: number
          sent_by_user?: string | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_messages_conversation_fkey"
            columns: ["conversation"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_messages_sent_by_user_fkey"
            columns: ["sent_by_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          message: string | null
          notifier: string | null
          type: string | null
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          notifier?: string | null
          type?: string | null
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          notifier?: string | null
          type?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_notifier_fkey"
            columns: ["notifier"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          item_id: number
          notes: string | null
          order_id: number
          price: number | null
          quantity: number
          room: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          item_id: number
          notes?: string | null
          order_id: number
          price?: number | null
          quantity: number
          room?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          item_id?: number
          notes?: string | null
          order_id?: number
          price?: number | null
          quantity?: number
          room?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_itemorders_ItemId_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "line_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_itemorders_OrderId_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          access_instructions: string | null
          address: string | null
          change_order: boolean
          closed: string | null
          cost: number | null
          created_at: string | null
          delivered: string | null
          description: string | null
          fulfilled: string | null
          id: number
          installed: string | null
          location: unknown | null
          order_id: number
          organization: string | null
          processed: string | null
          project_name: string | null
          size: number | null
          start_date: string | null
          status: string | null
          trade: string | null
        }
        Insert: {
          access_instructions?: string | null
          address?: string | null
          change_order?: boolean
          closed?: string | null
          cost?: number | null
          created_at?: string | null
          delivered?: string | null
          description?: string | null
          fulfilled?: string | null
          id?: number
          installed?: string | null
          location?: unknown | null
          order_id?: number
          organization?: string | null
          processed?: string | null
          project_name?: string | null
          size?: number | null
          start_date?: string | null
          status?: string | null
          trade?: string | null
        }
        Update: {
          access_instructions?: string | null
          address?: string | null
          change_order?: boolean
          closed?: string | null
          cost?: number | null
          created_at?: string | null
          delivered?: string | null
          description?: string | null
          fulfilled?: string | null
          id?: number
          installed?: string | null
          location?: unknown | null
          order_id?: number
          organization?: string | null
          processed?: string | null
          project_name?: string | null
          size?: number | null
          start_date?: string | null
          status?: string | null
          trade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_organization_fkey"
            columns: ["organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      "product-confirm": {
        Row: {
          created_at: string
          event: number | null
          id: number
          name: string | null
          quantity: number | null
          status: string | null
        }
        Insert: {
          created_at?: string
          event?: number | null
          id?: number
          name?: string | null
          quantity?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string
          event?: number | null
          id?: number
          name?: string | null
          quantity?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product-confirm_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          orderId: number | null
          price: number
          quantity: number
          retail_price: number | null
          size: number | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          orderId?: number | null
          price: number
          quantity?: number
          retail_price?: number | null
          size?: number | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          orderId?: number | null
          price?: number
          quantity?: number
          retail_price?: number | null
          size?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          markets: string[] | null
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          markets?: string[] | null
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          markets?: string[] | null
          phone?: string | null
        }
        Relationships: []
      }
      "skill-trades": {
        Row: {
          created_at: string
          expiration_date: string | null
          id: number
          is_licensed: boolean
          name: string | null
          user: string | null
        }
        Insert: {
          created_at?: string
          expiration_date?: string | null
          id?: number
          is_licensed: boolean
          name?: string | null
          user?: string | null
        }
        Update: {
          created_at?: string
          expiration_date?: string | null
          id?: number
          is_licensed?: boolean
          name?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_skill-trades_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_organizations: {
        Row: {
          created_at: string
          id: number
          organization: string | null
          role: Database["public"]["Enums"]["role"] | null
          type: Database["public"]["Enums"]["user_type"] | null
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          organization?: string | null
          role?: Database["public"]["Enums"]["role"] | null
          type?: Database["public"]["Enums"]["user_type"] | null
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          organization?: string | null
          role?: Database["public"]["Enums"]["role"] | null
          type?: Database["public"]["Enums"]["user_type"] | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_organizations_organization_fkey"
            columns: ["organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organizations_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trades: {
        Row: {
          created_at: string
          id: number
          licensed: boolean | null
          trade_name: string | null
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          licensed?: boolean | null
          trade_name?: string | null
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          licensed?: boolean | null
          trade_name?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_trades_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      warranties: {
        Row: {
          contractor_id: string | null
          created_at: string
          id: number
          link: string | null
          name: string | null
          period: number | null
          product_id: number | null
          start_date: string | null
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          id?: number
          link?: string | null
          name?: string | null
          period?: number | null
          product_id?: number | null
          start_date?: string | null
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          id?: number
          link?: string | null
          name?: string | null
          period?: number | null
          product_id?: number | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warranties_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      distance_from_location: {
        Args: {
          lat: number
          long: number
          event_id: number
        }
        Returns: {
          dist_meters: number
        }[]
      }
      get_order_by_id: {
        Args: {
          order_id: number
        }
        Returns: {
          id: number
          customer_id: number
          order_date: string
        }[]
      }
    }
    Enums: {
      role: "admin" | "billing" | "viewer"
      role_enum: "contractor" | "client"
      user_type: "supplier" | "vendor" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
