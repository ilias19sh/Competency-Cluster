import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    // Le controller ne fait que recevoir la requete HTTP et deleguer la logique au service.
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  register(@Body() body: { email: string; password: string; confirmPassword: string }) {
    // Meme principe ici : le service gere toutes les verifications et la creation du user.
    return this.authService.register(body.email, body.password, body.confirmPassword);
  }

  @Post('profile')
  completeProfile(
    @Body()
    body: {
      userId: number;
      firstName: string;
      lastName: string;
      phone: string;
      isTeacher: boolean;
      program?: string | null;
      studyLevel?: string | null;
    },
  ) {
    return this.authService.completeProfile(
      body.userId,
      body.firstName,
      body.lastName,
      body.phone,
      body.isTeacher,
      body.program,
      body.studyLevel,
    );
  }
}
