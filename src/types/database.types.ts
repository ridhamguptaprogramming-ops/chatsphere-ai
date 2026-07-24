// These types cover the core tables used by the auth + foundation phase.
// Once the schema is deployed, regenerate the full file with:
//   npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts

export type UserRole = 'user' | 'moderator' | 'admin';
export type PresenceStatus = 'online' | 'offline' | 'away' | 'busy';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          cover_url: string | null;
          bio: string | null;
          phone_number: string | null;
          email: string;
          website: string | null;
          birthday: string | null;
          country: string | null;
          language: string;
          role: UserRole;
          custom_status: string | null;
          is_online: boolean;
          last_seen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          bio?: string | null;
          phone_number?: string | null;
          email: string;
          website?: string | null;
          birthday?: string | null;
          country?: string | null;
          language?: string;
          role?: UserRole;
          custom_status?: string | null;
          is_online?: boolean;
          last_seen?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          type: 'direct' | 'group';
          title: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'direct' | 'group';
          title?: string | null;
          created_by: string;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
        Relationships: [];
      };
      conversation_members: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          is_pinned: boolean;
          is_archived: boolean;
          joined_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          is_pinned?: boolean;
          is_archived?: boolean;
        };
        Update: Partial<Database['public']['Tables']['conversation_members']['Insert']>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string | null;
          reply_to_id: string | null;
          is_edited: boolean;
          is_deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content?: string | null;
          reply_to_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
        Relationships: [];
      };
      devices: {
        Row: {
          id: string;
          user_id: string;
          device_name: string | null;
          device_type: string | null;
          push_token: string | null;
          last_active_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_name?: string | null;
          device_type?: string | null;
          push_token?: string | null;
        };
        Update: Partial<Database['public']['Tables']['devices']['Insert']>;
        Relationships: [];
      };
      user_presence: {
        Row: {
          user_id: string;
          status: PresenceStatus;
          last_changed_at: string;
        };
        Insert: {
          user_id: string;
          status?: PresenceStatus;
        };
        Update: Partial<Database['public']['Tables']['user_presence']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_conversation_member: {
        Args: { conversation_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
