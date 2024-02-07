import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {AuthResponse, AuthTokenResponsePassword, createClient} from "@supabase/supabase-js";
import {PrismaService} from "@/prisma/prisma.service";

@Injectable()
export class AuthService {
  private supabase;
  private readonly logger = new Logger(AuthService.name);

  constructor(
      private prisma: PrismaService,
  ) {
    this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
    );
  }

  // 邮箱注册
  async signup(email: string, password: string) {
    const { data: supabaseData, error } = await this.supabase.auth.signUp({ email, password });
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    // 将supabase注册成功返回的信息存入users表
    return this.prisma.public_users.create({
      data: {
        user_id: supabaseData.user.id,
        source: supabaseData.user.app_metadata.provider,
        role: 'reader',
      }
    });
  }

  // 邮箱登录
  async login(email: string, password: string): Promise<AuthTokenResponsePassword> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return data;
  }
}
