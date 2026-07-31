export class AdminResponseDto {
  id: number;
  username: string;
  status: number;
  type: number;
  group_id?: number;
  group_name?: string;
}

export class AdminGroupResponseDto {
  id: number;
  title: string;
  rules?: string;
  rules_category?: string;
  status: number;
}

export class AdminActionResponseDto {
  id: number;
  parent_id: number;
  action_code: string;
  action_name: string;
  ord: number;
  url?: string;
  status: number;
  children: AdminActionResponseDto[];
}