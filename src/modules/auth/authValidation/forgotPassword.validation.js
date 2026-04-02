const z=require("zod")

const forgotPasswordSchema=z.object({
    email:z.email()
})



module.exports={forgotPasswordSchema}