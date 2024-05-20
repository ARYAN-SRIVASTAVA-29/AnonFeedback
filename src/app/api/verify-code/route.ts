import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status : 500}
            )
        }

        const isCodeValid = user.verifyCode == code
        const iscodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && iscodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "Account Verified succesfully"
                },
                {status : 200}
            )
        } else if(!iscodeNotExpired){
            
            return Response.json(
                {
                    success: false,
                    message: "Verification Code expired , pls sign-up again to get new code"
                },
                {status : 400}
            )
        } else{ 
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Veroification Code"
                },
                {status : 400}
            )
        }

    } catch (error) {
        console.error("Error Verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Error Verifying User"
            },
            {
                status:500
            }
        )
    }
}
