// These types cover the core tables used by the auth + foundation phase.
// Once the schema is deployed, regenerate the full file with:
//   npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts

export type UserRole = 'user' | 'moderator' | 'admin';
export type PresenceStatus = 'online' | 'offline' | 'away' | 'busy';
export type ConversationType = 'direct' | 'group';
export type MemberRole = 'member' | 'moderator' | 'admin' | 'owner';
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'gif' | 'system' | 'call';
export type DeliveryStatus = 'sent' | 'delivered' | 'read';
export type FriendRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

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
          privacy_settings: Record<string, unknown>;
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
          type: ConversationType;
          title: string | null;
          avatar_url: string | null;
          created_by: string;
          last_message_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: ConversationType;
          title?: string | null;
          avatar_url?: string | null;
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
          role: MemberRole;
          is_pinned: boolean;
          is_archived: boolean;
          is_muted: boolean;
          last_read_message_id: string | null;
          joined_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          role?: MemberRole;
          is_pinned?: boolean;
          is_archived?: boolean;
          is_muted?: boolean;
          last_read_message_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['conversation_members']['Insert']>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          type: MessageType;
          content: string | null;
          metadata: Record<string, unknown>;
          reply_to_id: string | null;
          forwarded_from_id: string | null;
          is_edited: boolean;
          is_deleted: boolean;
          deleted_for_everyone: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          type?: MessageType;
          content?: string | null;
          metadata?: Record<string, unknown>;
          reply_to_id?: string | null;
          forwarded_from_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
        Relationships: [];
      };
      message_reactions: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          emoji: string;
        };
        Update: Partial<Database['public']['Tables']['message_reactions']['Insert']>;
        Relationships: [];
      };
      read_receipts: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          status: DeliveryStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          status?: DeliveryStatus;
        };
        Update: Partial<Database['public']['Tables']['read_receipts']['Insert']>;
        Relationships: [];
      };
      typing_status: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          is_typing: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          is_typing?: boolean;
        };
        Update: Partial<Database['public']['Tables']['typing_status']['Insert']>;
        Relationships: [];
      };
      friend_requests: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          status: FriendRequestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          status?: FriendRequestStatus;
        };
        Update: Partial<Database['public']['Tables']['friend_requests']['Insert']>;
        Relationships: [];
      };
      blocked_users: {
        Row: {
          id: string;
          blocker_id: string;
          blocked_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blocker_id: string;
          blocked_id: string;
        };
        Update: Partial<Database['public']['Tables']['blocked_users']['Insert']>;
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
      is_moderator_or_above: {
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

