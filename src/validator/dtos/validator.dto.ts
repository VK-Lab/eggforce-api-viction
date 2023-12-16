import { Expose } from 'class-transformer';

class PositionDto {
  @Expose()
  lat: number;
  @Expose()
  lng: number;
}
export class ValidatorDto {
  @Expose()
  publicKey: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  logoUrl: string;
  @Expose()
  position: PositionDto;
  @Expose()
  isActiveValidator: boolean;
}
