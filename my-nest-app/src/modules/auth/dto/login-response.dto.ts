export class LoginResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    type: number;
    group_id: number;
    status: number;
  };

  constructor(token: string, user: any, expiresIn: number = 7200) {
    this.access_token = token;
    this.token_type = 'Bearer';
    this.expires_in = expiresIn;
    this.user = {
      id: user.id,
      username: user.username,
      type: user.type,
      group_id: user.group_id,
      status: user.status,
    };
  }
}