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
      debate_tags: {
        Row: {
          debate_id: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          debate_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          debate_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debate_tags_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debate_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      debates: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          participant1_elo_change: number | null
          participant1_id: string | null
          participant1_votes: number | null
          participant2_elo_change: number | null
          participant2_id: string | null
          participant2_votes: number | null
          status: Database["public"]["Enums"]["debate_status"] | null
          total_votes: number | null
          updated_at: string | null
          voting_end_time: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          participant1_elo_change?: number | null
          participant1_id?: string | null
          participant1_votes?: number | null
          participant2_elo_change?: number | null
          participant2_id?: string | null
          participant2_votes?: number | null
          status?: Database["public"]["Enums"]["debate_status"] | null
          total_votes?: number | null
          updated_at?: string | null
          voting_end_time?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          participant1_elo_change?: number | null
          participant1_id?: string | null
          participant1_votes?: number | null
          participant2_elo_change?: number | null
          participant2_id?: string | null
          participant2_votes?: number | null
          status?: Database["public"]["Enums"]["debate_status"] | null
          total_votes?: number | null
          updated_at?: string | null
          voting_end_time?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debates_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debates_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debates_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      elo_log: {
        Row: {
          change_amount: number
          created_at: string | null
          debate_id: string | null
          id: string
          new_rating: number
          old_rating: number
          user_id: string | null
        }
        Insert: {
          change_amount: number
          created_at?: string | null
          debate_id?: string | null
          id?: string
          new_rating: number
          old_rating: number
          user_id?: string | null
        }
        Update: {
          change_amount?: number
          created_at?: string | null
          debate_id?: string | null
          id?: string
          new_rating?: number
          old_rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elo_log_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elo_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          debate_id: string | null
          id: string
          quoted_message_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          debate_id?: string | null
          id?: string
          quoted_message_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          debate_id?: string | null
          id?: string
          quoted_message_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_quoted_message_id_fkey"
            columns: ["quoted_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          current_rank: Database["public"]["Enums"]["user_rank"] | null
          display_name: string | null
          elo_rating: number | null
          email: string | null
          id: string
          is_pro_league: boolean | null
          location: string | null
          losses: number | null
          total_debates: number | null
          updated_at: string | null
          username: string | null
          wins: number | null
          xp_points: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_rank?: Database["public"]["Enums"]["user_rank"] | null
          display_name?: string | null
          elo_rating?: number | null
          email?: string | null
          id: string
          is_pro_league?: boolean | null
          location?: string | null
          losses?: number | null
          total_debates?: number | null
          updated_at?: string | null
          username?: string | null
          wins?: number | null
          xp_points?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_rank?: Database["public"]["Enums"]["user_rank"] | null
          display_name?: string | null
          elo_rating?: number | null
          email?: string | null
          id?: string
          is_pro_league?: boolean | null
          location?: string | null
          losses?: number | null
          total_debates?: number | null
          updated_at?: string | null
          username?: string | null
          wins?: number | null
          xp_points?: number | null
        }
        Relationships: []
      }
      saved_debates: {
        Row: {
          created_at: string | null
          debate_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          debate_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          debate_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_debates_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_debates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_matches: {
        Row: {
          created_at: string | null
          id: string
          is_matched: boolean | null
          user1_id: string | null
          user1_swiped_right: boolean | null
          user2_id: string | null
          user2_swiped_right: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_matched?: boolean | null
          user1_id?: string | null
          user1_swiped_right?: boolean | null
          user2_id?: string | null
          user2_swiped_right?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_matched?: boolean | null
          user1_id?: string | null
          user1_swiped_right?: boolean | null
          user2_id?: string | null
          user2_swiped_right?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string | null
          debate_id: string | null
          id: string
          vote_for: Database["public"]["Enums"]["vote_type"]
          voter_id: string | null
        }
        Insert: {
          created_at?: string | null
          debate_id?: string | null
          id?: string
          vote_for: Database["public"]["Enums"]["vote_type"]
          voter_id?: string | null
        }
        Update: {
          created_at?: string | null
          debate_id?: string | null
          id?: string
          vote_for?: Database["public"]["Enums"]["vote_type"]
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_log: {
        Row: {
          amount: number
          created_at: string | null
          debate_id: string | null
          id: string
          reason: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          debate_id?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          debate_id?: string | null
          id?: string
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xp_log_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_elo_change: {
        Args: { winner_rating: number; loser_rating: number }
        Returns: Json
      }
    }
    Enums: {
      debate_status: "active" | "ended_private" | "ended_public" | "voting"
      user_rank: "bronze" | "silver" | "gold" | "pro"
      vote_type: "participant1" | "participant2"
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
      debate_status: ["active", "ended_private", "ended_public", "voting"],
      user_rank: ["bronze", "silver", "gold", "pro"],
      vote_type: ["participant1", "participant2"],
    },
  },
} as const
