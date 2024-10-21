import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Testa disponibilidade da aplicação' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Get()
  check() {
    return { status: 'OK' };
  }
}
