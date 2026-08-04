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
import { CreateAdsTypeDto } from '../dto/create-ads-type.dto';
import { UpdateAdsTypeDto } from '../dto/update-ads-type.dto';
import { OperationLog } from '../../logs/decorators/operation-log.decorator';
import { OperationLogInterceptor } from '../../logs/interceptors/operation-log.interceptor';

@Controller('v1/admin/ads-types')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OperationLogInterceptor)
@RequirePermissions('adstypes', '37', 'adsType', '51')
export class AdminAdsTypeController {
  constructor(private readonly adsService: AdsService) { }

  @Post()
  @OperationLog({ title: '广告位', type: 1, targetFields: ['title'], titlePrefix: '广告位：' })
  create(@Body() createAdsTypeDto: CreateAdsTypeDto) {
    return this.adsService.createAdsType(createAdsTypeDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.adsService.findAllAdsTypes(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      sortBy || 'id_desc',
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adsService.findOneAdsType(id);
  }

  @Put(':id')
  @OperationLog({ title: '广告位', type: 2, targetFields: ['title'], titlePrefix: '广告位：' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdsTypeDto: UpdateAdsTypeDto,
  ) {
    return this.adsService.updateAdsType(id, updateAdsTypeDto);
  }

  @Delete(':id')
  @OperationLog({ title: '广告位', type: 3, targetFields: ['title'], titlePrefix: '广告位：' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adsService.findOneAdsType(id).then((target) =>
      this.adsService.removeAdsType(id).then(() => target),
    );
  }
}
