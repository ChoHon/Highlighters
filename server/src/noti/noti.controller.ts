import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, UseGuards, Post, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { NotiService } from './noti.service';
import { CreateNotiDto, DeleteNotiDto, ShowNotiDto } from './dto/noti.dto';
import {
  Delete,
  Put,
  UseFilters,
  UseInterceptors,
  Query,
} from '@nestjs/common/decorators';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';

@Controller('api/noti')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class NotiController {
  constructor(private readonly notiService: NotiService) {}

  // 노티 생성
  @ApiResponse({ status: 200, description: 'success', type: Number })
  @ApiOperation({ summary: '노티 생성' })
  @Post('/create')
  async createNoti(
    @Body() createNotiDto: CreateNotiDto,
    @GetUser() user: User,
  ): Promise<number> {
    createNotiDto.user_email = user.email;
    createNotiDto.group_id = user.group_id;
    createNotiDto.nickname = user.nickname;

    return this.notiService.createNoti(createNotiDto);
  }

  // 노티 리스트를 받아 삭제
  @ApiResponse({ status: 200, description: 'success', type: null })
  @ApiOperation({ summary: '노티 리스트를 받아 삭제' })
  @Delete('/delete')
  async deleteNoti(@Body() deleteNotiDto: DeleteNotiDto[]): Promise<null> {
    console.log(deleteNotiDto);
    return this.notiService.deleteNoti(deleteNotiDto);
  }

  // 웹에서의 노티 조회(송신자, isread true 포함)
  @ApiResponse({ status: 200, description: 'success', type: ShowNotiDto })
  @ApiOperation({ summary: '웹에서의 노티 조회(송신자, isread true 포함)' })
  @Get('/web')
  async findNotiWeb(
    @GetUser() user: User,
    @Query('page') page: number,
    @Query('take') take: number,
  ) {
    return this.notiService.findNotiWeb(user, page, take);
  }

  // 익스텐션에서의 노티 조회(송신자, isread true 제외)
  @ApiResponse({ status: 200, description: 'success', type: ShowNotiDto })
  @ApiOperation({
    summary: '익스텐션에서의 노티 조회(송신자, isread true 제외)',
  })
  @Get('/extension')
  async findNotiExtension(@GetUser() user: User): Promise<ShowNotiDto[]> {
    return this.notiService.findNotiExtension(user);
  }

  // 노티 읽음 처리
  @ApiResponse({ status: 200, description: 'success', type: null })
  @ApiOperation({ summary: '노티 읽음 처리' })
  @Post('/read')
  async readNoti(@Body() noti_id: number): Promise<null> {
    return this.notiService.readNoti(noti_id);
  }

  // 노티 체크(빨간불)
  @ApiResponse({ status: 200, description: 'success', type: Boolean })
  @ApiOperation({ summary: '노티 체크(빨간불)' })
  @Get('/check')
  async checkNewNoti(@GetUser() user: User): Promise<boolean> {
    return this.notiService.checkNewNoti(user);
  }

  @Get('/push')
  async pushNoti(@GetUser() user: User): Promise<boolean> {
    return user.new_noti;
  }
}
