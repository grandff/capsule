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
      keywords: {
        Row: {
          created_at: string
          keyword: string
          keyword_id: number
          sort_seq: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          keyword: string
          keyword_id?: never
          sort_seq?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          keyword?: string
          keyword_id?: never
          sort_seq?: number
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          notification_content: string
          notification_id: number
          notification_type: Database["public"]["Enums"]["notification_type"]
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          notification_content: string
          notification_id?: never
          notification_type: Database["public"]["Enums"]["notification_type"]
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          notification_content?: string
          notification_id?: never
          notification_type?: Database["public"]["Enums"]["notification_type"]
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      payments: {
        Row: {
          approved_at: string
          created_at: string
          metadata: Json
          order_id: string
          order_name: string
          payment_id: number
          payment_key: string
          raw_data: Json
          receipt_url: string
          requested_at: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved_at: string
          created_at?: string
          metadata: Json
          order_id: string
          order_name: string
          payment_id?: never
          payment_key: string
          raw_data: Json
          receipt_url: string
          requested_at: string
          status: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string
          created_at?: string
          metadata?: Json
          order_id?: string
          order_name?: string
          payment_id?: never
          payment_key?: string
          raw_data?: Json
          receipt_url?: string
          requested_at?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          name: string
          noti_yn: string | null
          profile_id: string
          threads_access_token: string | null
          threads_connect: boolean | null
          threads_expires_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          name: string
          noti_yn?: string | null
          profile_id: string
          threads_access_token?: string | null
          threads_connect?: boolean | null
          threads_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          name?: string
          noti_yn?: string | null
          profile_id?: string
          threads_access_token?: string | null
          threads_connect?: boolean | null
          threads_expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          created_at: string
          property: string
          property_id: number
          property_type: Database["public"]["Enums"]["property_type"]
          sort_seq: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          property: string
          property_id?: never
          property_type: Database["public"]["Enums"]["property_type"]
          sort_seq?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          property?: string
          property_id?: never
          property_type?: Database["public"]["Enums"]["property_type"]
          sort_seq?: number
          updated_at?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          comment_cnt: number
          created_at: string
          keyword_id: number | null
          like_cnt: number
          profile_id: string | null
          property_id: number | null
          result_id: string | null
          send_flag: boolean
          share_cnt: number
          short_text: string
          target_type: Database["public"]["Enums"]["target_type"]
          thread: string
          thread_id: number
          updated_at: string
          view_cnt: number
        }
        Insert: {
          comment_cnt?: number
          created_at?: string
          keyword_id?: number | null
          like_cnt?: number
          profile_id?: string | null
          property_id?: number | null
          result_id?: string | null
          send_flag?: boolean
          share_cnt?: number
          short_text: string
          target_type: Database["public"]["Enums"]["target_type"]
          thread: string
          thread_id?: never
          updated_at?: string
          view_cnt?: number
        }
        Update: {
          comment_cnt?: number
          created_at?: string
          keyword_id?: number | null
          like_cnt?: number
          profile_id?: string | null
          property_id?: number | null
          result_id?: string | null
          send_flag?: boolean
          share_cnt?: number
          short_text?: string
          target_type?: Database["public"]["Enums"]["target_type"]
          thread?: string
          thread_id?: never
          updated_at?: string
          view_cnt?: number
        }
        Relationships: [
          {
            foreignKeyName: "threads_keyword_id_keywords_keyword_id_fk"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["keyword_id"]
          },
          {
            foreignKeyName: "threads_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "threads_property_id_properties_property_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["property_id"]
          },
        ]
      }
      trend_keywords: {
        Row: {
          created_at: string
          sort_seq: number
          trend_keyword: string
          trend_keyword_id: number
          trend_keyword_rank: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          sort_seq: number
          trend_keyword: string
          trend_keyword_id?: never
          trend_keyword_rank: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          sort_seq?: number
          trend_keyword?: string
          trend_keyword_id?: never
          trend_keyword_rank?: number
          updated_at?: string
        }
        Relationships: []
      }
      trends: {
        Row: {
          created_at: string
          trend_content: string
          trend_date: string
          trend_id: number
          trend_keyword_id: number | null
          trend_rank: number
          trend_type: Database["public"]["Enums"]["trend_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          trend_content: string
          trend_date: string
          trend_id?: never
          trend_keyword_id?: number | null
          trend_rank: number
          trend_type: Database["public"]["Enums"]["trend_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          trend_content?: string
          trend_date?: string
          trend_id?: never
          trend_keyword_id?: number | null
          trend_rank?: number
          trend_type?: Database["public"]["Enums"]["trend_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trends_trend_keyword_id_trend_keywords_trend_keyword_id_fk"
            columns: ["trend_keyword_id"]
            isOneToOne: false
            referencedRelation: "trend_keywords"
            referencedColumns: ["trend_keyword_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      notification_type: "thread" | "X" | "following" | "challenge"
      property_type: "mood" | "work" | "tone"
      target_type: "thread" | "X"
      trend_type: "trending" | "topic" | "users" | "hot"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_type: ["thread", "X", "following", "challenge"],
      property_type: ["mood", "work", "tone"],
      target_type: ["thread", "X"],
      trend_type: ["trending", "topic", "users", "hot"],
    },
  },
} as const
