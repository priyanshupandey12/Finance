const z = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),

  email: z.email(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter and one digit",
    }),

  role: z.enum(["viewer", "analyst", "admin"]).optional(),
});


module.exports = { registerSchema };