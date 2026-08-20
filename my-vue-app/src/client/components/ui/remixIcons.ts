import { defineComponent, h, type Component, type PropType } from 'vue'
import {
  RiAddCircleLine,
  RiAddLine,
  RiAlipayLine,
  RiApps2Line,
  RiArrowDownSLine,
  RiArrowDownLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiAwardLine,
  RiBarChart2Line,
  RiBarChartGroupedLine,
  RiBookOpenLine,
  RiBookShelfLine,
  RiCalendarLine,
  RiChat3Line,
  RiCheckLine,
  RiCheckboxBlankCircleLine,
  RiCloseLine,
  RiCloudLine,
  RiCodeBoxFill,
  RiCodeBoxLine,
  RiComputerLine,
  RiContractLine,
  RiCursorLine,
  RiCustomerService2Line,
  RiDashboard3Fill,
  RiDashboard3Line,
  RiDeleteBinLine,
  RiDingdingLine,
  RiDownloadLine,
  RiEditLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileCopyLine,
  RiFileEditLine,
  RiFileList3Line,
  RiFileSearchLine,
  RiFileSettingsLine,
  RiFileTextLine,
  RiFilter3Line,
  RiFireLine,
  RiFlashlightLine,
  RiFolderAddLine,
  RiFolderLine,
  RiForbidLine,
  RiFullscreenLine,
  RiGiftLine,
  RiGitBranchLine,
  RiHeartLine,
  RiHistoryLine,
  RiHome3Line,
  RiInboxLine,
  RiInformationLine,
  RiLineChartFill,
  RiLineChartLine,
  RiLoader4Line,
  RiLockLine,
  RiLogoutBoxLine,
  RiLoopRightLine,
  RiMagicLine,
  RiMailLine,
  RiMapPinLine,
  RiMenuLine,
  RiMessage3Line,
  RiMoneyCnyCircleLine,
  RiPhoneLine,
  RiPlayFill,
  RiQqLine,
  RiQuestionLine,
  RiRobot2Fill,
  RiRobot2Line,
  RiRocketFill,
  RiRocketLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiSettings3Line,
  RiSettings4Line,
  RiShakeHandsLine,
  RiShareLine,
  RiShieldCheckLine,
  RiShieldLine,
  RiShoppingCartLine,
  RiStackLine,
  RiStarFill,
  RiStarLine,
  RiSubtractLine,
  RiTeamFill,
  RiTeamLine,
  RiTiktokLine,
  RiTimeLine,
  RiTodoLine,
  RiUpload2Line,
  RiUserLine,
  RiUserStarLine,
  RiVideoLine,
  RiVidiconLine,
  RiVipCrownLine,
  RiWechatChannelsLine,
  RiWechatLine,
  RiWeiboLine,
} from '@remixicon/vue'

type IconFill = string | string[]
type LegacyIconTheme = 'outline' | 'filled' | 'two-tone' | 'multi-color'

const remixIcons = {
  RiAddCircleLine,
  RiAddLine,
  RiAlipayLine,
  RiApps2Line,
  RiArrowDownSLine,
  RiArrowDownLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiAwardLine,
  RiBarChart2Line,
  RiBarChartGroupedLine,
  RiBookOpenLine,
  RiBookShelfLine,
  RiCalendarLine,
  RiChat3Line,
  RiCheckLine,
  RiCheckboxBlankCircleLine,
  RiCloseLine,
  RiCloudLine,
  RiCodeBoxFill,
  RiCodeBoxLine,
  RiComputerLine,
  RiContractLine,
  RiCursorLine,
  RiCustomerService2Line,
  RiDashboard3Fill,
  RiDashboard3Line,
  RiDeleteBinLine,
  RiDingdingLine,
  RiDownloadLine,
  RiEditLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileCopyLine,
  RiFileEditLine,
  RiFileList3Line,
  RiFileSearchLine,
  RiFileSettingsLine,
  RiFileTextLine,
  RiFilter3Line,
  RiFireLine,
  RiFlashlightLine,
  RiFolderAddLine,
  RiFolderLine,
  RiForbidLine,
  RiFullscreenLine,
  RiGiftLine,
  RiGitBranchLine,
  RiHeartLine,
  RiHistoryLine,
  RiHome3Line,
  RiInboxLine,
  RiInformationLine,
  RiLineChartFill,
  RiLineChartLine,
  RiLoader4Line,
  RiLockLine,
  RiLogoutBoxLine,
  RiLoopRightLine,
  RiMagicLine,
  RiMailLine,
  RiMapPinLine,
  RiMenuLine,
  RiMessage3Line,
  RiMoneyCnyCircleLine,
  RiPhoneLine,
  RiPlayFill,
  RiQqLine,
  RiQuestionLine,
  RiRobot2Fill,
  RiRobot2Line,
  RiRocketFill,
  RiRocketLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiSettings3Line,
  RiSettings4Line,
  RiShakeHandsLine,
  RiShareLine,
  RiShieldCheckLine,
  RiShieldLine,
  RiShoppingCartLine,
  RiStackLine,
  RiStarFill,
  RiStarLine,
  RiSubtractLine,
  RiTeamFill,
  RiTeamLine,
  RiTiktokLine,
  RiTimeLine,
  RiTodoLine,
  RiUpload2Line,
  RiUserLine,
  RiUserStarLine,
  RiVideoLine,
  RiVidiconLine,
  RiVipCrownLine,
  RiWechatChannelsLine,
  RiWechatLine,
  RiWeiboLine,
} as Record<string, Component>
const fallbackIcon = RiQuestionLine as Component

