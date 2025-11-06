// Generate a random color for a user
export const generateUserColor = (): string => {
  const colors = [
    "#3B82F6", // blue
    "#EF4444", // red
    "#10B981", // green
    "#F59E0B", // amber
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#06B6D4", // cyan
    "#F97316", // orange
    "#14B8A6", // teal
    "#6366F1", // indigo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate a unique user ID
export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create user identity from localStorage
export const getUserIdentity = (): { id: string; name: string; color: string } | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("drAwIt_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

// Save user identity to localStorage
export const saveUserIdentity = (id: string, name: string, color: string): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem("drAwIt_user", JSON.stringify({ id, name, color }));
};

// Clear user identity from localStorage
export const clearUserIdentity = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("drAwIt_user");
};
