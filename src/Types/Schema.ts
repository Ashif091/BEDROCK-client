import {z} from "zod"

export const signUpSchema = z
  .object({
    fullname: z
      .string()
      .transform((fullname) => fullname.trim())
      .refine((fullname) => fullname.length >= 2, {
        message:
          "Full name must have at least  2 characters after removing spaces",
      })
      .refine((fullname) => /^[a-zA-Z\s]*$/.test(fullname), {
        message: "Full name must not contain numbers",
      }),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(
        8,
        "Password must have at least 8 characters with alphanumber combination"
      )
      .refine((password) => /[A-Za-z][0-9]/.test(password), {
        message: "Password must contain at least one letter and number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type LoginFormData = z.infer<typeof loginSchema>;