function normalizeSize(size: string | number | undefined): string {
  if (typeof size === 'number') return `${size}px`
  return size || '1em'
}

function normalizeColor(fill: IconFill | undefined, color: string | undefined): string {
  if (color) return color
  if (Array.isArray(fill)) {
    return fill.find((item) => item && item !== 'none' && item !== 'transparent') || 'currentColor'
  }
  return fill && fill !== 'none' && fill !== 'transparent' ? fill : 'currentColor'
}

function stringifyClass(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(stringifyClass).filter(Boolean).join(' ')
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([name]) => name)
      .join(' ')
  }
  return ''
}

function createIcon(remixName: string) {
  const icon = (remixIcons[remixName] || fallbackIcon) as Component

  return defineComponent({
    name: remixName.replace(/^Ri/, ''),
    inheritAttrs: false,
    props: {
      size: {
        type: [String, Number] as PropType<string | number>,
        default: '1em',
      },
      color: String,
      fill: {
        type: [String, Array] as PropType<IconFill>,
        default: undefined,
      },
      className: String,
      theme: String as PropType<LegacyIconTheme>,
      strokeWidth: Number,
      strokeLinecap: String,
      strokeLinejoin: String,
    },
    setup(props, { attrs }) {
      return () =>
        h(icon, {
          ...attrs,
          size: normalizeSize(props.size),
          color: normalizeColor(props.fill, props.color),
          className: [stringifyClass(attrs.class), props.className].filter(Boolean).join(' '),
          'aria-hidden': attrs['aria-hidden'] ?? 'true',
        })
    },
  })
}

