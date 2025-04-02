import { resetPassword } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import { ResetPasswordFormSchema } from '../../zodscheme/zodForgotResetPassword/route';

export const runtime = 'nodejs';
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate request data using Zod schema
        const validationResult = ResetPasswordFormSchema.safeParse(body);
        
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors[0].message },
                { status: 400 }
            );
        }
        
        const { token, newPassword } = validationResult.data;
        const result = await resetPassword(token, newPassword);
        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}