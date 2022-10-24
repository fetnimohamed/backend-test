import { IsEmail, IsObject, isString, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  public matricule: string;

  @IsString()
  public password: string;
}
export class AuthOperateurDto {
  @IsObject()
  public user: any

}

