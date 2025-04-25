import { UserService } from './../user/user.service';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService, // Inyectar el servicio de autenticación
  ) {}

  @Post('register')
  async register(@Body() body: {cedula: string, email:string, nombre:string, apellido:string, password: string, rol:string, id_cementerio_pert: Cementerio}) {
    return this.userService.create(body); // Llama al servicio de usuario para crear un nuevo usuario
  }

  @Post('login')
  async login(@Body() body: { cedula: string, password: string }) {
    const user = await this.userService.validateUser(body.cedula, body.password); // Llama al servicio de usuario para validar el usuario
    if (!user) {
      return { error: 'Usuario o contraseña incorrectos' };
    }
    return this.authService.login(user); // Llama al servicio de autenticación para generar el token
  }

  @Post('Logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    await this.authService.logout(req.user.cedula, req.headers.authorization.split(' ')[1]);
    return { message: 'Sesión cerrada correctamente' };
  }

  @Post('Profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
