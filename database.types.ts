export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      challenge_members: {
        Row: {
          challenge_id: string
          joined_at: string
          member_id: number
          profile_id: string
          sort_seq: number
        }
        Insert: {
          challenge_id: string
          joined_at?: string
          member_id?: never
          profile_id: string
          sort_seq?: number
        }
        Update: {
          challenge_id?: string
          joined_at?: string
          member_id?: never
          profile_id?: string
          sort_seq?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_members_challenge_id_challenges_challenge_id_fk"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["challenge_id"]
          },
          {
            foreignKeyName: "challenge_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      challenge_submits: {
        Row: {
          challenge_id: string
          profile_id: string
          sort_seq: number
          submit_ctt: string
          submit_id: number
          submitted_at: string
        }
        Insert: {
          challenge_id: string
          profile_id: string
          sort_seq?: number
          submit_ctt: string
          submit_id?: never
          submitted_at?: string
        }
        Update: {
          challenge_id?: string
          profile_id?: string
          sort_seq?: number
          submit_ctt?: string
          submit_id?: never
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submits_challenge_id_challenges_challenge_id_fk"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["challenge_id"]
          },
          {
            foreignKeyName: "challenge_submits_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_ctt: string
          challenge_id: string
          challenge_ttl: string
          created_at: string
          end_date: string
          max_member_cnt: number
          now_member_cnt: number
          start_date: string
          updated_at: string
        }
        Insert: {
          challenge_ctt: string
          challenge_id?: string
          challenge_ttl: string
          created_at?: string
          end_date: string
          max_member_cnt: number
          now_member_cnt?: number
          start_date: string
          updated_at?: string
        }
        Update: {
          challenge_ctt?: string
          challenge_id?: string
          challenge_ttl?: string
          created_at?: string
          end_date?: string
          max_member_cnt?: number
          now_member_cnt?: number
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          marketing_consent: boolean
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          marketing_consent?: boolean
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          marketing_consent?: boolean
          name?: string
          profile_id?: string
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
      setting: {
        Row: {
          color_blind_mode: boolean
          created_at: string
          font_size: string
          profile_id: string
          theme: string
          updated_at: string
        }
        Insert: {
          color_blind_mode?: boolean
          created_at?: string
          font_size?: string
          profile_id: string
          theme?: string
          updated_at?: string
        }
        Update: {
          color_blind_mode?: boolean
          created_at?: string
          font_size?: string
          profile_id?: string
          theme?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "setting_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      sns_profiles: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          profile_id: string
          target_type: Database["public"]["Enums"]["target_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          profile_id: string
          target_type: Database["public"]["Enums"]["target_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          profile_id?: string
          target_type?: Database["public"]["Enums"]["target_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sns_profiles_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      thread_keywords: {
        Row: {
          created_at: string
          keyword_id: number
          thread_id: number
        }
        Insert: {
          created_at?: string
          keyword_id: number
          thread_id: number
        }
        Update: {
          created_at?: string
          keyword_id?: number
          thread_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "thread_keywords_keyword_id_keywords_keyword_id_fk"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["keyword_id"]
          },
          {
            foreignKeyName: "thread_keywords_thread_id_threads_thread_id_fk"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      thread_media: {
        Row: {
          created_at: string
          file_size: number
          media_id: number
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          original_filename: string
          profile_id: string
          public_url: string
          storage_path: string
          thread_id: number
        }
        Insert: {
          created_at?: string
          file_size: number
          media_id?: never
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          original_filename: string
          profile_id: string
          public_url: string
          storage_path: string
          thread_id: number
        }
        Update: {
          created_at?: string
          file_size?: number
          media_id?: never
          media_type?: Database["public"]["Enums"]["media_type"]
          mime_type?: string
          original_filename?: string
          profile_id?: string
          public_url?: string
          storage_path?: string
          thread_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "thread_media_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "thread_media_thread_id_threads_thread_id_fk"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      thread_properties: {
        Row: {
          created_at: string
          property_id: number
          thread_id: number
        }
        Insert: {
          created_at?: string
          property_id: number
          thread_id: number
        }
        Update: {
          created_at?: string
          property_id?: number
          thread_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "thread_properties_property_id_properties_property_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "thread_properties_thread_id_threads_thread_id_fk"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      threads: {
        Row: {
          comment_cnt: number
          created_at: string
          like_cnt: number
          now_follow_cnt: number
          profile_id: string | null
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
          like_cnt?: number
          now_follow_cnt?: number
          profile_id?: string | null
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
          like_cnt?: number
          now_follow_cnt?: number
          profile_id?: string | null
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
            foreignKeyName: "threads_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
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
      user_insights: {
        Row: {
          created_at: string
          end_time: string
          insight_id: number
          metric_name: string
          metric_type: string
          period: string
          profile_id: string
          thread_id: number
          value: number
        }
        Insert: {
          created_at?: string
          end_time: string
          insight_id?: never
          metric_name: string
          metric_type: string
          period: string
          profile_id: string
          thread_id: number
          value: number
        }
        Update: {
          created_at?: string
          end_time?: string
          insight_id?: never
          metric_name?: string
          metric_type?: string
          period?: string
          profile_id?: string
          thread_id?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_insights_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      user_interest_keywords: {
        Row: {
          created_at: string
          is_active: boolean
          keyword: string
          keyword_id: number
          profile_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          keyword: string
          keyword_id?: never
          profile_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          keyword?: string
          keyword_id?: never
          profile_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interest_keywords_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      user_metrics: {
        Row: {
          last_updated: string
          metric_id: number
          metric_name: string
          profile_id: string
          total_value: number
        }
        Insert: {
          last_updated?: string
          metric_id?: never
          metric_name: string
          profile_id: string
          total_value: number
        }
        Update: {
          last_updated?: string
          metric_id?: never
          metric_name?: string
          profile_id?: string
          total_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_metrics_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
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
      media_type: "image" | "video"
      notification_type: "thread" | "X" | "following" | "challenge"
      property_type: "mood" | "work"
      target_type: "thread" | "X"
      trend_type: "trending" | "topic" | "users" | "hot"
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
      media_type: ["image", "video"],
      notification_type: ["thread", "X", "following", "challenge"],
      property_type: ["mood", "work"],
      target_type: ["thread", "X"],
      trend_type: ["trending", "topic", "users", "hot"],
    },
  },
} as const
