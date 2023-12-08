import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  publicKey: string;
  @Expose({ name: 'snc' })
  totalSnc: string;
  @Expose()
  pendingSnc: string;
}
