export interface SupabaseDatabase {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: {
      boost_status: "open" | "in_progress" | "closed";
    };
  };
}
