const z=require("zod")

const forgotPasswordSchema=z.object({
    email:z.email().required()
})

const validateForgotPassword=(data)=>{
    const result=forgotPasswordSchema.safeParse(data);
    if(!result.success){
        const errors=result.error.issues.map(issue=>`${issue.path[0]}: ${issue.message}`).join(", ");
        throw new Error(errors);
    }
    return result.data;
}

module.exports={forgotPasswordSchema, validateForgotPassword}