export class ProfileResponseDto {
  id: number;
  username: string;
  type: number;
  group_id: number;
  status: number;
  group_info?: {
    id: number;
    title: string;
    rules: string;
    rules_category: string;
  };

  constructor(user: any, group?: any) {
    this.id = user.id;
    this.username = user.username;
    this.type = user.type;
    this.group_id = user.group_id;
    this.status = user.status;

    if (group) {
      this.group_info = {
        id: group.id,
        title: group.title,
        rules: group.rules,
        rules_category: group.rules_category,
      };
    }
  }
}