export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          handle: string | null;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          handle?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      follows: {
        Row: {
          follower_id: string;
          followee_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          followee_id: string;
          created_at?: string;
        };
        Update: Database["public"]["Tables"]["follows"]["Insert"];
      };
      blocks: {
        Row: {
          user_id: string;
          blocked_user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          blocked_user_id: string;
          created_at?: string;
        };
        Update: Database["public"]["Tables"]["blocks"]["Insert"];
      };
      threads: {
        Row: {
          id: string;
          is_group: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          is_group?: boolean;
          created_at?: string;
        };
        Update: Database["public"]["Tables"]["threads"]["Insert"];
      };
      thread_participants: {
        Row: {
          thread_id: string;
          user_id: string;
          last_read_msg_id: string | null;
          joined_at: string;
        };
        Insert: {
          thread_id: string;
          user_id: string;
          last_read_msg_id?: string | null;
          joined_at?: string;
        };
        Update: Database["public"]["Tables"]["thread_participants"]["Insert"];
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          body: string;
          attachments: Json[];
          created_at: string;
          edited_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_id: string;
          body: string;
          attachments?: Json[];
          created_at?: string;
          edited_at?: string | null;
          updated_at?: string;
        };
        Update: Database["public"]["Tables"]["messages"]["Insert"];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_user_id: string | null;
          message_id: string | null;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_user_id?: string | null;
          message_id?: string | null;
          reason: string;
          created_at?: string;
        };
        Update: Database["public"]["Tables"]["reports"]["Insert"];
      };
      game_profiles: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          external_username: string;
          external_id: string | null;
          visibility: string;
          verified: boolean;
          verify_code: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          external_username: string;
          external_id?: string | null;
          visibility?: string;
          verified?: boolean;
          verify_code?: string | null;
          updated_at?: string;
        };
        Update: Database["public"]["Tables"]["game_profiles"]["Insert"];
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          payload?: Json;
          created_at?: string;
        };
        Update: Database["public"]["Tables"]["activities"]["Insert"];
      };
    };
    Functions: {
      search_profiles: {
        Args: { q: string };
        Returns: Array<{
          handle: string | null;
          display_name: string | null;
          bio: string | null;
          rank: number | null;
        }>;
      };
    };
  };
}
