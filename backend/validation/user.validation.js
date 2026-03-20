import z from 'zod'

export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 charaters long')
      .max(12, 'Username should not exceed 12 characters long')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    fullName: z.string().optional(),
    email: z.email('Please provide a valid email'),
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      )
      .or(z.literal('')),
    bio: z.string(),
    link: z.string(),
    profileImg: z.string().or(z.literal(null)),
    coverImg: z.string().or(z.literal(null)),
  })
  .partial()
