import { initiatePasswordReset } from '@/nodemailer/route';
import { NextResponse } from 'next/server';
import { ForgotPasswordFormSchema } from '../../zodscheme/zodForgotResetPassword/route';

export const runtime = 'nodejs';
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validationResult = ForgotPasswordFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors[0].message },
                { status: 400 }
            );
        }
        const {email} = await validationResult.data;
        const result = await initiatePasswordReset(email);
        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}