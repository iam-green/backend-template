import { FindOptionDto } from 'src/common/dto';
import { UserDto } from './user.dto';

export type FindUserDto = Partial<UserDto> & FindOptionDto;
