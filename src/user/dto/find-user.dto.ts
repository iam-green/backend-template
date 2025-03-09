import { FindOptionDto } from 'src/common/dto';
import { UserDto } from './user.dto';

export interface FindUserDto extends Partial<UserDto>, FindOptionDto {}
