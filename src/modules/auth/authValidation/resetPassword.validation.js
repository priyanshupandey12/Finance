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


const validateResetPassword=(data)=>{
    const result=resetPasswordSchema.safeParse(data);
    if(!result.success){
        const errors=result.error.issues.map(issue=>`${issue.path[0]}: ${issue.message}`).join(", ");
        throw new Error(errors);
    }
    return result.data;
}

module.exports={resetPasswordSchema, validateResetPassword}