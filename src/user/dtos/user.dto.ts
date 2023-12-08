import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  publicKey: string;
  @Expose()
  snc: string;
  @Expose()
  pendingSnc: string;
}