export const AddOne = createIcon('RiAddCircleLine')
export const Agreement = createIcon('RiContractLine')
export const Alipay = createIcon('RiAlipayLine')
export const AllApplication = createIcon('RiApps2Line')
export const ApiApp = createIcon('RiCodeBoxLine')
export const ApiAppFill = createIcon('RiCodeBoxFill')
export const ArrowDown = createIcon('RiArrowDownLine')
export const ArrowRight = createIcon('RiArrowRightLine')
export const Audit = createIcon('RiShieldCheckLine')
export const BookOpen = createIcon('RiBookOpenLine')
export const Bookshelf = createIcon('RiBookShelfLine')
export const Branch = createIcon('RiGitBranchLine')
export const Calendar = createIcon('RiCalendarLine')
export const CarouselVideo = createIcon('RiVidiconLine')
export const CategoryManagement = createIcon('RiStackLine')
export const Caution = createIcon('RiErrorWarningLine')
export const Certificate = createIcon('RiAwardLine')
export const ChartHistogram = createIcon('RiBarChart2Line')
export const Check = createIcon('RiCheckLine')
export const CheckOne = createIcon('RiCheckLine')
export const CheckSmall = createIcon('RiCheckLine')
export const Checklist = createIcon('RiTodoLine')
export const ChevronLeft = createIcon('RiArrowLeftSLine')
export const ChevronRight = createIcon('RiArrowRightSLine')
export const ClickTap = createIcon('RiCursorLine')
export const Close = createIcon('RiCloseLine')
export const CloseSmall = createIcon('RiCloseLine')
export const Comment = createIcon('RiChat3Line')
export const CooperativeHandshake = createIcon('RiShakeHandsLine')
export const Copy = createIcon('RiFileCopyLine')
export const Cycle = createIcon('RiLoopRightLine')
export const DataDisplay = createIcon('RiDashboard3Line')
export const DataDisplayFill = createIcon('RiDashboard3Fill')
export const Delete = createIcon('RiDeleteBinLine')
export const Dingding = createIcon('RiDingdingLine')
export const DocDetail = createIcon('RiFileList3Line')
export const Down = createIcon('RiArrowDownSLine')
export const Download = createIcon('RiDownloadLine')
export const Edit = createIcon('RiEditLine')
export const Eyes = createIcon('RiEyeLine')
export const FileEditing = createIcon('RiFileEditLine')
export const FileSearch = createIcon('RiFileSearchLine')
export const FileSettings = createIcon('RiFileSettingsLine')
export const FileText = createIcon('RiFileTextLine')
export const Filter = createIcon('RiFilter3Line')
export const Fire = createIcon('RiFireLine')
export const FolderPlus = createIcon('RiFolderAddLine')
export const Forbid = createIcon('RiForbidLine')
export const Fullscreen = createIcon('RiFullscreenLine')
export const Gift = createIcon('RiGiftLine')
export const Hamburger = createIcon('RiMenuLine')
export const Headset = createIcon('RiCustomerService2Line')
export const Heart = createIcon('RiHeartLine')
export const Help = createIcon('RiQuestionLine')
export const History = createIcon('RiHistoryLine')
export const Home = createIcon('RiHome3Line')
export const Inbox = createIcon('RiInboxLine')
export const Income = createIcon('RiMoneyCnyCircleLine')
export const Info = createIcon('RiInformationLine')
export const Left = createIcon('RiArrowLeftSLine')
export const Level = createIcon('RiBarChartGroupedLine')
export const LinkCloud = createIcon('RiCloudLine')
export const Loading = createIcon('RiLoader4Line')
export const Local = createIcon('RiMapPinLine')
export const Lock = createIcon('RiLockLine')
export const LoopOnce = createIcon('RiLoopRightLine')
export const Magic = createIcon('RiMagicLine')
export const Mail = createIcon('RiMailLine')
export const Message = createIcon('RiMessage3Line')
export const Monitor = createIcon('RiComputerLine')
export const People = createIcon('RiUserLine')
export const Peoples = createIcon('RiTeamLine')
export const PeoplesFill = createIcon('RiTeamFill')
export const Phone = createIcon('RiPhoneLine')
export const PhoneTelephone = createIcon('RiPhoneLine')
export const Play = createIcon('RiPlayFill')
export const Plus = createIcon('RiAddLine')
export const Protect = createIcon('RiShieldCheckLine')
export const Right = createIcon('RiArrowRightSLine')
export const Robot = createIcon('RiRobot2Line')
export const RobotFill = createIcon('RiRobot2Fill')
export const Rocket = createIcon('RiRocketLine')
export const RocketFill = createIcon('RiRocketFill')
export const Round = createIcon('RiCheckboxBlankCircleLine')
export const SalesReport = createIcon('RiLineChartLine')
export const Search = createIcon('RiSearchLine')
export const SendOne = createIcon('RiSendPlaneLine')
export const Setting = createIcon('RiSettings3Line')
export const SettingComputer = createIcon('RiComputerLine')
export const SettingConfig = createIcon('RiSettings4Line')
export const ShareSys = createIcon('RiShareLine')
export const Shield = createIcon('RiShieldLine')
export const ShoppingCart = createIcon('RiShoppingCartLine')
export const Star = createIcon('RiStarLine')
export const StarFill = createIcon('RiStarFill')
export const Subtract = createIcon('RiSubtractLine')
export const TencentQq = createIcon('RiQqLine')
export const Thunderbolt = createIcon('RiFlashlightLine')
export const Tiktok = createIcon('RiTiktokLine')
export const Time = createIcon('RiTimeLine')
export const Trend = createIcon('RiLineChartLine')
export const TrendFill = createIcon('RiLineChartFill')
export const Up = createIcon('RiArrowUpSLine')
export const User = createIcon('RiUserLine')
export const UserBusiness = createIcon('RiUserStarLine')
export const VideoOne = createIcon('RiVideoLine')
export const Vip = createIcon('RiVipCrownLine')
export const Wechat = createIcon('RiWechatLine')
export const WechatVideo = createIcon('RiWechatChannelsLine')
export const Weibo = createIcon('RiWeiboLine')
export const Upload = createIcon('RiUpload2Line')
export const Logout = createIcon('RiLogoutBoxLine')
export const Hide = createIcon('RiEyeOffLine')
export const Folder = createIcon('RiFolderLine')
