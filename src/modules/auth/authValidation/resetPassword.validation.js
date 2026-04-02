const z=require("zod");


const resetPasswordSchema=z.object({
    password: z.string()
      .min(8)
      .pattern(/(?=.*[A-Z])(?=.*\d)/)
      .message(
        "Password must contain at least one uppercase letter and one digit",
      )
      .required(),
  });




module.exports={resetPasswordSchema}