import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryService } from './gallery.service';
import { AdminGalleryController } from './admin/admin-gallery.controller';
import { ClientGalleryController } from './client/client-gallery.controller';
import { Gallery } from './entities/gallery.entity';
import { Gallery2 } from './entities/gallery2.entity';
import { Gallery3 } from './entities/gallery3.entity';
import { ShowInfo } from './entities/show-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, Gallery2, Gallery3, ShowInfo])],
  controllers: [AdminGalleryController, ClientGalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule { }