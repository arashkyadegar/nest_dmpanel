import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PasswordLinksService } from './password-links.service';
import { CreatePasswordLinkDto } from './dto/create-password-link.dto';
import { UpdatePasswordLinkDto } from './dto/update-password-link.dto';
import { EnvConfigService } from 'src/env-config/env-config.service';

@Controller('password-links')
export class PasswordLinksController {
  constructor(
    private readonly passwordLinksService: PasswordLinksService,
    private envConfigService: EnvConfigService,
  ) {}

  @Post()
  create(
    @Body() createPasswordLinkDto: CreatePasswordLinkDto,
    @Req() req: any,
  ) {
    createPasswordLinkDto.userId = req.userId;
    return this.passwordLinksService.create(createPasswordLinkDto);
  }

  @Get()
  findAll() {
    return this.passwordLinksService.findAll();
  }
  @Get('/findbyuserid')
  findAllByUserId(@Req() req: any, @Query() query: Record<string, any>) {
    const { page = 1 } = query; // Set defaults if not provided
    const userId = req.userId; //this is extracted from cookie in cookieMiddleware
    const pageSize = this.envConfigService.getPageSize();
    return this.passwordLinksService.findAllByUserId(page, pageSize, userId);
  }

  @Get('/unlock')
  unlockPasswordLink(@Req() req: any, @Query() query: Record<string, any>) {
    const { page = 1 } = query; // Set defaults if not provided
    const userId = req.userId; //this is extracted from cookie in cookieMiddleware
    const pageSize = this.envConfigService.getPageSize();
    return this.passwordLinksService.findAllByUserId(page, pageSize, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordLinksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePasswordLinkDto: UpdatePasswordLinkDto,
  ) {
    return this.passwordLinksService.update(+id, updatePasswordLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordLinksService.remove(+id);
  }

  // @Redirect()
  @Get('/passwordlink/:shortCode')
  async redirectToTarget(
    @Param('shortCode') shortCode: string,
    @Res() res: any,
  ) {
    const targetLink =
      await this.passwordLinksService.findPasswordLinkbyShortCode(shortCode);
    if (targetLink) {
      // const now = new Date();
      if (targetLink.isSingleUse && targetLink.isUsed) {
        return res
          .status(HttpStatus.GONE)
          .json({ message: 'This link has expired.' });
      } else {
        // we must increase visitcount each time link is visited
        await this.passwordLinksService.patchPasswordLink(
          targetLink._id.toString(),
          {
            visitCount: targetLink.visitCount + 1,
            isUsed: targetLink.isSingleUse && !targetLink.isUsed,
          },
        );

        return res.status(HttpStatus.FOUND).json(targetLink);
      }
    }
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: 'Shortlink not found' });
  }
}
