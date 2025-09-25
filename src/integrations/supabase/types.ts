export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      business_images: {
        Row: {
          alt_text: string | null
          business_id: string | null
          created_at: string | null
          id: string
          image_url: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_images_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          accepts_online_orders: boolean | null
          address: string | null
          business_type: Database["public"]["Enums"]["business_type"] | null
          category_id: string | null
          cover_image_url: string | null
          created_at: string | null
          delivery_available: boolean | null
          description_en: string | null
          description_tr: string | null
          email: string | null
          established_year: number | null
          id: string
          languages: string[] | null
          location_id: string | null
          logo_url: string | null
          min_order_amount: number | null
          name_en: string | null
          name_tr: string
          owner_name: string | null
          payment_methods:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          phone: string | null
          shop_number: string | null
          social_media: Json | null
          status: Database["public"]["Enums"]["business_status"] | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
          working_hours: Json | null
        }
        Insert: {
          accepts_online_orders?: boolean | null
          address?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          description_en?: string | null
          description_tr?: string | null
          email?: string | null
          established_year?: number | null
          id?: string
          languages?: string[] | null
          location_id?: string | null
          logo_url?: string | null
          min_order_amount?: number | null
          name_en?: string | null
          name_tr: string
          owner_name?: string | null
          payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          phone?: string | null
          shop_number?: string | null
          social_media?: Json | null
          status?: Database["public"]["Enums"]["business_status"] | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
          working_hours?: Json | null
        }
        Update: {
          accepts_online_orders?: boolean | null
          address?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          description_en?: string | null
          description_tr?: string | null
          email?: string | null
          established_year?: number | null
          id?: string
          languages?: string[] | null
          location_id?: string | null
          logo_url?: string | null
          min_order_amount?: number | null
          name_en?: string | null
          name_tr?: string
          owner_name?: string | null
          payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          phone?: string | null
          shop_number?: string | null
          social_media?: Json | null
          status?: Database["public"]["Enums"]["business_status"] | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name_en: string
          name_tr: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name_en: string
          name_tr: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name_en?: string
          name_tr?: string
        }
        Relationships: []
      }
      featured_businesses: {
        Row: {
          business_id: string
          created_at: string
          featured_until: string | null
          id: string
          is_active: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          featured_until?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          featured_until?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_businesses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_tr: string | null
          id: string
          image_url: string | null
          name_en: string
          name_tr: string
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_tr?: string | null
          id?: string
          image_url?: string | null
          name_en: string
          name_tr: string
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_tr?: string | null
          id?: string
          image_url?: string | null
          name_en?: string
          name_tr?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          business_id: string | null
          created_at: string | null
          description_en: string | null
          description_tr: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          min_wholesale_quantity: number | null
          name_en: string | null
          name_tr: string
          price: number | null
          sku: string | null
          stock_quantity: number | null
          updated_at: string | null
          wholesale_price: number | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          description_en?: string | null
          description_tr?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          min_wholesale_quantity?: number | null
          name_en?: string | null
          name_tr: string
          price?: number | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          wholesale_price?: number | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          description_en?: string | null
          description_tr?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          min_wholesale_quantity?: number | null
          name_en?: string | null
          name_tr?: string
          price?: number | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_id: string | null
          created_at: string | null
          full_name: string | null
          id: string
          preferences: Json | null
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_first_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      business_status: "active" | "inactive" | "pending"
      business_type: "retail" | "wholesale" | "both"
      payment_method: "cash" | "credit_card" | "bank_transfer" | "crypto"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      business_status: ["active", "inactive", "pending"],
      business_type: ["retail", "wholesale", "both"],
      payment_method: ["cash", "credit_card", "bank_transfer", "crypto"],
    },
  },
} as const
