const z = require("zod");

const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter and one digit",
    }),
});


module.exports = { loginSchema};