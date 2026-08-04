import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import sharp = require('sharp');
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const uploadDir = join(process.cwd(), 'uploads');
const thumbDir = join(process.cwd(), 'uploads', 'thumbs');
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
if (!existsSync(thumbDir)) mkdirSync(thumbDir, { recursive: true });

@Controller('v1/admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          return cb(new BadRequestException('只允许上传图片文件'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('thumb') thumb?: string,
    @Query('maxWidth') maxWidth?: string,
    @Query('maxHeight') maxHeight?: string,
  ) {
    if (!file) throw new BadRequestException('请选择要上传的文件');

    // 校验文件魔术字节，确保是真实图片（非仅依赖 MIME 类型）
    try {
      const metadata = await sharp(file.buffer).metadata();
      if (!metadata.format) {
        throw new BadRequestException('无法识别的图片格式');
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('文件不是有效的图片');
    }

    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = extname(file.originalname).toLowerCase();
    const filename = `${unique}${ext}`;
    const filepath = join(uploadDir, filename);

    const w = maxWidth ? parseInt(maxWidth) : 1920;
    const h = maxHeight ? parseInt(maxHeight) : 1920;

    const compressed = await sharp(file.buffer)
      .resize(w, h, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    writeFileSync(filepath, compressed);

    const result: any = {
      url: `/uploads/${filename}`,
      filename: file.originalname,
      size: compressed.length,
    };

    if (thumb === '1') {
      const thumbFilename = `thumb_${filename}`;
      const thumbPath = join(thumbDir, thumbFilename);
      const thumbBuffer = await sharp(file.buffer)
        .resize(300, 300, { fit: 'cover' })
        .toBuffer();
      writeFileSync(thumbPath, thumbBuffer);
      result.thumb_url = `/uploads/thumbs/${thumbFilename}`;
    }

    return result;
  }
}
