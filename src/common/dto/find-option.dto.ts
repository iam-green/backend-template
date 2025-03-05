import { tags } from 'typia';

export interface FindOptionDto {
  /**
   * The page sort order.
   */
  sort?: 'asc' | 'desc';

  /**
   * The page number.
   */
  page?: number & tags.Example<1> & tags.Default<1> & tags.Minimum<1>;

  /**
   * The page size.
   */
  limit?: number & tags.Example<10> & tags.Default<10> & tags.Minimum<1>;

  /**
   * The minimum date to search by creation date.
   * Can accept a number in timestamp format.
   */
  from?: number & tags.Type<'int64'> & tags.Example<0>;

  /**
   * The maximum date to search by creation date.
   * Can accept a number in timestamp format.
   */
  to?: number & tags.Type<'int64'> & tags.Example<1106265600000>;
}
