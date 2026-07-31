import { IsString, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';

/** URL 参数中的 SEM 字段仅允许字母、数字、中文、短横线和下划线，防止 XSS 注入 */
const SEM_VALUE_PATTERN = /^[\w一-鿿\-.,@()（）+\s]*$/;

/**
 * 免费试用注册 DTO
 *
 * 对应旧版 PHP 的 Message.php ajaxRegSave() 接收的 post 数据。
 * 包含企业信息 + SEM 推广参数。
 */
export class CreateTrialMessageDto {
  /** 企业名称（对应旧版 info[title]） */
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  /** 手机号（对应旧版 info[tel]） */
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  tel: string;

  /** 联系人姓名（对应旧版 info[mname]，默认 "官网试用"） */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  mname?: string;

  // ===== 企业信息 =====

  /** 企业规模（对应旧版 info[scale]） */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  scale?: string;

  /** 所属行业（对应旧版 info[industry]） */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  /** 邮箱（对应旧版 info[email]） */
  @IsOptional()
  @IsString()
  @MaxLength(30)
  email?: string;

  /** 描述/备注（对应旧版 info[descs]） */
  @IsOptional()
  @IsString()
  @MaxLength(300)
  descs?: string;

  // ===== SEM 推广参数（对应旧版 sem[xxx]） =====

  /** 投放计划（对应旧版 sem[plan]） */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(SEM_VALUE_PATTERN, { message: '投放计划包含非法字符' })
  plan?: string;

  /** 投放单元（对应旧版 sem[unit]） */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(SEM_VALUE_PATTERN, { message: '投放单元包含非法字符' })
  unit?: string;

  /** 广告关键词（对应旧版 sem[keyword]） */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(SEM_VALUE_PATTERN, { message: '广告关键词包含非法字符' })
  keyword?: string;

  /** 来源渠道（对应旧版 sem[channel]，默认 "官网"） */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(SEM_VALUE_PATTERN, { message: '来源渠道包含非法字符' })
  channel?: string;

  /** 百度 vid（对应旧版 sem[bd_vid]） */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(SEM_VALUE_PATTERN, { message: '百度 vid 包含非法字符' })
  bdVid?: string;

  /** 百度标识（对应旧版 sem[bd]） */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(SEM_VALUE_PATTERN, { message: '百度标识包含非法字符' })
  bd?: string;

  /** 扩展信息（对应旧版 cookie("extends")） */
  @IsOptional()
  @IsString()
  extends?: string;
}