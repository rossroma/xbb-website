import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * 合作伙伴查询入参 DTO
 * 前端只需传入关键词，后端负责拼装三方 API 所需完整请求体
 */
export class QueryPartnerDto {
  @IsString({ message: '关键词必须为字符串' })
  @IsNotEmpty({ message: '请输入企业名称或合作伙伴编号' })
  @MaxLength(200, { message: '关键词长度不能超过200个字符' })
  keyword: string;
}