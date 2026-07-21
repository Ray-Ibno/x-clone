import z from 'zod'

export const signupSchema = z
  .object({
    email: z.email('Please provide a valid email'),
    username: z
      .string('Please provide a username')
      .min(3, 'Username must be at least 3 charaters long')
      .max(12, 'Username should not exceed 12 characters long')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    fullName: z.string('Please provide a full name'),
    password: z
      .string('Please provide a password')
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      ),
    passwordRepeat: z.string('Please provide a repeat password'),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: 'Passwords do not match',
    path: ['passwordRepeat'],
  })

export const loginSchema = z.object({
  email: z.email('Please provide a valid email'),
  password: z.string(1, 'Password is required'),
})
