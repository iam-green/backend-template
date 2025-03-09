import { UserDto } from './user.dto';

export interface CreateUserDto extends Omit<UserDto, 'id' | 'created'> {}
