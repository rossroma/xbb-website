import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { AdsService } from '../ads.service';
import { CreateAdsDto } from '../dto/create-ads.dto';
import { UpdateAdsDto } from '../dto/update-ads.dto';
import { QueryAdsDto } from '../dto/query-ads.dto';
import { OperationLog } from '../../logs/decorators/operation-log.decorator';
import { OperationLogInterceptor } from '../../logs/interceptors/operation-log.interceptor';

@Controller('v1/admin/ads')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OperationLogInterceptor)
export class AdminAdsController {
  constructor(private readonly adsService: AdsService) { }

  @Post()
  @RequirePermissions('ads_manage.create')
  @OperationLog({ title: '广告', type: 1, targetFields: ['title'], titlePrefix: '广告：' })
  create(@Body() createAdsDto: CreateAdsDto) {
    return this.adsService.createAds(createAdsDto);
  }

  @Get()
  @RequirePermissions('ads_manage.view')
  findAll(@Query() query: QueryAdsDto) {
    return this.adsService.findAllAds(query);
  }

  @Get(':id')
  @RequirePermissions('ads_manage.view')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adsService.findOneAds(id);
  }

  @Put(':id')
  @RequirePermissions('ads_manage.edit')
  @OperationLog({ title: '广告', type: 2, targetFields: ['title'], titlePrefix: '广告：' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdsDto: UpdateAdsDto,
  ) {
    return this.adsService.updateAds(id, updateAdsDto);
  }

  @Delete(':id')
  @RequirePermissions('ads_manage.delete')
  @OperationLog({ title: '广告', type: 3, targetFields: ['title'], titlePrefix: '广告：' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adsService.findOneAds(id).then((target) =>
      this.adsService.removeAds(id).then(() => target),
    );
  }
}
