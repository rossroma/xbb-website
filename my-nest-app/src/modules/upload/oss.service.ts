import { Injectable, Logger } from '@nestjs/common';
import OSS from 'ali-oss';

@Injectable()
export class OssService {
  private readonly logger = new Logger(OssService.name);
  private readonly client: OSS;

  /** OSS 访问域名，用于拼接最终 URL */
  private readonly baseUrl: string;

  constructor() {
    const region = process.env.OSS_REGION;
    const bucket = process.env.OSS_BUCKET;
    const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
    const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;

    if (!region || !bucket || !accessKeyId || !accessKeySecret) {
      throw new Error(
        'OSS 配置缺失：请检查 OSS_REGION、OSS_BUCKET、OSS_ACCESS_KEY_ID、OSS_ACCESS_KEY_SECRET 环境变量',
      );
    }

    // 使用 endpoint 参数显式指定 OSS 访问地址，避免 region 推断错误
    // endpoint 格式：https://{region}.aliyuncs.com
    const endpoint = process.env.OSS_ENDPOINT || `https://${region}.aliyuncs.com`;

    this.client = new OSS({
      region,
      endpoint,
      bucket,
      accessKeyId,
      accessKeySecret,
      secure: true,
    });

    // 优先使用自定义域名/CDN 域名，否则使用默认 OSS 域名
    this.baseUrl = (process.env.OSS_BASE_URL || `https://${bucket}.${region}.aliyuncs.com`).replace(/\/+$/, '');

    this.logger.log(`OSS 客户端已初始化，endpoint: ${endpoint}, bucket: ${bucket}`);
  }

  /**
   * 上传文件到 OSS
   * @param objectKey 文件在 OSS 中的路径，如 "uploads/1773303979525-394961.jpg"
   * @param buffer    文件内容
   * @param mimeType  文件 MIME 类型
   * @returns 完整的 OSS 访问 URL
   */
  async upload(objectKey: string, buffer: Buffer, mimeType: string): Promise<string> {
    try {
      const result = await this.client.put(objectKey, buffer, {
        mime: mimeType,
      });

      const url = `${this.baseUrl}/${result.name}`;
      this.logger.log(`OSS 上传成功: ${url}`);

      return url;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`OSS 上传失败: ${objectKey}`, errMsg);

      // 识别常见的 Endpoint 配置错误，给出更友好的提示
      if (errMsg.includes('must be addressed using the specified endpoint')) {
        throw new Error(
          `OSS Endpoint 配置错误：Bucket 不在当前配置的 Region。请检查 .env 中 OSS_REGION 是否正确，当前值: ${process.env.OSS_REGION}`,
        );
      }

      throw new Error(`OSS 上传失败: ${errMsg}`);
    }
  }
}