import { RESULT_INFO_FRAGMENT } from '@graphql/operations/fragment/result-info';
import gql from 'graphql-tag';
import { TAG_FRAGMENT } from '../fragment/tag';
export const TAG_LIST_QUERY = gql`
  query ListaTags($page: Int, $itemsPage: Int, $active: ActiveFilterEnum) {
    tags(page: $page, itemsPage: $itemsPage, active: $active) {
      info {
        ...ResultInfoObject
      }
      status
      message
      tags {
        ...TagObject
      }
    }
  }
  ${ TAG_FRAGMENT}
  ${ RESULT_INFO_FRAGMENT}
`;